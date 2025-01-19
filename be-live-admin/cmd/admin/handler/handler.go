package handler

import (
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"log"
	"net/http"
	"slices"
	"strings"

	"github.com/labstack/echo/v4"
)

type Handler struct {
	r   *echo.Group
	srv *service.Service
}

func NewHandler(r *echo.Group, srv *service.Service) *Handler {
	return &Handler{
		r:   r,
		srv: srv,
	}
}

func (h *Handler) Register() {

	newAuthHandler(h.r, h.srv)
	newUserHandler(h.r, h.srv)
	newAdminHandler(h.r, h.srv)
	newStreamHandler(h.r, h.srv)
	newCategoryHandler(h.r, h.srv)

}

func (h *Handler) JWTMiddleware() echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			// Extract token from Authorization header
			authHeader := c.Request().Header.Get("Authorization")
			if authHeader == "" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Missing token"})
			}

			// Validate token
			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid token format"})
			}

			tokenString := tokenParts[1]
			claims, err := utils.ValidateAccessToken(tokenString)
			if err != nil {
				if err.Error() == "token is expired" {
					if err := h.srv.User.ChangeStatusUserByID(claims.ID, claims.ID, model.OFFLINE); err != nil {
						log.Println(err)
						return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid or expired token"})
					}
				}
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid or expired token"})
			}

			if !slices.Contains([]model.RoleType{model.ADMINROLE, model.SUPPERADMINROLE}, claims.RoleType) {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Permission denied"})
			}

			// check blacklist
			inBlacklist, err := h.srv.GetCache(c.Request().Context(), tokenString)

			if inBlacklist != "" || err != nil {
				return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid or expired token"})
			}

			// Attach claims to the context
			c.Set("user", claims)

			// Call the next handler
			return next(c)
		}
	}
}
