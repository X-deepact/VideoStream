package enum

type OtpAction string

const (
	ForgotPassword OtpAction = "forgot-password"
)

func (a OtpAction) String() string {
	switch a {
	case ForgotPassword:
		return "forgot-password"
	default:
		return "unknown"
	}
}
