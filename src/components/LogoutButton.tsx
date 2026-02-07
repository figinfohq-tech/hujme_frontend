import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("userDetails");
    navigate("/"); // redirect to homepage after logout
    window.location.reload();
  };

  return (
    <div className="md:flex items-center">
      <Button
        size="sm"
        onClick={handleLogout}
        className="bg-red-700 text-white hover:bg-red-500 transition-all duration-300 flex items-center gap-2 rounded-lg shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};

export default LogoutButton;
