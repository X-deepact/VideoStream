import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8080/api/auth/";

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

export const logout = () => {
  localStorage.removeItem("IsAuth");
  localStorage.removeItem("user");
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
