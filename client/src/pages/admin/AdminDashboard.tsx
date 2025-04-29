// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import DashboardHome from "./DashboardHome";
import RestaurantRequests from "./RestaurantRequests"; // Placeholder for now
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/dashboard");
    }
  }, []);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} onLogout={logout} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedTab === "dashboard" && <DashboardHome />}
        {selectedTab === "restaurantRequests" && <RestaurantRequests />}
      </div>
    </div>
  );
}
