package model

func IsValidRoleType(roleType RoleType) bool {
	validRoles := []RoleType{SUPPERADMINROLE, ADMINROLE, USERROLE, STREAMER}
	for _, validRole := range validRoles {
		if roleType == validRole {
			return true
		}
	}
	return false
}
