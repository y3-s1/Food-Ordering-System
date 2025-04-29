import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Restaurant } from '../../types/restaurant/restaurant';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showApprovalStatus?: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, showApprovalStatus = false }) => {
  const navigate = useNavigate();
  
  const getApprovalBadgeColor = () => {
    switch (restaurant.approvalStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        {restaurant.imageUrl ? (
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No Image</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            restaurant.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {restaurant.isAvailable ? 'Open' : 'Closed'}
          </span>
          
          {showApprovalStatus && (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getApprovalBadgeColor()}`}>
              {restaurant.approvalStatus.charAt(0).toUpperCase() + restaurant.approvalStatus.slice(1)}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{restaurant.description}</p>
        
        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span className="line-clamp-1">{restaurant.address}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {restaurant.cuisineType.map((cuisine, index) => (
            <span 
              key={index} 
              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded"
            >
              {cuisine}
            </span>
          ))}
        </div>
        
        <div className="mt-auto">
          <button
            onClick={() => navigate(`/restaurants/${restaurant._id}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;