// src/pages/admin/RestaurantRequests.tsx
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import restuarantApi from "../../api/restuarantApi";
import { Loader2 } from "lucide-react";

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
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [approvedRestaurants, setApprovedRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes] = await Promise.all([
        restuarantApi.get("/restaurants/pending"),
        restuarantApi.get("/restaurants/approved"),
      ]);
      setPendingRestaurants(pendingRes.data);
      setApprovedRestaurants(approvedRes.data);
    } catch (err) {
      toast.error("Failed to load restaurants");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await restuarantApi.patch(`/restaurants/${id}/approve`);
      toast.success("Restaurant approved successfully");
      fetchRestaurants();
    } catch (err) {
      toast.error("Failed to approve restaurant");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await restuarantApi.patch(`/restaurants/${id}/reject`);
      toast.success("Restaurant rejected successfully");
      fetchRestaurants();
    } catch (err) {
      toast.error("Failed to reject restaurant");
    }
  };

  const filterRestaurants = (restaurants: Restaurant[]) => {
    return restaurants.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
      {/* Search Bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Restaurant Requests</h2>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-80 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pending Requests */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">⏳ Pending Requests</h3>
        {filterRestaurants(pendingRestaurants).length === 0 ? (
          <div className="text-center text-gray-500">No pending restaurants.</div>
        ) : (
          <RestaurantTable
            data={filterRestaurants(pendingRestaurants)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </section>

      {/* Approved Restaurants */}
      <section>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">✅ Approved Restaurants</h3>
        {filterRestaurants(approvedRestaurants).length === 0 ? (
          <div className="text-center text-gray-500">No approved restaurants yet.</div>
        ) : (
          <RestaurantTable data={filterRestaurants(approvedRestaurants)} />
        )}
      </section>
    </div>
  );
}

type TableProps = {
  data: Restaurant[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
};

function RestaurantTable({ data, onApprove, onReject }: TableProps) {
  return (
    <div className="overflow-x-auto bg-white p-4 rounded-lg shadow-md">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Contact</th>
            <th className="px-4 py-2 text-left">Address</th>
            <th className="px-4 py-2 text-left">Cuisine</th>
            {onApprove && <th className="px-4 py-2 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((restaurant) => (
            <tr key={restaurant._id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{restaurant.name}</td>
              <td className="px-4 py-2">{restaurant.email}</td>
              <td className="px-4 py-2">{restaurant.contactNumber}</td>
              <td className="px-4 py-2">{restaurant.address}</td>
              <td className="px-4 py-2">{restaurant.cuisineType.join(", ")}</td>
              {onApprove && (
                <td className="px-4 py-2 flex justify-center space-x-2">
                  <button
                    onClick={() => onApprove(restaurant._id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject?.(restaurant._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
