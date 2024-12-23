import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = "http://localhost:8080/api";

export const getLivestreamSessionList = (
	page: number = 1,
	options?: string[]
) => {
	return axios.get(
		`${API_URL}/streams/${page}/10?sort_by=started_at&sort=DESC`,
		{
			headers: authHeader(),
		}
	)
}