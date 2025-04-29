// src/components/admin/Sidebar.tsx
import { FaTachometerAlt, FaUtensils, FaSignOutAlt } from "react-icons/fa";

type SidebarProps = {
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  onLogout: () => void;
};

export default function Sidebar({ selectedTab, setSelectedTab, onLogout }: SidebarProps) {
  return (
    <div className="h-screen bg-white shadow-lg flex flex-col p-4 w-64">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Admin Panel</h1>

      <button
        onClick={() => setSelectedTab("dashboard")}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${
          selectedTab === "dashboard" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <FaTachometerAlt />
        Dashboard
      </button>

      <button
        onClick={() => setSelectedTab("restaurantRequests")}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-2 ${
          selectedTab === "restaurantRequests" ? "bg-blue-100 text-blue-700" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <FaUtensils />
        Restaurant Requests
      </button>

      <div className="mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
}
