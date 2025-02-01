import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api";

export const getVideoLibrary = (
  page: number = 1,
  pageSize: number = 5,
  sort_by: string = "title",
  sort: string = "ASC",
  category: string = "",
  keyword: string = "",
  type: string = ""
) => {
  return axios.get(
    `${API_URL}/streams?page=${page}&limit=${pageSize}&sort_by=${sort_by}&sort=${sort}&status=ended&category=${category}&keyword=${keyword}&type=${type}`,
    { headers: authHeader() }
  );
};

export const deleteVideo = (id: string) => {
  return axios.delete(`${API_URL}/streams/${id}`, { headers: authHeader() });
};
