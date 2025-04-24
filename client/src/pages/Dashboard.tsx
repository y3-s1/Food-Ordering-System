import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>Admin: {user?.isAdmin ? 'Yes' : 'No'}</p>

      <button 
        onClick={handleLogout}
        className="mt-6 bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  );
}
