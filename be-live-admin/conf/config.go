package conf

import (
	"crypto/rsa"
	"gitlab/live/be-live-api/model"
	"gitlab/live/be-live-api/service"
	"gitlab/live/be-live-api/utils"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

var (
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
)

var cfg *Config

type Config struct {
	DB           DBConfig           `yaml:"database"`
	Redis        DBConfig           `yaml:"redis"`
	Web          ApplicationConfig  `yaml:"web"`
	FileStorage  FileStorageConfig  `yaml:"file_storage"`
	StreamServer StreamServerConfig `yaml:"stream_server"`
	ApiFile      ApiFileConfig      `yaml:"api_file"`
}

type ApiFileConfig struct {
	Url string `yaml:"url"`
}

type StreamServerConfig struct {
	HTTPURL string `yaml:"http_url"`
	RTMPURL string `yaml:"rtmp_url"`
	HLSURL  string `yaml:"hls_url"`
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
	SaltKey string `yaml:"salt_key"`
	Port    int    `yaml:"port"`
}

type FileStorageConfig struct {
	RootFolder      string `yaml:"root_folder"`
	ThumbnailFolder string `yaml:"thumbnail_folder"`
	AvatarFolder    string `yaml:"avatar_folder"`
	LiveFolder      string `yaml:"live_folder"`
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

func SeedRoles(roleService *service.RoleService) {
	roles := []model.Role{
		{Type: model.SUPPERADMINROLE, Description: "super_admin role"},
		{Type: model.ADMINROLE, Description: "Administrator role"},
		{Type: model.STREAMER, Description: "Streamer role"},
		{Type: model.USERROLE, Description: "Default user role"},
	}

	for _, role := range roles {
		existingRole, _ := roleService.GetRoleByType(role.Type)
		if existingRole != nil {
			continue // Role already exists
		}
		if err := roleService.CreateRole(&role); err != nil {
			log.Fatalf("Failed to seed role: %v", err)
		}
	}

	log.Println("Roles seeded successfully")
}

func SeedSuperAdminUser(userService *service.UserService, roleService *service.RoleService) {
	role, err := roleService.GetRoleByType(model.SUPPERADMINROLE)
	if err != nil || role == nil {
		log.Fatalf("super_admin role must be created before seeding admin user")
	}

	existingUser, err := userService.FindByEmail("superAdmin@gmail.com")
	if err == nil && existingUser != nil {
		log.Println("Super admin user already exists, skipping creation")
		return
	}

	hashedPassword, err := utils.HashPassword("superAdmin123")
	if err != nil {
		log.Printf("Failed to hash password: %v\n", err)
	}

	admin := &model.User{
		Username:     "superAdmin",
		Email:        "superAdmin@gmail.com",
		PasswordHash: hashedPassword, // Replace with hashed password
		RoleID:       role.ID,
		OTPExpiresAt: nil,
	}

	if err := userService.Create(admin); err != nil {
		log.Fatalf("Failed to seed admin user: %v", err)
	}

	log.Println("Admin user seeded successfully")
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

func GetApplicationConfig() *ApplicationConfig {
	return &cfg.Web
}

func GetFileStorageConfig() *FileStorageConfig {
	return &cfg.FileStorage
}

func GetStreamServerConfig() *StreamServerConfig {
	return &cfg.StreamServer
}

func GetApiFileConfig() *ApiFileConfig { return &cfg.ApiFile }
