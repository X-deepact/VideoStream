import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_URL = "http://localhost:8080/api/streams/statistics";

	export const getOverviewStatistics = () => {
		return axios.get(`${API_URL}/total`, {headers: authHeader()});
	}

	export const getLiveStreamStatistics = (
		page: number = 1,
		limit: number = 10,
		sort_by: string = "title",
		sort: string = "ASC"
	) => {
		return axios.get(
			`${API_URL}/${page}/${limit}?sort_by=${sort_by}&sort=${sort}`,
			{headers: authHeader()}
		);
	}

	export const getStatisticsSortedByViews = (
		page: number = 1,
		limit: number = 10
		
	) => {
		return axios.get(
			`${API_URL}/${page}/${limit}?sort_by=views&sort=DESC`,
			{ headers: authHeader() }	
		);
	}