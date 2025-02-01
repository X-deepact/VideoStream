package conf

import (
	"crypto/rsa"
	"fmt"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/service"
	"gitlab/live/be-live-admin/utils"
	"log"

	"gopkg.in/ini.v1"
)

var (
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
)

var cfg *Config

type Config struct {
	DB           DBConfig           `ini:"database"`
	Redis        RedisConfig        `ini:"redis"`
	Web          ApplicationConfig  `ini:"web"`
	FileStorage  FileStorageConfig  `ini:"file_storage"`
	StreamServer StreamServerConfig `ini:"stream_server"`
	ApiFile      ApiFileConfig      `ini:"api_file"`
	Client       ClientConfig       `ini:"client"`
}

type ClientConfig struct {
	Host string `ini:"host"`
}
type ApiFileConfig struct {
	Url string `ini:"url"`
}

type StreamServerConfig struct {
	HTTPURL string `ini:"http_url"`
	RTMPURL string `ini:"rtmp_url"`
	HLSURL  string `ini:"hls_url"`
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

type FileStorageConfig struct {
	RootFolder            string `ini:"root_folder"`
	ThumbnailFolder       string `ini:"thumbnail_folder"`
	AvatarFolder          string `ini:"avatar_folder"`
	LiveFolder            string `ini:"live_folder"`
	ScheduledVideosFolder string `ini:"scheduled_videos_folder"`
	VideoFolder           string `ini:"video_folder"`
}

func LoadINI(path string) (*Config, error) {
	// Load the INI file
	cfg, err := ini.Load(path)
	if err != nil {
		log.Fatalf("Fail to read file: %v", err)
	}

	// Create an instance of Config and map the INI data to it
	var config Config
	err = cfg.MapTo(&config)
	if err != nil {
		return nil, fmt.Errorf("failed to map INI to struct: %v", err)
	}

	return &config, nil
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

func SeedActions(adminService *service.AdminService) {

	for _, action := range model.Actions {
		existingAction, _ := adminService.GetActionByName(action)
		if existingAction != nil {
			continue // action already exists
		}
		if err := adminService.CreateAdminAction(action); err != nil {
			log.Fatalf("Failed to seed admin action: %v", err)
		}
	}

	log.Println("Actions seeded successfully")
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

	if cfg, err = LoadINI("conf/config.ini"); err != nil {
		log.Fatal(err)
	}
}

func GetDatabaseConfig() *DBConfig {
	return &cfg.DB
}

func GetClientConfig() *ClientConfig {
	return &cfg.Client
}

func GetRedisConfig() *RedisConfig {
	return &cfg.Redis
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
