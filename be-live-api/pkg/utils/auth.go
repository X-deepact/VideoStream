package utils

import (
	"errors"
	"gitlab/live/be-live-api/model"
	"log"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

func SkipMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		excludedPaths := []string{"/api/auth/", "/ws/", "/html/", "/api/file/avatar/"}
		requestPath := c.Request().URL.Path

		log.Println(requestPath)

		// Check if the request path matches any excluded path
		for _, prefix := range excludedPaths {
			if strings.HasPrefix(requestPath, prefix) {
				// Skip the middleware logic
				return next(c)
			}
		}

		// Apply middleware logic (e.g., authentication)
		authHeader := c.Request().Header.Get("Authorization")
		if authHeader == "" {
			return BuildErrorResponse(c, http.StatusUnauthorized, errors.New("missing token"), nil)
		}

		// Validate token
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) == 2 && tokenParts[0] == "Bearer" && tokenParts[1] == "" {
			return BuildErrorResponse(c, http.StatusUnauthorized, errors.New("invalid token format"), nil)
		}

		tokenString := strings.Trim(strings.ReplaceAll(authHeader, "Bearer", ""), "* ")
		claims, err := ValidateAccessToken(tokenString)
		if err != nil {
			return BuildErrorResponse(c, http.StatusUnauthorized, errors.New("invalid or expired token"), nil)
		}

		// Attach claims to the context
		c.Set("user", claims)

		return next(c)
	}
}

func JWTMiddlewareStreamer() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			claims := c.Get("user").(*Claims)
			roleType := claims.RoleType
			if model.STREAMER != roleType {
				return BuildErrorResponse(c, http.StatusUnauthorized, errors.New("you haven't authorized the role streamer"), nil)
			}
			// Call the next handler
			return next(c)
		}
	}
}
