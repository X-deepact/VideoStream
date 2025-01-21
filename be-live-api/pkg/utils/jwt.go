package utils

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-api/model"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// Create a struct that will be encoded to a JWT.
// We add jwt.RegisteredClaims as an embedded type, to provide fields like expiry time
type Claims struct {
	ID       uint                 `json:"id"`
	Username string               `json:"username"`
	Email    string               `json:"email"`
	RoleType model.RoleType       `json:"role_type"`
	Status   model.UserStatusType `json:"status"`
	jwt.RegisteredClaims
}

// Secret key (must be kept private and secure)
var jwtSecret = []byte("your-very-secure-secret-key")

// generate admin access token
func GenerateAccessToken(id uint, username string, email string, roleType model.RoleType) (string, time.Time, error) {
	// Declare the expiration time of the token
	// here, we have kept it as 5 minutes
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		ID:       id,
		Username: username,
		Email:    email,
		RoleType: roleType,
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	ss, err := token.SignedString(jwtSecret)

	if err != nil {
		log.Printf("Failed to sign the token: %v\n", err)
		return "", time.Now(), err
	}

	return ss, expirationTime, nil
}

func ValidateAccessToken(tokenString string) (*Claims, error) {

	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Ensure the signing method is HS256
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil

}

func GenerateRefreshToken(token string) (string, time.Time, error) {
	claim, err := ValidateAccessToken(token)
	if err != nil {
		return "", time.Now(), err
	}

	// We ensure that a new token is not issued until enough time has elapsed
	// In this case, a new token will only be issued if the old token is within
	// 30 seconds of expiry. Otherwise, return a bad request status
	if time.Until(claim.ExpiresAt.Time) > 30*time.Second {
		return "", time.Now(), errors.New("token is not expired, yet")
	}

	refreshToken, expirationTime, err := GenerateAccessToken(claim.ID, claim.Username, claim.Email, model.RoleType(claim.RoleType))
	if err != nil {
		return "", time.Now(), err
	}
	return refreshToken, expirationTime, nil
}
