package utils

import (
	"gitlab/live/be-live-api/conf"
	api_model "gitlab/live/be-live-api/dto"
	"gopkg.in/gomail.v2"
)

func SendMail(mail api_model.MailModel) error {
	conf := conf.GetMailConfig()

	m := gomail.NewMessage()
	m.SetHeader("From", conf.Email)
	m.SetHeader("To", mail.Email)
	m.SetHeader("Subject", mail.Subject)
	m.SetBody("text/plain", mail.Content)

	//Config SMTP
	d := gomail.NewDialer(conf.Host, conf.Port, conf.Email, conf.Password)

	//Send email
	if err := d.DialAndSend(m); err != nil {
		return err
	}

	return nil
}
