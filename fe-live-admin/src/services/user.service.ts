import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api";

export const getAccountList = (
  page: number = 1,
  pageSize: number = 10,
  sort_by: string = "username",
  sort: string = "ASC"
) => {
  return axios.get(
    `${API_URL}/users/${page}/${pageSize}?sort_by=${sort_by}&sort=${sort}`,
    {
      headers: authHeader(),
    }
  );
};

export const createAccount = async (data: any) => {
  return await axios.post(
    `${API_URL}/admins`,
    {
      username: data.username,
      display_name: data.display_name,
      email: data.email,
      role_type: data.role.toLowerCase(),
      password: data.password,
    },
    {
      headers: authHeader(),
    }
  );
};

export const updateAccount = async (userId: string, data: any) => {
  return await axios.put(
    `${API_URL}/users/${userId}`,
    {
      username: data.username,
      display_name: data.display_name,
      email: data.email,
      role_type: data.role.toLowerCase(),
    },
    {
      headers: authHeader(),
    }
  );
};

export const deleteAccount = async (userId: string) => {
  return await axios.delete(`${API_URL}/users/${userId}`, {
    headers: authHeader(),
  });
};
