import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { Restaurant } from '../types/types';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const navigate = useNavigate();

  const loadRestaurants = async () => {
    try {
      const res = await restaurantApi.get('/owner/my-restaurants');
      setRestaurants(res.data);
    } catch (err) {
      alert('Failed to load restaurants');
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Restaurants</h2>
        <button
          onClick={() => navigate('/add-restaurant')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New
        </button>
      </div>

      {restaurants.length === 0 ? (
        <p className="text-gray-600">You haven’t added any restaurants yet.</p>
      ) : (
        <div className="space-y-4">
          {restaurants.map((r) => (
            <div key={r._id} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="text-xl font-semibold">{r.name}</h3>
              <p className="text-gray-700">{r.description}</p>
              <p>Status: <span className={`font-semibold ${r.approvalStatus === 'approved' ? 'text-green-600' : r.approvalStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                {r.approvalStatus}
              </span></p>

              {r.approvalStatus === 'approved' && (
                <div className="mt-2 flex gap-4">
                  <button
                    onClick={() => navigate(`/manage-menu/${r._id}`)}
                    className="text-sm text-blue-600 underline"
                  >
                    Manage Menu
                  </button>
                  <button
                    onClick={() => navigate(`/edit-restaurant/${r._id}`)}
                    className="text-sm text-gray-700 underline"
                  >
                    Edit Restaurant
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
