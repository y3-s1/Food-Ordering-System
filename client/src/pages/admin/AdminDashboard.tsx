import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import adminApi from "../../api/adminApi";
import UserTable from "../../components/admin/UserTable";
import AdminCharts from "../../components/admin/AdminCharts";

// ✅ Explicit user type
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
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await adminApi.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-600 text-sm mb-2">Total Users</h2>
          <p className="text-2xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-600 text-sm mb-2">Admins</h2>
          <p className="text-2xl font-bold text-green-600">
            {users.filter((u) => u.isAdmin).length}
          </p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-gray-600 text-sm mb-2">Roles</h2>
          <ul className="text-sm">
            <li>Customers: {users.filter((u) => u.role === "customer").length}</li>
            <li>Restaurant Owners: {users.filter((u) => u.role === "restaurantOwner").length}</li>
            <li>Delivery Agents: {users.filter((u) => u.role === "deliveryAgent").length}</li>
          </ul>
        </div>
      </div>

      <AdminCharts users={users} />
      <div className="mt-8">
        <UserTable users={users} onDelete={handleDelete} refresh={fetchUsers} />
      </div>
    </div>
  );
}
