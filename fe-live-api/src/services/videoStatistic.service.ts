import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = "http://localhost:8080/api/streams/statistics";

	export const getVideoStatistics = (
		page: number = 1,
		limit: number = 5
	) => {
		return axios.get(
			`${API_URL}/${page}/${limit}?sort_by=views&sort=DESC`,
			{ headers: authHeader() }
		);
	}