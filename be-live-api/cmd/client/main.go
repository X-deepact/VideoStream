package main

import (
	"context"
	"fmt"
	"gitlab/live/be-live-api/cache"
	"gitlab/live/be-live-api/cmd/client/handler"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/cron"
	"gitlab/live/be-live-api/datasource"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"
	"gitlab/live/be-live-api/service"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	cmiddleware "gitlab/live/be-live-api/pkg/middleware"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	echoSwagger "github.com/swaggo/echo-swagger"
	_ "gitlab/live/be-live-api/docs"
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

// @title          			   API Live Stream
// @version         		   1.0
// @description     		   Swagger API Live Stream.
// @host            		   localhost:8787
// @BasePath       			   /
// @securityDefinitions.apikey BearerAuth
// @in                         header
// @name                       Authorization
func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	ds, err := datasource.NewDataSource()
	if err != nil {
		log.Fatal(err)
	}

	repo := repository.NewRepository(ds.DB)

	srv := service.NewService(repo, ds.RedisStore)

	if err := utils.InitFolder(); err != nil {
		log.Fatal(err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	var wsWg sync.WaitGroup

	// cron
	cron.NewCron(srv, ctx, &wsWg)

	appCfg := conf.GetApplicationConfig()

	e := echo.New()

	e.GET("/swagger/*", echoSwagger.WrapHandler)

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: appCfg.AllowedOrigins,
		AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
	}))

	e.Use(utils.SkipMiddleware)
	e.Static("/html", "./html")

	e.Server.MaxHeaderBytes = 10 << 20 //10MB

	// Middleware
	// e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	// it would be messed up if config change to other paths
	e.Use(cmiddleware.ExcludePathMiddleware("/api/file/recordings/", "/api/file/scheduled_videos/"))

	v := validator.New()
	// Register custom validator with Echo
	e.Validator = &CustomValidator{validator: v}

	fileH := e.Group("/api/file")

	fileH.GET("/videos/:filename", func(c echo.Context) error {
		videoName := c.Param("filename")
		cacheKey := fmt.Sprintf(cache.VIDEO_ENCODING_PREFIX, videoName)
		isEncoding, _ := cache.GetRedisValWithTyped[bool](ds.RedisStore, c.Request().Context(), cacheKey)
		if isEncoding {
			return utils.BuildSuccessResponse(c, http.StatusAccepted, map[string]string{
				"message": "The video is currently being encoded. Please try again later.",
			})
		}
		videosPath := conf.GetFileStorageConfig().VideoFolder + videoName

		return c.File(videosPath)

	})

	fileH.Static("/", conf.GetFileStorageConfig().RootFolder)

	root := e.Group("/")

	handler := handler.NewHandler(root, srv, ctx, &wsWg)
	handler.Register()

	go func() {
		if err := e.Start(fmt.Sprintf(":%d", appCfg.Port)); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server")
		}
	}()

	<-ctx.Done()
	log.Println("Shutdown signal received, shutting down server...")

	wsWg.Wait()

	// Create a context with timeout for server shutdown
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := e.Shutdown(shutdownCtx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server shutdown gracefully.")

}
