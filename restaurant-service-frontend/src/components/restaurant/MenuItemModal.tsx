import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../types/types';
import restaurantApi from '../../api/restaurantApi';

interface MenuItemModalProps {
  restaurantId: string;
  menuItem: MenuItem | null;
  onClose: () => void;
  onSave: (updatedMenuItems: MenuItem[]) => void;
  existingMenuItems: MenuItem[];
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({ 
  restaurantId, 
  menuItem, 
  onClose, 
  onSave,
  existingMenuItems 
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    imageUrl: string;
    isAvailable: boolean;
  }>({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isAvailable: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  
  // Get unique categories from existing menu items
  const existingCategories = [...new Set(existingMenuItems.map(item => item.category))].filter(Boolean);

  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price.toString(),
        category: menuItem.category,
        imageUrl: menuItem.imageUrl,
        isAvailable: menuItem.isAvailable
      });
    }
    
    // Add event listener to close modal on escape key
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [menuItem, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setFormData(prev => ({ ...prev, category: value }));
      setCustomCategory('');
    }
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCategory(value);
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the backdrop itself was clicked
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const menuItemData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        imageUrl: formData.imageUrl,
        isAvailable: formData.isAvailable
      };
      
      let updatedMenuItems;
      
      if (menuItem) {
        // Update existing menu item
        const response = await restaurantApi.put(`/${restaurantId}/menu-items/${menuItem._id}`, menuItemData);
        const updatedItem = response.data;
        updatedMenuItems = existingMenuItems.map(item => 
          item._id === menuItem._id ? updatedItem : item
        );
      } else {
        // Create new menu item
        const response = await restaurantApi.post(`/${restaurantId}/menu-items`, menuItemData);
        const newItem = response.data;
        updatedMenuItems = [...existingMenuItems, newItem];
      }
      
      onSave(updatedMenuItems);
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError('Failed to save menu item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 overflow-y-auto bg-gray-900 bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4 animate-scaleIn"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {menuItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="px-6 py-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                placeholder="Enter item name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                placeholder="Describe this menu item"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full pl-8 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              {existingCategories.length > 0 ? (
                <>
                  <select
                    id="category"
                    name="category"
                    value={existingCategories.includes(formData.category) ? formData.category : 'custom'}
                    onChange={handleCategoryChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition mb-2"
                    required
                  >
                    <option value="">Select a category</option>
                    {existingCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="custom">Add new category</option>
                  </select>
                  
                  {(!existingCategories.includes(formData.category) || customCategory) && (
                    <input
                      type="text"
                      placeholder="Enter new category"
                      value={customCategory || formData.category}
                      onChange={handleCustomCategoryChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                      required
                    />
                  )}
                </>
              ) : (
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                  placeholder="Enter category (e.g., Appetizers, Main Course, Desserts)"
                  required
                />
              )}
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">Leave empty to use default image</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isAvailable"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-gray-700">
                Item is available for ordering
              </label>
            </div>
          
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center min-w-[5rem]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MenuItemModal;