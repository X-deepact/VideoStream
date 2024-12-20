import React from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/services/auth.service";
import { useAuth } from "@/lib/auth-util";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const LogoutButton: React.FC = () => {
  const navigator = useNavigate();
  const { logoutUser } = useAuth();

  const handleLogout = () => {
    logout();
    logoutUser();
    toast({
      description: "Logout successfully.",
    });
    navigator("/login");
  };
  return (
    <Button
      variant="outline"
      className="flex items-center space-x-2 p-2 rounded hover:border-none"
      onClick={handleLogout}
      aria-label="Logout"
    >
      <LogOut className=" w-5 h-5" />
      <span className="">Logout</span>
    </Button>
  );
};

export default LogoutButton;
