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
		limit: number = 10,
		status?: string,
		from?: number,
		to?: number
	) => {
		const params = new URLSearchParams();

		params.append('page', page.toString());
		params.append('limit', limit.toString());
		params.append('sort_by', 'created_at');
		params.append('sort', 'DESC');

		if (status) {
			params.append('status[]', status);
		}

		if (from) {
			const fromSeconds = Math.floor(from / 1000);
			params.append('from_started_time', fromSeconds.toString());
		}
		if (to) {
			const toSeconds = Math.floor(to / 1000);
			params.append('end_started_time', toSeconds.toString());
		}

		const url = `${API_URL}?${params.toString()}`;
		console.log('Request URL:', url);
		console.log('Request Parameters:', Object.fromEntries(params.entries()));

		return axios.get(url, { 
			headers: {
				...authHeader(),
				'Accept': 'application/json'
			}
		}).catch(error => {
			console.error('API Error Details:', {
				status: error.response?.status,
				data: error.response?.data,
				message: error.response?.data?.message,
				params: Object.fromEntries(params.entries())
			});
			throw error;
		});
	}