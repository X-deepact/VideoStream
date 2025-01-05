package middleware

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func ExcludePathMiddleware(excludedPaths ...string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			for _, excludedPath := range excludedPaths {
				if strings.HasPrefix(c.Request().URL.Path, excludedPath) {
					return c.String(http.StatusForbidden, "Access to this folder is restricted")
				}
			}
			return next(c)
		}
	}
}
