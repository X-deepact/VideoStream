package dto

type TwoFADto struct {
	Secret       string `json:"secret"`
	QrCode       string `json:"qr_code"`
	Is2faEnabled bool   `json:"is2fa_enabled"`
}

type ChangeTwoFAStatusRequest struct {
	IsEnabled *bool `json:"is_enabled" from:"is_enabled" validate:"required"`
}

type ChangeTwoFAStatusResponse struct {
	IsVerified bool `json:"is_verified"`
}

type VerifyTwoFA struct {
	OTP string `json:"otp" from:"otp" validate:"required"`
}
