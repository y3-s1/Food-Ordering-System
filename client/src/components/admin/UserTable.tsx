import { useState } from "react";
import { FaTrash, FaEdit, FaUserShield, FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
};

type Props = {
  users: User[];
  onDelete: (id: string) => void;
  refresh: () => void;
};

export default function UserTable({ users, onDelete, refresh }: Props) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
  });

  const handleMakeAdmin = async (user: User) => {
    const action = user.isAdmin ? "remove admin rights" : "make admin";
    const confirmed = confirm(`Are you sure you want to ${action} for this user?`);

    if (confirmed) {
      try {
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${user._id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isAdmin: !user.isAdmin }),
        });
        toast.success(user.isAdmin ? "Admin rights removed!" : "User is now an Admin!");
        refresh();
      } catch (error) {
        toast.error("Failed to update admin status.");
      }
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${editingUser._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      toast.success(" User updated successfully!");
      setEditingUser(null);
      refresh();
    } catch (error) {
      toast.error("Failed to update user.");
    }
  };

  const handleDeleteClick = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (confirmed) {
      try {
        await onDelete(id);
        toast.success("🗑️ User deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete user.");
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-lg relative animate-scale-in">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-800">Edit User</h2>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border px-4 py-2 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  <option value="customer">Customer</option>
                  <option value="restaurantOwner">Restaurant Owner</option>
                  <option value="deliveryAgent">Delivery Agent</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Admin</th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((u) => (
            <tr key={u._id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
                {u.name}
                {u.isAdmin && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-gray-700 capitalize">{u.role}</td>
              <td className="px-6 py-4 text-center">
                {u.isAdmin ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-500 font-semibold">No</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                <button
                  onClick={() => handleMakeAdmin(u)}
                  className="text-blue-600 hover:text-blue-800 transition"
                  title={u.isAdmin ? "Remove Admin" : "Make Admin"}
                >
                  <FaUserShield size={18} />
                </button>

                <button
                  onClick={() => handleEditClick(u)}
                  className="text-green-600 hover:text-green-800 transition"
                  title="Edit User"
                >
                  <FaEdit size={18} />
                </button>

                <button
                  onClick={() => handleDeleteClick(u._id)}
                  className="text-red-600 hover:text-red-800 transition"
                  title="Delete User"
                >
                  <FaTrash size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
