import axios from "axios";
import authHeader from "./auth-header";
import { UserStatisticsResponse } from "@/type/statistic.ts";
import { ApiResult, CommonQueryStringsType, PaginatedResponse } from "@/type/api.ts";
import { mapToQueryString } from "@/lib/utils.ts";
import { handleApiError } from "@/lib/error-handler.ts";

// You might want to get this from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL;
const USER_STATISTIC_API = `${API_URL}/api/users/statistics`;

export const getUserStatistics = async <T = UserStatisticsResponse>(
  queryParams: CommonQueryStringsType
): Promise<ApiResult<PaginatedResponse<T>>> => {
  const url = `${USER_STATISTIC_API}?${mapToQueryString<CommonQueryStringsType>(queryParams)}`;

  try {
    const apiResponse = await axios.get<PaginatedResponse<T>>(url, {
      headers: authHeader(),
    });

    if (apiResponse?.data) {
      return {
        data: apiResponse.data,
        message: "Successfully fetch User Statistic",
        code: 200,
      }
    }

    return {
      data: null as unknown as PaginatedResponse<T>,
      message: "No data received from API",
      code: 204,
    };
  } catch (error) {
    handleApiError(error);

    return {
      data: {} as PaginatedResponse<T>,
      message: "Failed to fetch user list",
      code: 500,
    };
  }
};
