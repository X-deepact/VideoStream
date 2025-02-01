import axios from "axios";
import authHeader from "./auth-header";
import {
	ApiResult,
	CommonQueryStringsType,
	PaginatedResponse
} from "@/type/api.ts";
import { mapToQueryString } from "@/lib/utils.ts";
import { handleApiError } from "@/lib/error-handler.ts";
import { LiveStatisticsResponse } from "@/type/statistic.ts";

// Consider using an environment variable for the API URL
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8686";
const LIVE_STATISTICS_API = `${API_URL}/api/streams/live-statistics`;

export const getStatistics = async <T = LiveStatisticsResponse>(
	queryParams:CommonQueryStringsType
):Promise<ApiResult<PaginatedResponse<T>>> => {
	const url = `${LIVE_STATISTICS_API}?${mapToQueryString<CommonQueryStringsType>(queryParams)}`;
	
	try {
		const apiResponse = await axios.get<PaginatedResponse<T>>(url, {
			headers: authHeader(),
		});
		
		if ( apiResponse?.data ) {
			return {
				data: apiResponse.data,
				message: "Successfully fetch Live Statistic",
				code: 200,
			}
		}
		
		return {
			data: null as unknown as PaginatedResponse<T>,
			message: "No data received from API",
			code: 204,
		};
	} catch ( error ) {
		handleApiError(error);
		
		return {
			data: {} as PaginatedResponse<T>,
			message: "Failed to fetch account list",
			code: 500,
		};
	}
}