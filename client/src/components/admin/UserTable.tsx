import { FaTrash, FaEdit, FaUserShield } from "react-icons/fa";

type Props = {
  users: any[];
  onDelete: (id: string) => void;
  refresh: () => void;
};

export default function UserTable({ users, onDelete, refresh }: Props) {
  const handleMakeAdmin = async (id: string) => {
    const confirmed = confirm("Make this user an admin?");
    if (confirmed) {
      await fetch(`http://localhost:5004/api/users/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: true }),
      });
      refresh();
    }
  };

  return (
    <div className="overflow-x-auto bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      <table className="w-full table-auto text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Admin</th>
            <th className="p-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.isAdmin ? "✅" : "❌"}</td>
              <td className="p-2 text-right space-x-2">
                <button onClick={() => handleMakeAdmin(u._id)} title="Make Admin">
                  <FaUserShield className="inline text-blue-600 hover:text-blue-800" />
                </button>
                <button onClick={() => alert("Edit coming soon")} title="Edit">
                  <FaEdit className="inline text-green-600 hover:text-green-800" />
                </button>
                <button onClick={() => onDelete(u._id)} title="Delete">
                  <FaTrash className="inline text-red-600 hover:text-red-800" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
