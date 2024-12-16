package main

import (
	"context"
	"fmt"
	"gitlab/live/be-live-api/cmd/client/handler"
	"gitlab/live/be-live-api/conf"
	"gitlab/live/be-live-api/datasource"
	"gitlab/live/be-live-api/pkg/utils"
	"gitlab/live/be-live-api/repository"
	"gitlab/live/be-live-api/service"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

func main() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	ds, err := datasource.NewDataSource()
	if err != nil {
		log.Fatal(err)
	}

	repo := repository.NewRepository(ds.DB)

	srv := service.NewService(repo, ds.RClient)

	if err := utils.InitFolder(); err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:8080", "http://localhost:5173"},
		AllowMethods: []string{http.MethodGet, http.MethodHead, http.MethodPut, http.MethodPatch, http.MethodPost, http.MethodDelete},
	}))

	e.Use(utils.SkipMiddleware)
	e.Static("/html", "./html")

	e.Server.MaxHeaderBytes = 10 << 20 //10MB

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	v := validator.New()
	// Register custom validator with Echo
	e.Validator = &CustomValidator{validator: v}

	e.Static("/api/file", conf.GetFileStorageConfig().RootFolder)

	root := e.Group("/")

	handler := handler.NewHandler(root, srv)
	handler.Register()

	appCfg := conf.GetApplicationConfig()

	go func() {
		if err := e.Start(fmt.Sprintf(":%d", appCfg.Port)); err != nil && err != http.ErrServerClosed {
			e.Logger.Fatal("shutting down the server")
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM, syscall.SIGQUIT)
	<-quit
	fmt.Println("Shutting down server...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := e.Shutdown(ctx); err != nil {
		e.Logger.Fatal(err)
	}

	fmt.Println("Server gracefully stopped")

}
