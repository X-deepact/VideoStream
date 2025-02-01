package utils

import (
	"crypto/rand"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateOTP(length int) (string, error) {
	const digits = "0123456789"
	otp := make([]byte, length)

	// Generate cryptographically secure random bytes
	_, err := rand.Read(otp)
	if err != nil {
		return "", fmt.Errorf("failed to generate OTP: %w", err)
	}

	// Convert random bytes to numeric digits
	for i := range otp {
		otp[i] = digits[otp[i]%10]
	}

	return string(otp), nil
}

func HashOTP(otp string) (string, error) {
	hashedOTP, err := bcrypt.GenerateFromPassword([]byte(otp), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}
	return string(hashedOTP), nil

}

func VerifyOTP(userOTP, plainOTP string) error {
	return bcrypt.CompareHashAndPassword([]byte(userOTP), []byte(plainOTP))
}
