package main

import (
	"context"
	"fmt"
	"gitlab/live/be-live-admin/cmd/admin/handler"
	"gitlab/live/be-live-admin/conf"
	"gitlab/live/be-live-admin/datasource"
	cmiddleware "gitlab/live/be-live-admin/middleware"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/repository"
	"gitlab/live/be-live-admin/service"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "gitlab/live/be-live-admin/docs"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

type CustomValidator struct {
	validator *validator.Validate
}

// Validate method to perform validation using the validator library
func (cv *CustomValidator) Validate(i interface{}) error {
	if err := cv.validator.Struct(i); err != nil {
		return fmt.Errorf("validation error: %w", err)
	}
	return nil
}

// @title          			   Admin API Live Stream
// @version         		   1.0
// @description     		   Swagger API Admin Live Stream.
// @host            		   localhost:8686
// @BasePath       			   /
// @securityDefinitions.apikey Bearer
// @in                         header
// @name                       Authorization
func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	ds, err := datasource.NewDataSource()
	if err != nil {
		log.Fatal(err)
	}

	if err := ds.DB.AutoMigrate(&model.Role{}, &model.User{}, &model.AdminLog{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	repo := repository.NewRepository(ds.DB)
	streamServerConfig := conf.GetStreamServerConfig()
	streamServer := service.NewStreamServerService(streamServerConfig.HTTPURL, streamServerConfig.RTMPURL)
	//roleService := service.NewRoleService(repo, ds.RClient)
	srv := service.NewService(repo, ds.RedisStore, streamServer)
	conf.SeedRoles(srv.Role)
	conf.SeedSuperAdminUser(srv.User, srv.Role)
	conf.SeedActions(srv.Admin)
	if err := repo.User.SetRoleMap(); err != nil {
		log.Fatalf("Failed to set role map: %v", err)
	}

	log.Println("Seeding completed successfully")

	// conf.SeedRoles(srv.Role)
	// appConfig := conf.GetApplicationConfig()

	// srv := service.NewService(repo, ds.RClient)

	e := echo.New()
	e.Server.MaxHeaderBytes = 10 << 20 //10MB

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// it would be messed up if config change to other paths
	e.Use(cmiddleware.ExcludePathMiddleware("/api/file/recordings/"))

	// Use CORS middleware, for local run
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     conf.GetApplicationConfig().AllowedOrigins,                                                                         // Allow all origins (use specific origins for production)
		AllowMethods:     []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodPatch, http.MethodDelete, http.MethodOptions}, // Allowed HTTP methods
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Access-Token"},                                    // Allowed headers
		AllowCredentials: true,                                                                                                               // Allow credentials like cookies
	}))

	v := validator.New()
	// Register custom validator with Echo
	e.Validator = &CustomValidator{validator: v}
	log.Println(conf.GetFileStorageConfig().RootFolder)

	root := e.Group("/")
	handler := handler.NewHandler(root, srv)

	fileH := e.Group("/api/file")
	fileH.GET("/avatar/:filename", func(c echo.Context) error {
		avatarPath := conf.GetFileStorageConfig().AvatarFolder + c.Param("filename")

		return c.File(avatarPath)
	})

	fileH.Use(handler.JWTMiddleware())
	fileH.Static("/", conf.GetFileStorageConfig().RootFolder)

	e.GET("/swagger/*", echoSwagger.WrapHandler)

	handler.Register()

	go func() {
		if err := e.Start(fmt.Sprintf(":%d", conf.GetApplicationConfig().Port)); err != nil && err != http.ErrServerClosed {
			log.Println(err)
			e.Logger.Fatal("shutting down the server")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)

	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}

}
