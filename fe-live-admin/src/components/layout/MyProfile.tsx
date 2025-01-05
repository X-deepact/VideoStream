import React from "react";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { APP_PROFILE_PATH } from "@/router";

const MyProfile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="flex items-center space-x-2 p-2 rounded hover:border-none"
      onClick={() => {
        navigate(APP_PROFILE_PATH);
      }}
      aria-label="My Account"
    >
      <User className="w-5 h-5" />
      <span>My Account</span>
    </Button>
  );
};

export default MyProfile;
