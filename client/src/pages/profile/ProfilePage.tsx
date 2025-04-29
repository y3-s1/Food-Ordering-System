import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import userApi from "../../api/userApi";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ProfileForm from "./ProfileForm";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await userApi.get("/users/profile", { withCredentials: true });
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData: any) => {
    try {
      const res = await userApi.put(`/users/${profile.userId}`, updatedData, { withCredentials: true });
      toast.success("Profile updated successfully");
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  const handleDelete = async () => {
    const confirmed = confirm("Are you sure you want to delete your account? This cannot be undone!");
    if (confirmed) {
      try {
        await userApi.delete(`/users/${profile.userId}`, { withCredentials: true });
        toast.success("Account deleted successfully");
        logout(); // Log out user after deletion
        navigate("/");
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">My Profile</h2>

      {profile && (
        <>
          <ProfileForm profile={profile} onUpdate={handleUpdate} />

          <div className="text-center mt-8">
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold"
            >
              Delete My Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}
