const RestaurantDetailPage = () => {
  return <div>This is the Restaurant Details Page</div>;
};

export default RestaurantDetailPage;


// // src/pages/RestaurantDetailPage.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   fetchRestaurantById, 
//   fetchMenuItems, 
//   toggleRestaurantAvailability, 
//   deleteRestaurant,
//   toggleMenuItemAvailability,
//   deleteMenuItem
// } from '../api/restaurantApi';
// import { Restaurant, MenuItem } from '../types/types';
// import MenuItemComponent from '../components/restaurant/MenuItem';

// const RestaurantDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
  
//   const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
//   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [filterCategory, setFilterCategory] = useState<string>('all');
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
  
//   const categories = ['all', ...new Set(menuItems.map(item => item.category))];
  
//   useEffect(() => {
//     const loadRestaurantData = async () => {
//       if (!id) return;
      
//       try {
//         setLoading(true);
//         const restaurantData = await fetchRestaurantById(id);
//         setRestaurant(restaurantData);
        
//         const menuItemsData = await fetchMenuItems(id);
//         setMenuItems(menuItemsData);
//       } catch (err) {
//         setError('Failed to load restaurant details. Please try again later.');
//         console.error('Error loading restaurant details:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     loadRestaurantData();
//   }, [id]);
  
//   const handleToggleAvailability = async () => {
//     if (!restaurant || !id) return;
    
//     try {
//       const response = await toggleRestaurantAvailability(id);
//       setRestaurant({
//         ...restaurant,
//         isAvailable: response.isAvailable,
//       });
//     } catch (err) {
//       console.error('Error toggling restaurant availability:', err);
//       alert('Failed to update restaurant availability. Please try again.');
//     }
//   };
  
//   const handleDeleteRestaurant = async () => {
//     if (!id) return;
    
//     try {
//       await deleteRestaurant(id);
//       navigate('/restaurants');
//     } catch (err) {
//       console.error('Error deleting restaurant:', err);
//       alert('Failed to delete restaurant. Please try again.');
//     }
//   };
  
//   const handleToggleItemAvailability = async (itemId: string) => {
//     if (!id) return;
    
//     try {
//       const response = await toggleMenuItemAvailability(id, itemId);
//       setMenuItems(menuItems.map(item => 
//         item._id === itemId ? { ...item, isAvailable: response.isAvailable } : item
//       ));
//     } catch (err) {
//       console.error('Error toggling menu item availability:', err);
//       alert('Failed to update menu item availability. Please try again.');
//     }
//   };
  
//   const handleDeleteMenuItem = async (itemId: string) => {
//     if (!id) return;
    
//     try {
//       await deleteMenuItem(id, itemId);
//       setMenuItems(menuItems.filter(item => item._id !== itemId));
//     } catch (err) {
//       console.error('Error deleting menu item:', err);
//       alert('Failed to delete menu item. Please try again.');
//     }
//   };
  
//   const handleEditMenuItem = (itemId: string) => {
//     navigate(`/restaurants/${id}/menu-items/${itemId}/edit`);
//   };
  
//   const filteredMenuItems = filterCategory === 'all' 
//     ? menuItems 
//     : menuItems.filter(item => item.category === filterCategory);
  
//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-10 flex justify-center">
//         <div className="animate-pulse flex flex-col items-center">
//           <div className="h-10 w-10 bg-blue-200 rounded-full"></div>
//           <div className="mt-2 text-gray-500">Loading restaurant details...</div>
//         </div>
//       </div>
//     );
//   }
  
//   if (error || !restaurant) {
//     return (
//       <div className="container mx-auto px-4 py-10 flex justify-center">
//         <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-3xl">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">{error || 'Restaurant not found'}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       {/* Restaurant Header */}
//       <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//         <div className="h-52 md:h-64 bg-gradient-to-r from-blue-500 to-blue-700 relative">
//           {restaurant.imageUrl && (
//             <img
//               src={restaurant.imageUrl}
//               alt={restaurant.name}
//               className="w-full h-full object-cover absolute mix-blend-overlay"
//             />
//           )}
//           <div className="absolute inset-0 bg-black bg-opacity-20"></div>
//           <div className="absolute inset-0 p-6 flex flex-col justify-end">
//             <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
//             <div className="flex flex-wrap gap-2 mb-2">
//               {restaurant.cuisineType.map((cuisine, index) => (
//                 <span 
//                   key={index} 
//                   className="bg-white bg-opacity-20 text-white px-2 py-1 rounded text-sm backdrop-blur-sm"
//                 >
//                   {cuisine}
//                 </span>
//               ))}
//             </div>
//             <div className="flex items-center gap-2">
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//                 restaurant.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//               }`}>
//                 {restaurant.isAvailable ? 'Open' : 'Closed'}
//               </span>
//               <span className="text-white text-sm">
//                 {restaurant.openingHours}
//               </span>
//             </div>
//           </div>
//         </div>
        
//         <div className="p-6">
//           <div className="flex flex-col md:flex-row gap-4 md:gap-8">
//             <div className="md:w-2/3">
//               <h2 className="text-lg font-semibold mb-2">About</h2>
//               <p className="text-gray-600 mb-4">{restaurant.description}</p>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="text-md font-medium mb-1">Address</h3>
//                   <p className="text-gray-600">{restaurant.address}</p>
//                 </div>
//                 <div>
//                   <h3 className="text-md font-medium mb-1">Contact</h3>
//                   <p className="text-gray-600">{restaurant.contactNumber}</p>
//                   <p className="text-gray-600">{restaurant.email}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="md:w-1/3 flex flex-col gap-3">
//               <button
//                 onClick={() => navigate(`/restaurants/${id}/edit`)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                 </svg>
//                 Edit Restaurant
//               </button>
              
//               <button
//                 onClick={handleToggleAvailability}
//                 className={`${
//                   restaurant.isAvailable 
//                     ? 'bg-yellow-500 hover:bg-yellow-600' 
//                     : 'bg-green-500 hover:bg-green-600'
//                 } text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300`}
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 {restaurant.isAvailable ? 'Mark as Closed' : 'Mark as Open'}
//               </button>
              
//               <button
//                 onClick={() => navigate(`/restaurants/${id}/menu-items/add`)}
//                 className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Menu Item
//               </button>
              
//               <button
//                 onClick={() => setShowDeleteModal(true)}
//                 className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
//               >
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 Delete Restaurant
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Menu Items Section */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold">Menu Items</h2>
//           <div>
//             <select
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
//             >
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? 'All Categories' : category}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
        
//         {filteredMenuItems.length === 0 ? (
//           <div className="bg-gray-50 rounded-lg p-10 text-center">
//             <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
//             </svg>
//             <h3 className="mt-2 text-lg font-medium text-gray-900">No menu items found</h3>
//             {filterCategory !== 'all' ? (
//               <p className="mt-1 text-gray-500">No items in this category. Try selecting a different category.</p>
//             ) : (
//               <p className="mt-1 text-gray-500">Add your first menu item to get started.</p>
//             )}
//             <button
//               onClick={() => navigate(`/restaurants/${id}/menu-items/add`)}
//               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
//             >
//               Add Menu Item
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredMenuItems.map((item) => (
//               <MenuItemComponent
//                 key={item._id}
//                 menuItem={item}
//                 onEdit={handleEditMenuItem}
//                 onDelete={handleDeleteMenuItem}
//                 onToggleAvailability={handleToggleItemAvailability}
//               />
//             ))}
//           </div>
//         )}
//       </div>
      
//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Restaurant</h3>
//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete "{restaurant.name}"? This action cannot be undone, and all menu items associated with this restaurant will also be deleted.
//             </p>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setShowDeleteModal(false)}
//                 className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteRestaurant}
//                 className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantDetailPage;