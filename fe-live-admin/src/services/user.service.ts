import axios from 'axios';
import authHeader from './auth-header';
import { toast } from '@/hooks/use-toast';
import { TOAST_STYLES } from '@/components/ui/toast';
import { mapToQueryString } from '@/lib/utils';
import { UserMiniResponse, UserResponse } from '@/type/users';
import {
  ApiResult,
  CommonQueryStringsType,
  PaginatedResponse,
} from '@/type/api';
import { handleApiError } from '@/lib/error-handler';

const API_URL = import.meta.env.VITE_API_BASE_URL + '/api';
const ACCOUNT_LIST_API = `${API_URL}/users`;
const ADMINS_LIST_API = `${API_URL}/admins`;

export const getAccountList = async <T = UserResponse>(
  queryParams: CommonQueryStringsType
): Promise<ApiResult<PaginatedResponse<T>>> => {
  const url = `${ACCOUNT_LIST_API}?${mapToQueryString<CommonQueryStringsType>(
    queryParams
  )}`;

  try {
    const apiResponse = await axios.get<PaginatedResponse<T>>(url, {
      headers: authHeader(),
    });

    if (apiResponse?.data) {
      return {
        data: apiResponse.data,
        message: 'Success',
        code: 200,
      };
    }

    return {
      data: null as unknown as PaginatedResponse<T>,
      message: 'No data received from API',
      code: 204,
    };
  } catch (error) {
    handleApiError(error);

    return {
      data: {} as PaginatedResponse<T>,
      message: 'Failed to fetch account list',
      code: 500,
    };
  }
};

export const getAdminsList = async <T = UserMiniResponse[]>(): Promise<
  ApiResult<T>
> => {
  try {
    const { data } = await axios.get<ApiResult<T>>(ADMINS_LIST_API, {
      headers: authHeader(),
    });

    if (data) {
      return {
        data: data?.data,
        message: 'Success',
        code: 200,
      };
    }

    return {
      data: [] as unknown as T,
      message: 'No data received from API',
      code: 204,
    };
  } catch (error) {
    handleApiError(error);

    return {
      data: [] as T,
      message: 'Failed to fetch account list',
      code: 500,
    };
  }
};

export const getAccountListWithRole = (role: string) => {
  return axios.get(
    `${API_URL}/users?page=1&sort_by=username&sort=ASC&role=${role}`,
    {
      headers: authHeader(),
    }
  );
};

export const createAccount = async (data: any) => {
  const formData = new FormData();
  formData.append('username', data.username);
  formData.append('display_name', data.display_name);
  formData.append('email', data.email);
  formData.append('role_type', data.role.toLowerCase());
  formData.append('password', data.password);
  formData.append('avatar', data.avatar); // Assuming data.avatar is a File object
  try {
    const response = await axios.post(`${API_URL}/users`, formData, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data', // Set the content type for FormData
      },
    });
    toast({
      description: response.data.message,
      className: TOAST_STYLES.SUCCESS,
    });
    return response.data.data;
  } catch (error: any) {
    toast({
      description: error.message,
      className: TOAST_STYLES.ERROR,
    });
    return [];
  }
};

export const changePassword = async (userId: string, data: any) => {
  return await axios.patch(
    `${API_URL}/users/${userId}/change-password`,
    {
      password: data.password,
      confirm_password: data.confirmPassword,
    },
    {
      headers: authHeader(),
    }
  );
};

export const deleteAccount = async (userId: string) => {
  if (userId.length === 0) return;
  return await axios.delete(`${API_URL}/users/${userId}`, {
    headers: authHeader(),
  });
};

export const blockAccount = async (userId: string, reason: string) => {
  if (!userId) return;
  return await axios.patch(
    `${API_URL}/users/${userId}/deactive`,
    { reason },
    {
      headers: authHeader(),
    }
  );
};

export const reactivateAccount = async (userId: string) => {
  if (!userId) return;
  return await axios.patch(
    `${API_URL}/users/${userId}/reactive`,
    {},
    {
      headers: authHeader(),
    }
  );
};

export const getAccountLog = async (
  page: number = 1,
  pageSize: number = 20,
  sort_by: string = 'performed_at',
  sort: string = 'ASC',
  keyword: string = '',
  filter_by: string = '',
  action = ''
) => {
  return await axios.get(
    `${API_URL}/admins/logs?page=${page}&limit=${pageSize}&sort_by=${sort_by}&sort=${sort}&filter_by=${filter_by}&keyword=${keyword}&action=${action}`,
    {
      headers: authHeader(),
    }
  );
};
export const getlogActions = async () => {
  return await axios.get(`${API_URL}/admins/actions`, {
    headers: authHeader(),
  });
};

export const getUsernames = async () => {
  return await axios.get(`${API_URL}/users/list-username`, {
    headers: authHeader(),
  });
};

export const updateAccount = async (id: string, data: any) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/${id}`,
      {
        username: data.username,
        display_name: data.display_name,
        email: data.email,
        role_type: data.role,
      },
      { headers: authHeader() }
    );
    toast({
      description: response.data.message,
      className: TOAST_STYLES.SUCCESS,
    });
    return response.data.data;
  } catch (error: any) {
    toast({
      description: error.message,
      className: TOAST_STYLES.ERROR,
    });
    return [];
  }
};
