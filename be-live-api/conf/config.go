package conf

import (
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

var cfg *Config

type Config struct {
	DB           DBConfig           `yaml:"database"`
	Redis        RedisConfig        `yaml:"redis"`
	StreamServer StreamServerConfig `yaml:"stream_server"`
	Auth         AuthConfig         `yaml:"auth"`
	Mail         MailConfig         `yaml:"mail"`
	FileStorage  FileStorageConfig  `yaml:"file_storage"`
	Web          ApplicationConfig  `yaml:"web"`
	ApiFile      ApiFileConfig      `yaml:"api_file"`
	TwoFAAuth    TwoFAAuthConfig    `yaml:"2fa_auth"`
}

type DBConfig struct {
	Host string `yaml:"host"`
	Port int    `yaml:"port"`
	User string `yaml:"user"`
	Pass string `yaml:"pass"`
	Name string `yaml:"name"`
}

type RedisConfig struct {
	Host string `yaml:"host"`
	Port int    `yaml:"port"`
	User string `yaml:"user"`
	Pass string `yaml:"pass"`
}

type ApplicationConfig struct {
	Port           int      `yaml:"port"`
	AllowedOrigins []string `yaml:"allowed_origins"`
}

type StreamServerConfig struct {
	HTTPURL string `yaml:"http_url"`
	RTMPURL string `yaml:"rtmp_url"`
	HLSURL  string `yaml:"hls_url"`
}

type AuthConfig struct {
	SecretKey string `yaml:"secret_key"`
}

type MailConfig struct {
	Email    string `yaml:"email"`
	Password string `yaml:"password"`
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
}

type FileStorageConfig struct {
	RootFolder            string `yaml:"root_folder"`
	ThumbnailFolder       string `yaml:"thumbnail_folder"`
	AvatarFolder          string `yaml:"avatar_folder"`
	LiveFolder            string `yaml:"live_folder"`
	ScheduledVideosFolder string `yaml:"scheduled_videos_folder"`
	VideoFolder           string `yaml:"video_folder"`
	LogFolder             string `yaml:"log_folder"`
}

type TwoFAAuthConfig struct {
	Issuer string `yaml:"issuer"`
}

type ApiFileConfig struct {
	Url string `yaml:"url"`
}

func LoadYaml(path string) (*Config, error) {
	file, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	var cfg Config
	decoder := yaml.NewDecoder(file)
	if err := decoder.Decode(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func init() {
	var err error
	if cfg, err = LoadYaml("conf/config.yaml"); err != nil {
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
