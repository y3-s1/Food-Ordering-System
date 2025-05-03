// ProfilePage.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import userApi from "../../api/userApi";
import { toast } from "react-hot-toast";
import ProfileForm from "./ProfileForm";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { logout } = useAuth();
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
        logout();
        navigate("/");
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg px-8 py-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
            <p className="mt-2 text-gray-600">Manage your account details</p>
          </div>

          {profile && (
            <>
              <ProfileForm profile={profile} onUpdate={handleUpdate} />
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <button
                  onClick={handleDelete}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 font-medium"
                >
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}