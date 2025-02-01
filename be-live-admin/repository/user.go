package repository

import (
	"errors"
	"fmt"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/utils"
	"log"
	"time"

	"gorm.io/gorm"
)

type UserRepository struct {
	db      *gorm.DB
	roleMap map[model.RoleType]uint
}

func newUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{
		db:      db,
		roleMap: map[model.RoleType]uint{},
	}
}

func (s *UserRepository) SetRoleMap() error {
	var roles []model.Role
	if err := s.db.Find(&roles).Error; err != nil {
		return fmt.Errorf("failed to fetch roles: %w", err)
	}

	for _, role := range roles {
		s.roleMap[role.Type] = role.ID
	}

	log.Printf("Role map set: %v\n", s.roleMap)

	return nil
}

func (s *UserRepository) Page(filter *dto.UserQuery, page, limit uint) (*utils.PaginationModel[model.User], error) {
	var query = s.db.Model(model.User{})
	query = query.Joins("LEFT JOIN roles ON roles.id = users.role_id")
	query = query.Joins("LEFT JOIN users cr ON cr.id = users.created_by_id")
	query = query.Joins("LEFT JOIN users ur ON ur.id = users.updated_by_id")

	if filter != nil && filter.CreatedBy != "" {
		query = query.Where("cr.username = ?", filter.CreatedBy)
	}

	if filter.Status != "" {
		query = query.Where("users.status = ?", model.UserStatusType(filter.Status))
	}

	if filter.Reason != "" {
		query = query.Where("users.blocked_reason ILIKE ?", "%"+filter.Reason+"%")
	}

	if filter != nil && filter.Role != "" {
		query = query.Where("roles.type = ?", filter.Role)
	}

	if filter != nil && filter.Keyword != "" {
		query = query.Where("users.username != ? AND (users.username ILIKE ? OR users.display_name ILIKE ?) OR (users.email ILIKE ? AND users.email != ?)", model.SUPER_ADMIN_USERNAME, "%"+filter.Keyword+"%", "%"+filter.Keyword+"%", "%"+filter.Keyword+"%", model.SUPER_ADMIN_EMAIL)
	}

	if filter != nil && filter.SortBy != "" && filter.Sort != "" {
		query = query.Order(fmt.Sprintf("users.%s %s", filter.SortBy, filter.Sort))
	}
	query = query.Where("users.username != ? AND users.email != ?", model.SUPER_ADMIN_USERNAME, model.SUPER_ADMIN_EMAIL)
	query = query.Preload("Role").Preload("CreatedBy").Preload("UpdatedBy")

	if limit == 0 {
		var emptyLimitPagination = new(utils.PaginationModel[model.User])
		var users []model.User
		if err := query.Find(&users).Error; err != nil {
			return nil, err
		}
		emptyLimitPagination.CurrentPage = int(page)
		emptyLimitPagination.Index = 1
		emptyLimitPagination.Length = len(users)
		emptyLimitPagination.Next = -1
		emptyLimitPagination.Previous = 0
		emptyLimitPagination.PageSize = len(users)
		emptyLimitPagination.TotalItems = int64(len(users))
		emptyLimitPagination.Page = users
		return emptyLimitPagination, nil
	}

	pagination, err := utils.CreatePage[model.User](query, int(page), int(limit))
	if err != nil {
		return nil, err
	}
	return utils.Create(pagination, int(page), int(limit))
}

func (r *UserRepository) Update(updatedUser *model.User) error {
	if err := r.db.Updates(updatedUser).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) GetUsernameList() ([]string, error) {
	var result []string
	if err := r.db.Model(model.User{}).Where("username != ?", model.SUPER_ADMIN_USERNAME).Select("username").Find(&result).Error; err != nil {
		return nil, err
	}
	return result, nil
}

func (r *UserRepository) Delete(id, deletedByID uint) error {
	var userToDelete model.User
	if err := r.db.First(&userToDelete, "id = ?", id).Error; err != nil {
		return err
	}
	// userToDelete.DeletedByID = &deletedByID
	// if err := r.db.Updates(&userToDelete).Error; err != nil {
	// 	return err
	// }
	if err := r.db.Unscoped().Delete(&userToDelete).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) Create(user *model.User) error {
	// Perform the database insertion
	if err := r.db.Create(user).Error; err != nil {
		// Provide more context about the error
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (r *UserRepository) FindByEmail(email string) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").Where("email = ?", email).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByID(id int) (*model.User, error) {
	var user model.User
	if err := r.db.Where("id = ?", id).Preload("Role").First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) FindByUsername(username string) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

func (r *UserRepository) UpdateOTP(userID uint, otp string, expiresAt time.Time) error {

	if err := r.db.Model(&model.User{}).
		Where("id = ?", userID).
		Updates(map[string]interface{}{
			"otp":            otp,
			"otp_expires_at": expiresAt,
		}).Error; err != nil {
		return err
	}
	return nil
}

func (r *UserRepository) ClearOTP(userID uint) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).
		Updates(map[string]interface{}{
			"otp":            nil,
			"otp_expires_at": nil,
		}).Error
}

func (r *UserRepository) UpdatePassword(userID uint, hashedPassword string) error {
	return r.db.Model(&model.User{}).Where("id = ?", userID).
		Update("password_hash", hashedPassword).Error
}

func (r *UserRepository) CheckUserTypeByID(id int) (*model.User, error) {
	var user model.User
	if err := r.db.Preload("Role").Where("id = ?", id).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil // User not found
		}
		return nil, err
	}
	return &user, nil
}

// need to cache this query.
// beaware views, likes and comments are handled by be-api.
// so it will be hard to cache.
func (r *UserRepository) GetUserStatistics(req *dto.UserStatisticsRequest) (*utils.PaginationModel[dto.UserStatisticsResponse], error) {
	query := r.db.Model(model.User{}).Joins("INNER JOIN roles ON users.role_id = roles.id").Select("users.id as user_id, roles.type as role_type, users.username, users.display_name").Where("roles.type NOT IN ?", []model.RoleType{model.SUPPERADMINROLE, model.ADMINROLE})
	if req.Keyword != "" {
		query = query.Where("users.username ILIKE ? OR users.display_name ILIKE ?", "%"+req.Keyword+"%", "%"+req.Keyword+"%")
	}
	if req.RoleType != "" {
		query = query.Where("roles.type = ?", req.RoleType)
	}

	if req.SortBy != "" && req.Sort != "" {
		if req.SortBy == "username" || req.SortBy == "display_name" {
			query = query.Order(fmt.Sprintf("users.%s %s", req.SortBy, req.Sort))
		}
	}
	pagination, err := utils.CreatePage[dto.UserStatisticsResponse](query, int(req.Page), int(req.Limit))
	if err != nil {
		return nil, err
	}

	return utils.Create(pagination, int(req.Page), int(req.Limit))
}

func (r *UserRepository) GetLikesByUserID(id uint) (int64, error) {
	var count int64
	if err := r.db.Model(model.Like{}).Where("user_id = ?", id).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *UserRepository) GetCommentsByUserID(id uint) (int64, error) {
	var count int64
	if err := r.db.Model(model.Comment{}).Where("user_id = ?", id).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *UserRepository) GetViewsByUserID(id uint) (int64, error) {
	var count int64
	if err := r.db.Model(model.View{}).Where("user_id = ?", id).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

func (r *UserRepository) GetStreamsByUserID(id uint) (int64, error) {
	var count int64
	if err := r.db.Model(model.Stream{}).Where("user_id = ?", id).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}
