import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/services/auth.service";
import loadingImg from "@/assets/loading.svg";

const RegisterForm: React.FC = () => {
  const navigator = useNavigate();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (name === "") {
      toast({
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }
    if (email === "") {
      toast({
        description: "Please enter your email.",
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
    if (password !== confirmpass) {
      toast({
        description: "Password is not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    register(name, email, password).then(
      () => {
        setLoading(false);
        toast({
          description: "Registered successfully.",
        });
        navigator("/login");
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
      <h2 className="text-xl font-semibold text-gray-800">Register</h2>
      <div>
        <Label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 text-left pl-2"
        >
          Name
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          placeholder="Your Name"
        />
      </div>
      <div>
        <Label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 text-left pl-2"
        >
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
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
      <div>
        <Label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700 text-left pl-2"
        >
          Confirm Password
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmpass}
          onChange={(e) => setConfirmpass(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          placeholder="••••••••"
        />
      </div>
      <Button
        type="submit"
        onClick={handleRegister}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        disabled={loading}
      >
        Register{loading && <img src={loadingImg} />}
      </Button>
      <p className="text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default RegisterForm;
