import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="text-blue-600 text-6xl">
            <FaUserCircle />
          </div>

          {/* User Info */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-600">{user?.email}</p>

            <div className="mt-2">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                {user?.role || "No Role"}
              </span>

              {user?.isAdmin && (
                <span className="ml-2 inline-block bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6 border-t border-gray-200" />

        {/* Profile Details */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-medium text-gray-600">User ID:</div>
            <div className="text-gray-800">{user?._id}</div>

            <div className="font-medium text-gray-600">Email:</div>
            <div className="text-gray-800">{user?.email}</div>

            <div className="font-medium text-gray-600">Role:</div>
            <div className="text-gray-800 capitalize">{user?.role}</div>

            <div className="font-medium text-gray-600">Admin Access:</div>
            <div className="text-gray-800">{user?.isAdmin ? "Yes" : "No"}</div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-right">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
