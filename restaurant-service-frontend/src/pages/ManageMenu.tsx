import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { MenuItem, Restaurant } from '../types/types';

export default function ManageMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newItem, setNewItem] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    category: '',
    imageUrl: '' // Added imageUrl field
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchRestaurantData = async () => {
    try {
      setLoading(true);
      // Get restaurant details
      const restaurantRes = await restaurantApi.get(`/${id}`);
      setRestaurant(restaurantRes.data);
      
      // Get menu items
      const menuRes = await restaurantApi.get(`/${id}/menu-items`);
      setMenuItems(menuRes.data);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set<string>(menuRes.data.map((item: MenuItem) => item.category))
      );
      
      setCategories(uniqueCategories);
    } catch (err) {
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurantData();
  }, [id]);

  const validateNewItem = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!newItem.name.trim()) newErrors.name = 'Item name is required';
    if (!newItem.category.trim()) newErrors.category = 'Category is required';
    if (!newItem.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(newItem.price)) || parseFloat(newItem.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    // Validate imageUrl if provided (optional field)
    if (newItem.imageUrl && !isValidUrl(newItem.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Simple URL validation function
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNewItem()) return;
    
    try {
      setAdding(true);
      const payload = { 
        ...newItem, 
        price: parseFloat(newItem.price),
        restaurantId: id,
        isAvailable: true // Set default availability to true
      };
      
      await restaurantApi.post(`/${id}/menu-items`, payload);
      
      // Reset form
      setNewItem({ name: '', description: '', price: '', category: '', imageUrl: '' });
      setErrors({});
      
      // Refresh menu items
      fetchRestaurantData();
    } catch (err) {
      alert('Failed to add item');
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (itemId: string) => {
    try {
      await restaurantApi.patch(`/${id}/menu-items/${itemId}/toggle-availability`);
      fetchRestaurantData();
    } catch (err) {
      alert('Failed to update item availability');
    }
  };

  const handleDelete = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await restaurantApi.delete(`/${id}/menu-items/${itemId}`);
        fetchRestaurantData();
      } catch (err) {
        alert('Failed to delete item');
      }
    }
  };

  // Filter menu items based on search term and selected category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Generate a fallback image based on item name
  const getFallbackImage = (itemName: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(itemName)}&background=random&size=100`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pb-16">
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        {restaurant && (
          <div className="relative h-40 bg-gray-200">
            <img 
              src={restaurant.imageUrl} 
              alt={restaurant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(restaurant.name)}&background=random&size=200`;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <h1 className="text-white text-3xl font-bold">{restaurant.name}</h1>
            </div>
          </div>
        )}
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manage Menu</h2>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Add New Item Form */}
          <div className="bg-gray-50 border rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-lg mb-3">Add New Menu Item</h3>
            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input
                    value={newItem.name}
                    onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Item name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <input
                    value={newItem.category}
                    onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                    placeholder="e.g., Appetizers, Main Course, Desserts"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    list="existing-categories"
                  />
                  <datalist id="existing-categories">
                    {categories.map((category, index) => (
                      <option key={index} value={category} />
                    ))}
                  </datalist>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)*</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newItem.price}
                    onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newItem.imageUrl}
                    onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Brief description of the item"
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={adding}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
                >
                  {adding && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {adding ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>

          {/* Menu Items List */}
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
              <h3 className="font-semibold text-lg">Menu Items ({menuItems.length})</h3>
              
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-md pl-9 pr-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {filteredMenuItems.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {menuItems.length === 0 ? (
                  <p className="text-gray-500">No menu items added yet. Add your first item above!</p>
                ) : (
                  <p className="text-gray-500">No menu items match your filter criteria.</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMenuItems.map(item => (
                  <div 
                    key={item._id} 
                    className={`p-4 border rounded-lg shadow-sm ${item.isAvailable ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-grow">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="font-medium text-gray-800">${item.price.toFixed(2)}</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                            {item.category}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            item.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Item Image */}
                      <div className="w-16 h-16 flex-shrink-0">
                        <img 
                          src={item.imageUrl || getFallbackImage(item.name)} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).onerror = null;
                            (e.target as HTMLImageElement).src = getFallbackImage(item.name);
                          }}
                        />
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-end gap-2">
                      <button 
                        onClick={() => handleToggle(item._id)}
                        className={`text-xs px-3 py-1 rounded ${
                          item.isAvailable
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {item.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                      </button>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-100 text-red-800 hover:bg-red-200 text-xs px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}