package conf

import (
	"gopkg.in/ini.v1"
	"log"
)

var cfg *Config

type Config struct {
	DB           DBConfig           `ini:"database"`
	Redis        RedisConfig        `ini:"redis"`
	StreamServer StreamServerConfig `ini:"stream_server"`
	Auth         AuthConfig         `ini:"auth"`
	Mail         MailConfig         `ini:"mail"`
	FileStorage  FileStorageConfig  `ini:"file_storage"`
	Web          ApplicationConfig  `ini:"web"`
	ApiFile      ApiFileConfig      `ini:"api_file"`
	TwoFAAuth    TwoFAAuthConfig    `ini:"2fa_auth"`
}

type DBConfig struct {
	Host string `ini:"host"`
	Port int    `ini:"port"`
	User string `ini:"user"`
	Pass string `ini:"pass"`
	Name string `ini:"name"`
}

type RedisConfig struct {
	Host string `ini:"host"`
	Port int    `ini:"port"`
	User string `ini:"user"`
	Pass string `ini:"pass"`
}

type ApplicationConfig struct {
	Port           int      `ini:"port"`
	AllowedOrigins []string `ini:"allowed_origins"`
}

type StreamServerConfig struct {
	HTTPURL string `ini:"http_url"`
	RTMPURL string `ini:"rtmp_url"`
	HLSURL  string `ini:"hls_url"`
}

type AuthConfig struct {
	SecretKey string `ini:"secret_key"`
}

type MailConfig struct {
	Email    string `ini:"email"`
	Password string `ini:"password"`
	Host     string `ini:"host"`
	Port     int    `ini:"port"`
}

type FileStorageConfig struct {
	RootFolder            string `ini:"root_folder"`
	ThumbnailFolder       string `ini:"thumbnail_folder"`
	AvatarFolder          string `ini:"avatar_folder"`
	LiveFolder            string `ini:"live_folder"`
	ScheduledVideosFolder string `ini:"scheduled_videos_folder"`
	VideoFolder           string `ini:"video_folder"`
	LogFolder             string `ini:"log_folder"`
}

type TwoFAAuthConfig struct {
	Issuer string `ini:"issuer"`
}

type ApiFileConfig struct {
	Url string `ini:"url"`
}

//func LoadYaml(path string) (*Config, error) {
//	file, err := os.Open(path)
//	if err != nil {
//		return nil, err
//	}
//	defer file.Close()
//
//	var cfg Config
//	decoder := yaml.NewDecoder(file)
//	if err := decoder.Decode(&cfg); err != nil {
//		return nil, err
//	}
//
//	return &cfg, nil
//}

func LoadConfig(path string) (*Config, error) {
	cfg := new(Config)

	// Load the INI file
	iniFile, err := ini.Load(path)
	if err != nil {
		return nil, err
	}

	// Map the sections to the struct fields
	if err := iniFile.MapTo(cfg); err != nil {
		return nil, err
	}

	return cfg, nil
}

func init() {
	var err error
	if cfg, err = LoadConfig("conf/config.ini"); err != nil {
		log.Fatal(err)
	}
}

func GetDatabaseConfig() *DBConfig {
	return &cfg.DB
}

func GetRedisConfig() *RedisConfig {
	return &cfg.Redis
}

func GetStreamServerConfig() *StreamServerConfig {
	return &cfg.StreamServer
}

func GetAuthConfig() *AuthConfig {
	return &cfg.Auth
}

func GetMailConfig() *MailConfig {
	return &cfg.Mail
}

func GetFileStorageConfig() *FileStorageConfig {
	return &cfg.FileStorage
}

func GetApplicationConfig() *ApplicationConfig {
	return &cfg.Web
}

func GetApiFileConfig() *ApiFileConfig { return &cfg.ApiFile }

func GetGgAuthConfig() *TwoFAAuthConfig { return &cfg.TwoFAAuth }
