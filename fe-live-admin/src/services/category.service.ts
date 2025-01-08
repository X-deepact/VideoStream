import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/categories";

export const getCategories = async () => {
  return await axios.get(`${API_URL}`, { headers: authHeader() });
};

export const addCategory = async (name: string) => {
  return await axios.post(
    `${API_URL}`,
    { name: name },
    { headers: authHeader() }
  );
};
