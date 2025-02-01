package repository

import (
	"fmt"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/utils"

	"gorm.io/gorm"
)

type AdminRepository struct {
	db *gorm.DB
}

func (s *AdminRepository) GetAdminActionByName(name string) (*model.Action, error) {
	var action model.Action
	if err := s.db.Model(model.Action{}).Where("name = ?", name).First(&action).Error; err != nil {
		return nil, err
	}
	return &action, nil
}

func (s *AdminRepository) GetAdminActions() ([]string, error) {
	var actions []string
	if err := s.db.Model(model.Action{}).Select("name").Find(&actions).Error; err != nil {
		return nil, err
	}
	return actions, nil
}

func (s *AdminRepository) CreateAdminAction(name string) error {
	return s.db.Model(model.Action{}).Create(&model.Action{Name: name}).Error
}

func (s *AdminRepository) CreateAdmin(newUser *model.User) error {

	// find role admin
	var role model.Role
	if err := s.db.Model(model.Role{}).Where("type=?", newUser.Role.Type).First(&role).Error; err != nil {
		return err
	}

	newUser.Role = model.Role{}
	newUser.RoleID = role.ID
	if err := s.db.Model(model.User{}).Create(newUser).Error; err != nil {
		return err
	}

	return nil
}

func (s *AdminRepository) GetAdmins() ([]model.User, error) {

	var users []model.User
	if err := s.db.Model(model.User{}).Joins("INNER JOIN roles ON roles.id = users.role_id").Where("roles.type IN ?", []model.RoleType{model.ADMINROLE, model.SUPPERADMINROLE}).Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (s *AdminRepository) ById(id uint) (*model.User, error) {
	var user model.User
	var query = s.db.Model(model.User{})
	if err := query.Where("users.id=? AND users.deleted_at IS NULL", id).
		Preload("Role").
		Preload("CreatedBy").
		Preload("UpdatedBy").
		Preload("AdminLogs").First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (s *AdminRepository) GetAdminLogs(req *dto.AdminLogQuery) (*utils.PaginationModel[model.AdminLog], error) {
	var query = s.db.Model(model.AdminLog{}).Joins("LEFT JOIN users ON users.id = admin_logs.user_id")
	if req != nil {
		if req.Keyword != "" {
			if req.FilterBy == "email" {
				query = query.Where("users.email ILIKE ?", "%"+req.Keyword+"%")
			}
			if req.FilterBy == "username" {
				query = query.Where("users.username = ?", req.Keyword)
			}
			if req.FilterBy == "id" {
				query = query.Where("users.id = ?", req.Keyword)
			}
			if req.FilterBy == "details" {
				query = query.Where("admin_logs.details ILIKE ?", "%"+req.Keyword+"%")
			}

		}
		if req.Action != "" {
			query = query.Where("admin_logs.action = ?", req.Action)
		}
		if req.UserID > 0 {
			if req.IsMe {
				query = query.Where("admin_logs.user_id = ?", req.UserID)
			} else {
				if req.IsAdmin {
					query = query.Where("admin_logs.user_id IN(SELECT users.id FROM users INNER JOIN roles ON users.role_id = roles.id WHERE roles.type IN ? OR users.id = ?)", []model.RoleType{model.USERROLE, model.STREAMER}, req.UserID)
				}
			}
		}
		if req.Sort != "" && req.SortBy != "" {
			if req.SortBy == "username" {
				query = query.Order(fmt.Sprintf("users.%s %s", req.SortBy, req.Sort))
			} else {
				query = query.Order(fmt.Sprintf("admin_logs.%s %s", req.SortBy, req.Sort))
			}
		}
	}
	query = query.Preload("User")
	pagination, err := utils.CreatePage[model.AdminLog](query, int(req.Page), int(req.Limit))
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, int(req.Page), int(req.Limit))
}

func (r *AdminRepository) Create(adminLog *model.AdminLog) error {
	if err := r.db.Create(adminLog).Error; err != nil {
		return err
	}
	return nil
}
func newAdminRepository(db *gorm.DB) *AdminRepository {
	return &AdminRepository{
		db: db,
	}
}
