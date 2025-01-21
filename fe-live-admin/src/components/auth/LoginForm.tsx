import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/services/auth.service";
import loadingImg from "@/assets/loading.svg";
import { useAuth } from "@/lib/auth-util";
import { APP_DASHBOARD_PATH } from "@/router";

const LoginForm: React.FC = () => {
  const navigator = useNavigate();
  const { toast } = useToast();
  const { loginUser, setUserStatus } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email === "") {
      toast({
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast({
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    if (password === "") {
      toast({
        description: "Please enter a password.",
        variant: "destructive",
      });
      return;
    }
    if (password.length < 8) {
      toast({
        description: "Password must be at least 8 character.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    login(email, password).then(
      (res) => {
        setLoading(false);
        setUserStatus(res.data.status);
        loginUser();
        toast({
          description: res.message,
        });
        navigator(APP_DASHBOARD_PATH);
        // window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        toast({
          description: resMessage,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    );
  };
  return (
    <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8">Login</h2>
      <div>
        <Label
          htmlFor="email"
          className="block mb-3 text-sm font-medium text-gray-700 text-left pl-2"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full min-w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <Label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 text-left pl-2"
        >
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="button"
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        disabled={loading}
      >
        Login{loading && <img src={loadingImg} />}
      </Button>
      {/* <p className="text-sm text-gray-600">
        <a href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </p>
      <p className="text-sm text-gray-600">
        Don't have an account? &nbsp;&nbsp;
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p> */}
    </div>
  );
};

export default LoginForm;
