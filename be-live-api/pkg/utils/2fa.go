package utils

import (
	"encoding/base64"
	"errors"
	"fmt"
	"gitlab/live/be-live-api/conf"
	"log"

	"github.com/pquerna/otp/totp"
	"github.com/skip2/go-qrcode"
)

func GetQrCode(username string, secretKey string) (string, string, error) {
	issuer := conf.GetGgAuthConfig().Issuer
	otpURL := ""

	if secretKey != "" {
		otpURL = fmt.Sprintf("otpauth://totp/%s:%s?secret=%s&issuer=%s&algorithm=SHA1&digits=6&period=30",
			issuer, username, secretKey, issuer)
	} else {
		key, err := totp.Generate(totp.GenerateOpts{
			Issuer:      issuer,
			AccountName: username,
		})
		log.Println(err, key)
		if err != nil {
			return "", "", errors.New("error generating key")
		}

		otpURL = key.URL()
		secretKey = key.Secret()
	}

	qrCodeBytes, err := qrcode.Encode(otpURL, qrcode.Medium, 256)
	if err != nil {
		return "", "", errors.New("error generating QR code")
	}

	return secretKey, base64.StdEncoding.EncodeToString(qrCodeBytes), nil
}

func CheckTotp(code string, secretKey string) bool {
	return totp.Validate(code, secretKey)
}
