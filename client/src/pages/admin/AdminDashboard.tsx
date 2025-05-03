// src/pages/admin/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import DashboardHome from "./DashboardHome";
import RestaurantRequests from "./RestaurantRequests";
import ProfilePage from "../profile/ProfilePage"; //  Import Profile Page
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md border-r h-full fixed">
        <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} onLogout={logout} />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 overflow-y-auto h-screen p-6">
        {selectedTab === "dashboard" && <DashboardHome />}
        {selectedTab === "restaurantRequests" && <RestaurantRequests />}
        {selectedTab === "profile" && <ProfilePage />} {/*  Add Profile Section */}
      </div>
    </div>
  );
}
