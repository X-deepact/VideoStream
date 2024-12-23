import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api";


export const getVideoStatistics = async (
  page: number = 1,
  pageSize: number = 20,
  sort_by: string = "started_at",
  sort: string = "DESC"
) => {
  try {
    console.log("Fetching data with pageSize:", pageSize);
    const response = await axios.get(
      `${API_URL}/streams/${page}/${pageSize}`,
      {
        params: {
          status: ["started", "ended"],
          from_ended_time: 173,
          end_ended_time: 1733988014903,
          sort_by,
          sort,
        },
        headers: authHeader(),
      }
    );
    console.log("data", response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching video statistics:", error);
    throw error;
  }
};
