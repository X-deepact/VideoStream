import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api";

export const getVideoStatistics = async (
  page: number = 1,
  pageSize: number = 20,
  sort_by: string = "started_at",
  sort: string = "DESC",
  id?: string
) => {
  try {
    const url = `${API_URL}/streams`;
    const params: any = {
      Page: page,
      Limit: pageSize,
      status: ["started", "ended"],
      sort_by,
      sort,
    };

    if (id) {
      params.id = id;
    }

    console.log("Request URL:", url);
    console.log("Request Params:", params);

    const response = await axios.get(url, {
      params,
      headers: authHeader(),
    });

    console.log("data", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error message:", error.message);
      console.error("Axios error response:", error.response?.data);
      console.error("Axios error config:", error.config);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};