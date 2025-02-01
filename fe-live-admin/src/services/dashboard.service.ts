import axios from "axios";
import authHeader from "@/services/auth-header.ts";
import { formatDateToCustomFormat, getTimezoneOffsetAsHoursAndMinutes } from "@/lib/date-formated.ts";
import {HoursViewStatisticResponse} from "@/type/statistic.ts";
import {ApiResult} from "@/type/api.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/streams/statistics";

	export const getOverviewStatistics = () => {
		return axios.get(`${API_URL}/total`, {headers: authHeader()});
	}

	export const getStatisticsSortedByViews = (
		page: number = 1,
		limit: number = 20,
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
			params.append('from_started_time', from.toString());
		}
		if (to) {
			params.append('end_started_time', to.toString());
		}

		const url = `${API_URL}?${params.toString()}`;

		return axios.get(url, { headers: authHeader() });
	}

	export const getStatisticsPerPage = <T = HoursViewStatisticResponse>(day: Date): Promise<ApiResult<T>> => {
		const formatDate = formatDateToCustomFormat(day, getTimezoneOffsetAsHoursAndMinutes());

		//encode URI to prevent the plus sign (+) is interpreted as a space by default.
		return axios.get(`${API_URL}/day?targeted_date=${encodeURIComponent(formatDate)}`, { headers: authHeader() });
	};
