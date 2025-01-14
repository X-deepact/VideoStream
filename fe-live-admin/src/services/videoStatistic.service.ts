import axios from "axios";
import authHeader from "./auth-header";

// You might want to get this from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL;

export const getVideoStatistics = async (
  page: number = 1,
  pageSize: number = 20,
  sort_by: string = "created_at",
  sort: string = "DESC",
  keyword?: string,
  from?: number,
  to?: number
) => {
  try {
    const url = `${API_URL}/api/streams/statistics`;
    const params: any = {
      page,
      limit: pageSize,
      sort_by,
      sort,
    };

    if (keyword) {
      params.keyword = keyword;
    }

    if (from) {
      params.from = from;
    }

    if (to) {
      params.to = to;
    }

    const response = await axios.get(url, {
      params,
      headers: authHeader(),
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // More specific error handling
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check if the backend is running.');
      }
      if (error.response?.status === 401) {
        throw new Error('Unauthorized access. Please log in again.');
      }
    }
    throw error;
  }
};