import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { sendVerifyCode } from "@/services/auth.service";
import loadingImg from "@/assets/loading.svg";

const ForgotPasswordForm: React.FC = () => {
  const navigator = useNavigate();
  const { toast } = useToast();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSendcode = () => {
    if (email === "") {
      toast({
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      toast({
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    sendVerifyCode(email).then(
      () => {
        setLoading(false);
        toast({
          description: "Sent verify code to your email.",
        });
        navigator("/reset-password");
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
      <h2 className="text-xl font-semibold text-gray-800">Forgot Password?</h2>
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
      <Button
        type="submit"
        onClick={handleSendcode}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        disabled={loading}
      >
        Send Code{loading && <img src={loadingImg} />}
      </Button>
    </div>
  );
};

export default ForgotPasswordForm;
