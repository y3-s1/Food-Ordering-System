// src/pages/AddRestaurantPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRestaurant } from '../api/restaurantApi';
import FormInput from '../components/restaurant/FormInput';

const AddRestaurantPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    contactNumber: '',
    email: '',
    cuisineType: '',
    openingHours: '',
    isAvailable: true,
    imageUrl: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.cuisineType.trim()) {
      newErrors.cuisineType = 'Cuisine type is required';
    }
    
    if (!formData.openingHours.trim()) {
      newErrors.openingHours = 'Opening hours are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const restaurantData = {
        ...formData,
        cuisineType: formData.cuisineType.split(',').map(item => item.trim()),
      };
      
      const newRestaurant = await createRestaurant(restaurantData);
      navigate(`/restaurants/${newRestaurant._id}`);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert('Failed to create restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Restaurant</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormInput
                  label="Restaurant Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  error={errors.name}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormInput
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  required
                  error={errors.description}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormInput
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  error={errors.address}
                />
              </div>
              
              <FormInput
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
                error={errors.contactNumber}
              />
              
              <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={errors.email}
              />
              
              <FormInput
                label="Cuisine Types (comma separated)"
                name="cuisineType"
                value={formData.cuisineType}
                onChange={handleInputChange}
                placeholder="Italian, Mexican, Vegetarian, etc."
                required
                error={errors.cuisineType}
              />
              
              <FormInput
                label="Opening Hours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleInputChange}
                placeholder="Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
                required
                error={errors.openingHours}
              />
              
              <div className="md:col-span-2">
                <FormInput
                  label="Image URL"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  error={errors.imageUrl}
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <input
                    id="isAvailable"
                    name="isAvailable"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    checked={formData.isAvailable}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="isAvailable" className="ml-2 text-sm font-medium text-gray-700">
                    Restaurant is available for orders
                  </label>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate('/restaurants')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Restaurant</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurantPage;