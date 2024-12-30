import axios from "axios";
import authHeader from "./auth-header";

// Consider using an environment variable for the API URL
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8686/api";

export const getLiveStatistics = async (
  page: number,
  limit: number,
  sortBy: string,
  sort: string,
  keyword?: string
) => {
  try {
    const params = {
      page,
      limit,
      sort_by: sortBy,
      sort,
      ...(keyword && { keyword })
    };

    const response = await axios.get(`${API_URL}/streams/live-statistics`, {
      headers: authHeader(),
      params,
    });

    return response.data;
  } catch (error: any) {
    throw new Error(`Failed to fetch live statistics: ${error.message}`);
  }
};