import React, { useState, useEffect } from 'react';
import { fetchPendingRestaurants, approveRestaurant, rejectRestaurant } from '../api/restaurantApi';
import { Restaurant } from '../types/types';

const RestaurantAdminRequestPage: React.FC = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [processing, setProcessing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadPendingRestaurants();
  }, []);

  const loadPendingRestaurants = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingRestaurants();
      setPendingRestaurants(data);
      setFilteredRestaurants(data);
    } catch (err) {
      setError('Failed to load pending restaurant requests. Please try again later.');
      console.error('Error loading pending restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter restaurants based on search term
    const filtered = pendingRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort restaurants based on selected sort option
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Default: sort by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredRestaurants(sorted);
  }, [searchTerm, sortBy, pendingRestaurants]);

  const handleApprove = async (id: string) => {
    try {
      setProcessing(prev => ({ ...prev, [id]: true }));
      await approveRestaurant(id);
      // Remove the approved restaurant from the list
      setPendingRestaurants(prev => prev.filter(restaurant => restaurant._id !== id));
    } catch (err) {
      setError('Failed to approve restaurant. Please try again.');
      console.error('Error approving restaurant:', err);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: string) => {
    try {
      setProcessing(prev => ({ ...prev, [id]: true }));
      await rejectRestaurant(id);
      // Remove the rejected restaurant from the list
      setPendingRestaurants(prev => prev.filter(restaurant => restaurant._id !== id));
    } catch (err) {
      setError('Failed to reject restaurant. Please try again.');
      console.error('Error rejecting restaurant:', err);
    } finally {
      setProcessing(prev => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-10 bg-blue-200 rounded-full"></div>
          <div className="mt-2 text-gray-500">Loading restaurant requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Restaurant Approval Requests</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                placeholder="Search by restaurant name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">
              Sort by:
            </label>
            <select
              id="sort-by"
              className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'date')}
            >
              <option value="date">Date (newest first)</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No pending requests</h3>
          <p className="mt-1 text-gray-500">There are currently no restaurant approval requests pending.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuisine Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRestaurants.map((restaurant) => (
                <tr key={restaurant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={restaurant.imageUrl || '/placeholder-restaurant.jpg'} 
                          alt={restaurant.name} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        <div className="text-sm text-gray-500">{restaurant.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{restaurant.email}</div>
                    <div className="text-sm text-gray-500">{restaurant.contactNumber}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {restaurant.cuisineType.map((cuisine, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {cuisine}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {formatDate(restaurant.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApprove(restaurant._id)}
                        disabled={processing[restaurant._id]}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition-colors duration-300 disabled:bg-green-300"
                      >
                        {processing[restaurant._id] ? 'Processing...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(restaurant._id)}
                        disabled={processing[restaurant._id]}
                        className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors duration-300 disabled:bg-red-300"
                      >
                        {processing[restaurant._id] ? 'Processing...' : 'Reject'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RestaurantAdminRequestPage;