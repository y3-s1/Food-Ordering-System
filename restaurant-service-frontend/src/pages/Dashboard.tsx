// Improved Dashboard component with better UI for restaurant cards
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { Restaurant } from '../types/types';

export default function Dashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const res = await restaurantApi.get('/owner/my-restaurants');
      setRestaurants(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const renderImageWithFallback = (imageUrl: string, name: string) => {
    return (
      <div className="h-40 bg-gray-200 rounded-t overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).onerror = null;
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
          }}
        />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Restaurants</h2>
          <button
            onClick={() => navigate('/add-restaurant')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Restaurant
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            {error}
            <button 
              onClick={loadRestaurants}
              className="ml-4 text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Restaurants Found</h3>
            <p className="text-gray-500 mb-6">You haven't added any restaurants yet. Add your first restaurant to get started!</p>
            <button
              onClick={() => navigate('/add-restaurant')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Your First Restaurant
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow duration-200">
                {renderImageWithFallback(restaurant.imageUrl, restaurant.name)}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusBadgeClass(restaurant.approvalStatus)}`}>
                      {restaurant.approvalStatus.charAt(0).toUpperCase() + restaurant.approvalStatus.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{restaurant.openingHours}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {restaurant.cuisineType.map((cuisine, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {cuisine}
                      </span>
                    ))}
                  </div>

                  {restaurant.approvalStatus === 'approved' && (
                    <div className="flex space-x-2 pt-3 border-t">
                      <button
                        onClick={() => navigate(`/manage-menu/${restaurant._id}`)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1.5 rounded text-sm font-medium flex-1 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Manage Menu
                      </button>
                      <button
                        onClick={() => navigate(`/edit-restaurant/${restaurant._id}`)}
                        className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded text-sm font-medium flex-1 flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                  )}
                  
                  {restaurant.approvalStatus === 'pending' && (
                    <div className="text-center text-yellow-600 text-sm italic pt-3 border-t">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Waiting for admin approval
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
