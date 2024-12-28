import axios from "axios";
import authHeader from "./auth-header";

// You might want to get this from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const getVideoStatistics = async (
  page: number = 1,
  pageSize: number = 20,
  sort_by: string = "started_at",
  sort: string = "DESC",
  keyword?: string,
  id?: string
) => {
  try {
    const url = `${API_URL}/streams`;
    const params: any = {
      page,
      limit: pageSize,
      status: ["started", "ended"],
      sort_by,
      sort,
    };

    if (keyword) {
      params.keyword = keyword;
    }

    if (id) {
      params.id = id;
    }

    // Add timeout to the request
    const response = await axios.get(url, {
      params,
      headers: authHeader(),
      timeout: 5000, // 5 seconds timeout
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