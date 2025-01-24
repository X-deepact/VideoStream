import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { InputOTP, InputOTPSlot, InputOTPGroup } from "../ui/input-otp";
import axios from "axios";

const ResetPasswordForm: React.FC = () => {
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");

  const handleVerifycode = (otp: any) => {
    axios.post("/reset_password", { otpData: otp }).then((res: any) => {
      console.log("responseData:", res);
    });
  };

  const handleReset = () => {
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
  };

  return (
    <div className="space-y-4 max-w-md mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
      <div>
        <Label className="block text-sm font-medium text-gray-700 text-left pl-2">
          Verify Code
        </Label>
        <div className="flex justify-center my-4">
          <InputOTP
            maxLength={6}
            className="flex items-center"
            onChange={(e) => handleVerifycode(e)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
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
      </div>
      <Button
        type="submit"
        onClick={handleReset}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
      >
        Reset
      </Button>
    </div>
  );
};

export default ResetPasswordForm;
