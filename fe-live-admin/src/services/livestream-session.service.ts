import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/streams";

export const getLivestreamSessionList = (
	page: number = 1,
	options?: string[]
) => {
	const additionalParams = options?.length
		? options.map((option) => option.replace("=", "=")).join("&")
		: "";

	const URL = `${API_URL}?page=${page}&limit=10&sort_by=started_at&sort=DESC${additionalParams ? `&${additionalParams}` : ""}`;
	return axios.get(
		URL
		,
		{
			headers: authHeader(),
		}
	)
}