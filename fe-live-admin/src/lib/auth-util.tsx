import React, { createContext, useContext, useState } from "react";

import { AuthContextProps } from "./interface";

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  status: "",
  loginUser: () => {},
  logoutUser: () => {},
  setUserStatus: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState("");

  const loginUser = () => {
    setIsAuthenticated(true);
    localStorage.setItem("IsAuth", "true");
  };
  const logoutUser = () => {
    setIsAuthenticated(false);
    localStorage.setItem("IsAuth", "false");
  };
  const setUserStatus = (status: string) => setStatus(status);
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginUser,
        logoutUser,
        setUserStatus,
        status
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
