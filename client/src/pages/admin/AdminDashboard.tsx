import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import UserTable from "../../components/admin/UserTable";
import AdminCharts from "../../components/admin/AdminCharts";
import UserSearchBar from "../../components/admin/UserSearchBar"; // ✅ Import search bar
import { Loader2 } from "lucide-react"; // Modern loader icon

// ✅ Explicit User type
type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/dashboard");
    } else {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data); // Set both
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string, roleFilter: string) => {
    const filtered = users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter ? u.role === roleFilter : true;

      return matchesSearch && matchesRole;
    });

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await adminApi.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* Top Header */}
      <header className="flex justify-between items-center bg-white p-4 shadow">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Logout
        </button>
      </header>

      {/* Main Body */}
      <main className="p-6 flex flex-col gap-8">
        
        {/* Search Bar */}
        <UserSearchBar onSearch={handleSearch} />

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard title="Total Users" value={filteredUsers.length} color="blue" />
          <SummaryCard title="Admins" value={filteredUsers.filter(u => u.isAdmin).length} color="green" />
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-gray-500 text-sm mb-3 font-semibold">Roles Breakdown</h2>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>👤 Customers: {filteredUsers.filter((u) => u.role === "customer").length}</li>
              <li>🍽️ Restaurant Owners: {filteredUsers.filter((u) => u.role === "restaurantOwner").length}</li>
              <li>🚚 Delivery Agents: {filteredUsers.filter((u) => u.role === "deliveryAgent").length}</li>
            </ul>
          </div>
        </section>

        {/* Admin Charts */}
        <AdminCharts users={filteredUsers} />

        {/* User Table */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">All Users</h2>
          </div>
          <UserTable users={filteredUsers} onDelete={handleDelete} refresh={fetchUsers} />
        </section>
      </main>
    </div>
  );
}

// 📦 Summary Card Component
function SummaryCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
      <h2 className="text-gray-500 text-sm mb-3 font-semibold">{title}</h2>
      <p className={`text-3xl font-bold ${colorMap[color]}`}>{value}</p>
    </div>
  );
}
