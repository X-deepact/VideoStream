package service

import (
	"database/sql"
	"gitlab/live/be-live-admin/cache"
	"gitlab/live/be-live-admin/dto"
	"gitlab/live/be-live-admin/model"
	"gitlab/live/be-live-admin/repository"
	"gitlab/live/be-live-admin/utils"
	"math/rand"
	"sync"
	"time"
)

type UserService struct {
	repo       *repository.Repository
	redisStore cache.RedisStore
}

func newUserService(repo *repository.Repository, redis cache.RedisStore) *UserService {
	return &UserService{
		repo:       repo,
		redisStore: redis,
	}

}

func (s *UserService) toUserResponseDTO(user *model.User, apiURL string) dto.UserResponseDTO {

	var userResp = new(dto.UserResponseDTO)
	userResp.ID = user.ID
	userResp.Username = user.Username
	userResp.DisplayName = user.DisplayName
	userResp.Email = user.Email
	userResp.Status = user.Status
	userResp.BlockedReason = user.BlockedReason
	if user.AvatarFileName.Valid {
		userResp.AvatarFileName = utils.MakeAvatarURL(apiURL, user.AvatarFileName.String)
	}
	if user.CreatedBy != nil {
		userResp.CreatedByID = user.CreatedByID
		userResp.CreatedBy = new(dto.UserResponseDTO)
		userResp.CreatedBy.ID = user.CreatedBy.ID
		userResp.CreatedBy.Username = user.CreatedBy.Username
		userResp.CreatedBy.DisplayName = user.CreatedBy.DisplayName
		userResp.CreatedBy.Email = user.CreatedBy.Email
		userResp.CreatedBy.CreatedAt = user.CreatedBy.CreatedAt
		userResp.CreatedBy.UpdatedAt = user.CreatedBy.UpdatedAt
	}

	if user.UpdatedBy != nil {
		userResp.UpdatedByID = user.UpdatedByID

		userResp.UpdatedBy = new(dto.UserResponseDTO)
		userResp.UpdatedBy.ID = user.UpdatedBy.ID
		userResp.UpdatedBy.Username = user.UpdatedBy.Username
		userResp.UpdatedBy.DisplayName = user.UpdatedBy.DisplayName
		userResp.UpdatedBy.Email = user.UpdatedBy.Email
		userResp.UpdatedBy.CreatedAt = user.UpdatedBy.CreatedAt
		userResp.UpdatedBy.UpdatedAt = user.UpdatedBy.UpdatedAt
	}

	userResp.DeletedByID = user.DeletedByID
	userResp.CreatedAt = user.CreatedAt
	userResp.UpdatedAt = user.UpdatedAt

	userResp.RoleID = user.RoleID
	userResp.Role = new(dto.RoleDTO)
	userResp.Role.ID = user.Role.ID
	userResp.Role.Type = user.Role.Type
	userResp.Role.Description = user.Role.Description
	userResp.Role.CreatedAt = user.Role.CreatedAt
	userResp.Role.UpdatedAt = user.UpdatedAt

	return *userResp
}

func (s *UserService) GetUserList(filter *dto.UserQuery, page, limit uint, apiURL string) (*utils.PaginationModel[dto.UserResponseDTO], error) {
	pagination, err := s.repo.User.Page(filter, page, limit)
	if err != nil {
		return nil, err
	}
	var newPage = new(utils.PaginationModel[dto.UserResponseDTO])
	newPage.Page = utils.Map(pagination.Page,
		func(e model.User) dto.UserResponseDTO {
			return s.toUserResponseDTO(&e, apiURL)
		})
	newPage.BasePaginationModel = pagination.BasePaginationModel
	return newPage, err

}

func (s *UserService) GetUsernameList() ([]string, error) {
	return s.repo.User.GetUsernameList()
}

func (s *UserService) DeleteByID(id uint, deletedByID uint) error {
	if err := s.repo.User.Delete(id, deletedByID); err != nil {
		return err
	}
	return nil

}

func (s *UserService) toUpdatedUserDTO(user *model.User, role model.RoleType, apiURL string) *dto.UpdateUserResponse {
	return &dto.UpdateUserResponse{
		ID:          user.ID,
		UserName:    user.Username,
		DisplayName: user.DisplayName,
		Email:       user.Email,
		Status:      user.Status,
		UpdatedAt:   user.UpdatedAt,
		Avatar:      utils.MakeAvatarURL(apiURL, user.AvatarFileName.String),
		Role:        role,
	}
}

func (s *UserService) makeUpdatedUserModel(user *model.User, updatedUser *dto.UpdateUserRequest) (*model.User, error) {
	if updatedUser.UserName != "" {
		user.Username = updatedUser.UserName
	}
	if updatedUser.DisplayName != "" {
		user.DisplayName = updatedUser.DisplayName
	}
	if updatedUser.Email != "" {
		user.Email = updatedUser.Email
	}
	if updatedUser.RoleType != "" {
		role, err := s.repo.Role.FindByType(updatedUser.RoleType)
		if err != nil {
			return nil, err
		}
		user.Role = *role
	}

	user.UpdatedBy = nil
	user.UpdatedByID = updatedUser.UpdatedByID
	user.UpdatedAt = time.Now()

	return user, nil
}

func (s *UserService) UpdateUser(updatedUser *dto.UpdateUserRequest, id uint, apiUrl string) (*dto.UpdateUserResponse, error) {

	user, err := s.repo.Admin.ById(id)
	if err != nil {
		return nil, err
	}
	makeUpdatedUser, err := s.makeUpdatedUserModel(user, updatedUser)

	if err := s.repo.User.Update(makeUpdatedUser); err != nil {
		return nil, err
	}

	return s.toUpdatedUserDTO(user, updatedUser.RoleType, apiUrl), err

}

func (s *UserService) ChangePassword(user *model.User, changePassword *dto.ChangePasswordRequest, id uint, updatedByID uint, apiUrl string) (*dto.UpdateUserResponse, error) {
	var err error
	if changePassword.Password != "" {
		user.PasswordHash, err = utils.HashPassword(changePassword.Password)
		if err != nil {
			return nil, err
		}
	}
	user.UpdatedByID = &updatedByID
	user.UpdatedBy = nil
	if err = s.repo.User.Update(user); err != nil {
		return nil, err
	}

	return s.toUpdatedUserDTO(user, user.Role.Type, apiUrl), err
}

func (s *UserService) ChangeAvatar(user *model.User, changeAvartar *dto.ChangeAvatarRequest, id uint, updatedByID uint, apiUrl string) (*dto.UpdateUserResponse, error) {

	user.UpdatedByID = &updatedByID
	user.AvatarFileName = sql.NullString{Valid: true, String: changeAvartar.AvatarFileName}
	user.UpdatedBy = nil

	if err := s.repo.User.Update(user); err != nil {
		return nil, err
	}

	return s.toUpdatedUserDTO(user, user.Role.Type, apiUrl), nil
}

func (s *UserService) CreateUser(request *dto.CreateUserRequest) error {
	var newUser = new(model.User)
	newUser.Username = request.UserName
	newUser.PasswordHash, _ = utils.HashPassword(request.Password)
	newUser.DisplayName = request.DisplayName
	newUser.Email = request.Email
	newUser.CreatedByID = request.CreatedByID
	newUser.UpdatedByID = request.CreatedByID

	role, err := s.repo.Role.FindByType(request.RoleType)
	if err != nil {
		return err
	}
	newUser.Role = *role
	if request.AvatarFileName != "" {
		newUser.AvatarFileName = sql.NullString{String: request.AvatarFileName, Valid: true}
	}

	if err := s.Create(newUser); err != nil {
		return err
	}
	return nil
}

func (s *UserService) Create(user *model.User) error {
	return s.repo.User.Create(user)
}

func (s *UserService) FindByEmail(email string) (*model.User, error) {
	return s.repo.User.FindByEmail(email)
}

func (s *UserService) FindByID(id uint) (*model.User, error) {
	return s.repo.User.FindByID(int(id))
}

func (s *UserService) ChangeStatusUser(user *model.User, updatedByID uint, status model.UserStatusType, reason, apiUrl string) (*dto.UpdateUserResponse, error) {
	user.Status = status
	user.BlockedReason = reason
	user.UpdatedByID = &updatedByID
	user.UpdatedAt = time.Now()
	return s.toUpdatedUserDTO(user, user.Role.Type, apiUrl), s.repo.User.Update(user)
}

func (s *UserService) ChangeStatusUserByID(id uint, updatedByID uint, status model.UserStatusType) error {
	user, err := s.repo.User.FindByID(int(id))
	if err != nil {
		return err
	}
	user.Status = status
	user.UpdatedByID = &updatedByID
	return s.repo.User.Update(user)
}

func (s *UserService) FindByUsername(username string) (*model.User, error) {
	return s.repo.User.FindByUsername(username)
}
func (s *UserService) Update(user *model.User) error {
	return s.repo.User.Update(user)
}

func (s *UserService) UpdateOTP(userID uint, otp string, expiresAt time.Time) error {
	return s.repo.User.UpdateOTP(userID, otp, expiresAt)
}

func (s *UserService) ClearOTP(userID uint) error {
	return s.repo.User.ClearOTP(userID)
}

func (s *UserService) UpdatePassword(userID uint, hashedPassword string) error {
	return s.repo.User.UpdatePassword(userID, hashedPassword)
}

func (s *UserService) CheckUserTypeByID(id int) (*model.User, error) {
	return s.repo.User.CheckUserTypeByID(id)
}

func (s *UserService) GetUserStatistics(req *dto.UserStatisticsRequest) (*utils.PaginationModel[dto.UserStatisticsResponse], error) {
	var result = new(utils.PaginationModel[dto.UserStatisticsResponse])
	var data []dto.UserStatisticsResponse
	var reRangeData []dto.UserStatisticsResponse

	pagination, err := s.repo.User.GetUserStatistics(req)
	if err != nil {
		return nil, err
	}

	var wg sync.WaitGroup
	var mu sync.Mutex

	var wgSubThread sync.WaitGroup

	// use for re-reange position
	var reRangePosition = pagination.Page

	for _, user := range pagination.Page {
		wg.Add(1)
		go func(user dto.UserStatisticsResponse) {
			defer wg.Done()

			var comments, likes, views, streams int64
			var err error

			// Fetch comments
			wgSubThread.Add(1)
			go func() {
				defer wgSubThread.Done()
				comments, err = s.repo.User.GetCommentsByUserID(user.UserID)
				if err != nil {
					comments = 0
				}
			}()

			// Fetch likes
			wgSubThread.Add(1)
			go func() {
				defer wgSubThread.Done()
				likes, err = s.repo.User.GetLikesByUserID(user.UserID)
				if err != nil {
					likes = 0
				}
			}()

			// Fetch views
			wgSubThread.Add(1)
			go func() {
				defer wgSubThread.Done()
				views, err = s.repo.User.GetViewsByUserID(user.UserID)
				if err != nil {
					views = 0
				}
			}()

			// Fetch streams
			wgSubThread.Add(1)
			go func() {
				defer wgSubThread.Done()
				streams, err = s.repo.User.GetStreamsByUserID(user.UserID)
				if err != nil {
					streams = 0
				}
			}()

			wgSubThread.Wait()

			mu.Lock()
			data = append(data, dto.UserStatisticsResponse{
				UserID:        user.UserID,
				Username:      user.Username,
				DisplayName:   user.DisplayName,
				RoleType:      user.RoleType,
				TotalComments: uint(comments),
				TotalLikes:    uint(likes),
				TotalViews:    uint(views),
				TotalStreams:  uint(streams),
			})
			mu.Unlock()
		}(user)
	}

	wg.Wait()

	for _, v := range reRangePosition {
		for i, d := range data {
			if v.UserID == d.UserID {
				reRangeData = append(reRangeData, data[i])
				break
			}
		}

	}
	// sort by
	if req.SortBy != "" && req.Sort != "" {
		if req.SortBy == "total_streams" {
			reRangeData = s.sortByTotalStreams(reRangeData, req.Sort)
		}
		if req.SortBy == "total_views" {
			reRangeData = s.sortByViewers(reRangeData, req.Sort)
		}
		if req.SortBy == "total_comments" {
			reRangeData = s.sortByTotalComments(reRangeData, req.Sort)
		}
		if req.SortBy == "total_likes" {
			reRangeData = s.sortByTotalLikes(reRangeData, req.Sort)
		}
	}
	result.Page = reRangeData
	result.BasePaginationModel = pagination.BasePaginationModel
	return result, nil
}

func (s *UserService) sortByViewers(a []dto.UserStatisticsResponse, sort string) []dto.UserStatisticsResponse {
	if len(a) < 2 {
		return a
	}

	left, right := 0, len(a)-1

	// Pick a pivot
	pivotIndex := rand.Int() % len(a)

	// Move the pivot to the right
	a[pivotIndex], a[right] = a[right], a[pivotIndex]

	// Pile elements smaller than the pivot on the left
	for i := range a {
		if a[i].TotalViews < a[right].TotalViews && sort == dto.SORT_ASC {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].TotalViews > a[right].TotalViews && sort == dto.SORT_DESC {
			a[i], a[left] = a[left], a[i]
			left++
		}
	}

	// Place the pivot after the last smaller element
	a[left], a[right] = a[right], a[left]

	// Go down the rabbit hole
	s.sortByViewers(a[:left], sort)
	s.sortByViewers(a[left+1:], sort)

	return a
}

func (s *UserService) sortByTotalStreams(a []dto.UserStatisticsResponse, sort string) []dto.UserStatisticsResponse {
	if len(a) < 2 {
		return a
	}

	left, right := 0, len(a)-1

	// Pick a pivot
	pivotIndex := rand.Int() % len(a)

	// Move the pivot to the right
	a[pivotIndex], a[right] = a[right], a[pivotIndex]

	// Pile elements smaller than the pivot on the left
	for i := range a {
		if a[i].TotalStreams < a[right].TotalStreams && sort == dto.SORT_ASC {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].TotalStreams > a[right].TotalStreams && sort == dto.SORT_DESC {
			a[i], a[left] = a[left], a[i]
			left++
		}
	}

	// Place the pivot after the last smaller element
	a[left], a[right] = a[right], a[left]

	// Go down the rabbit hole
	s.sortByTotalStreams(a[:left], sort)
	s.sortByTotalStreams(a[left+1:], sort)

	return a
}

func (s *UserService) sortByTotalComments(a []dto.UserStatisticsResponse, sort string) []dto.UserStatisticsResponse {
	if len(a) < 2 {
		return a
	}

	left, right := 0, len(a)-1

	// Pick a pivot
	pivotIndex := rand.Int() % len(a)

	// Move the pivot to the right
	a[pivotIndex], a[right] = a[right], a[pivotIndex]

	// Pile elements smaller than the pivot on the left
	for i := range a {
		if a[i].TotalComments < a[right].TotalComments && sort == dto.SORT_ASC {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].TotalComments > a[right].TotalComments && sort == dto.SORT_DESC {
			a[i], a[left] = a[left], a[i]
			left++
		}
	}

	// Place the pivot after the last smaller element
	a[left], a[right] = a[right], a[left]

	// Go down the rabbit hole
	s.sortByTotalComments(a[:left], sort)
	s.sortByTotalComments(a[left+1:], sort)

	return a
}
func (s *UserService) sortByTotalLikes(a []dto.UserStatisticsResponse, sort string) []dto.UserStatisticsResponse {
	if len(a) < 2 {
		return a
	}

	left, right := 0, len(a)-1

	// Pick a pivot
	pivotIndex := rand.Int() % len(a)

	// Move the pivot to the right
	a[pivotIndex], a[right] = a[right], a[pivotIndex]

	// Pile elements smaller than the pivot on the left
	for i := range a {
		if a[i].TotalLikes < a[right].TotalLikes && sort == dto.SORT_ASC {
			a[i], a[left] = a[left], a[i]
			left++
		}

		if a[i].TotalLikes > a[right].TotalLikes && sort == dto.SORT_DESC {
			a[i], a[left] = a[left], a[i]
			left++
		}
	}

	// Place the pivot after the last smaller element
	a[left], a[right] = a[right], a[left]

	// Go down the rabbit hole
	s.sortByTotalLikes(a[:left], sort)
	s.sortByTotalLikes(a[left+1:], sort)

	return a
}
