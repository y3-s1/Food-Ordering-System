// src/pages/admin/RestaurantRequests.tsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import restuarantApi from "../../api/restuarantApi"; // Your axios instance (target restaurant-service)
import { Loader2 } from "lucide-react";

// Define the restaurant type
type Restaurant = {
  _id: string;
  name: string;
  email: string;
  address: string;
  contactNumber: string;
  cuisineType: string[];
  openingHours: string;
  approvalStatus: "pending" | "approved" | "rejected";
};

export default function RestaurantRequests() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPendingRestaurants();
  }, []);

  const fetchPendingRestaurants = async () => {
    try {
      const res = await restuarantApi.get("/restaurants/pending");
      setRestaurants(res.data);
      setFilteredRestaurants(res.data);
    } catch (err) {
      toast.error("Failed to load pending restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await restuarantApi.patch(`/restaurants/${id}/approve`);
      toast.success("Restaurant approved successfully");
      fetchPendingRestaurants();
    } catch (err) {
      toast.error("Failed to approve restaurant");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await restuarantApi.patch(`/restaurants/${id}/reject`);
      toast.success("Restaurant rejected successfully");
      fetchPendingRestaurants();
    } catch (err) {
      toast.error("Failed to reject restaurant");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = restaurants.filter((r) =>
      r.name.toLowerCase().includes(term) || r.email.toLowerCase().includes(term)
    );
    setFilteredRestaurants(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Pending Restaurant Requests</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded-lg px-4 py-2 w-80 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center text-gray-600 mt-10">No pending requests found.</div>
      ) : (
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Contact</th>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Cuisine</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRestaurants.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{restaurant.name}</td>
                  <td className="px-4 py-2">{restaurant.email}</td>
                  <td className="px-4 py-2">{restaurant.contactNumber}</td>
                  <td className="px-4 py-2">{restaurant.address}</td>
                  <td className="px-4 py-2">{restaurant.cuisineType.join(", ")}</td>
                  <td className="px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => handleApprove(restaurant._id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(restaurant._id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
