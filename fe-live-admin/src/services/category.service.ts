import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/categories";

export const getCategories = () => {
	return axios.get(`${API_URL}`, { headers: authHeader() });
}