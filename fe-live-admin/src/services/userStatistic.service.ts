import axios from "axios";
import authHeader from "./auth-header";

// You might want to get this from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getUserStatistics = async (
  page: number = 1,
  pageSize: number = 20,
  keyword?: string,
  roleType: string = "streamer",
  sortBy?: string,
  sortOrder: 'asc' | 'desc' = 'desc'
) => {
  try {
    // Map frontend sort fields to backend fields
    const sortFieldMapping: { [key: string]: string } = {
      'display_name': 'display_name',
      'username': 'username',
      'streams': 'total_streams',
      'likes': 'total_likes',
      'comments': 'total_comments',
      'views': 'total_views'
    };

    const url = `${API_URL}/api/users/statistics`;
    const params = {
      page,
      limit: pageSize,
      role_type: roleType,
      ...(keyword && keyword.trim() ? { search: keyword } : {}),
      ...(sortBy ? { 
        sort_by: sortFieldMapping[sortBy] || sortBy,
        sort_order: sortOrder 
      } : {})
    };

    console.log('API Request params:', params);

    const response = await axios.get(url, {
      params,
      headers: authHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error details:', error);
    if (axios.isAxiosError(error)) {
      console.error('Server response:', error.response?.data);
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};