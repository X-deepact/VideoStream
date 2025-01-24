import axios from "axios";
import authHeader from "@/services/auth-header.ts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + "/api/auth/";

export const login = (email: string, password: string) => {
	return axios
	.post(API_BASE_URL + "login", {
		email,
		password,
	})
	.then((res) => {
		if (res.data.data.token) {
			localStorage.setItem("user", JSON.stringify(res.data.data));
		}
		return res.data;
	});
};

export const register = (username: string, email: string, password: string) => {
	return axios.post(API_BASE_URL + "register", {
		username,
		email,
		password,
	});
};

export const logout = async() => {
	return await axios
	.post(API_BASE_URL + "logout", {}, {headers: authHeader()})
	.then(() => {
		localStorage.removeItem("IsAuth");
		localStorage.removeItem("user");
	});
};

export const getCurrentUser = () => {
	const userStr = localStorage.getItem("user");
	if (userStr) return JSON.parse(userStr);
	
	return null;
};

export const sendVerifyCode = (email: string) => {
	return axios.post(API_BASE_URL + "send_verify_code", {
		email,
	});
};
