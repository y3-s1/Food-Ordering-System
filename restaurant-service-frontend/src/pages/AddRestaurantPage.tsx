import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRestaurant } from '../api/restaurantApi';
import FormInput from '../components/restaurant/FormInput';

const AddRestaurantPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    location: {
      lat: 0,
      lng: 0
    },
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
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        [name]: numValue
      }
    });
    
    // Clear error when user starts typing
    if (errors[`location.${name}`]) {
      setErrors({
        ...errors,
        [`location.${name}`]: '',
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
  
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
          setLocationLoading(false);
          setUseCurrentLocation(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationLoading(false);
          alert("Unable to get your current location. Please enter coordinates manually.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
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
    
    // Validate location
    if (formData.location.lat === 0) {
      newErrors['location.lat'] = 'Latitude is required';
    }
    
    if (formData.location.lng === 0) {
      newErrors['location.lng'] = 'Longitude is required';
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
      
      await createRestaurant(restaurantData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert('Failed to create restaurant. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h2 className="mt-3 text-2xl font-bold text-gray-800">Registration Submitted!</h2>
              <p className="mt-2 text-gray-600">
                Thank you for registering your restaurant. Your submission is currently pending review by our admin team.
                We'll review your details and approve your restaurant soon.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/restaurants')}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Back to Restaurants
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Register New Restaurant</h1>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your restaurant registration will be reviewed by our team before it appears on the platform.
                </p>
              </div>
            </div>
          </div>
          
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
              
              {/* Location Fields */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Location</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 px-3 rounded-lg transition-colors duration-300 flex items-center gap-1"
                    >
                      {locationLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Getting location...</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          <span>Use My Current Location</span>
                        </>
                      )}
                    </button>
                    {useCurrentLocation && (
                      <span className="text-sm text-green-600">✓ Using your current location</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                      <input
                        type="number"
                        name="lat"
                        step="any"
                        value={formData.location.lat}
                        onChange={handleLocationChange}
                        className={`w-full px-3 py-2 border ${errors['location.lat'] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        required
                      />
                      {errors['location.lat'] && (
                        <p className="mt-1 text-xs text-red-500">{errors['location.lat']}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                      <input
                        type="number"
                        name="lng"
                        step="any"
                        value={formData.location.lng}
                        onChange={handleLocationChange}
                        className={`w-full px-3 py-2 border ${errors['location.lng'] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        required
                      />
                      {errors['location.lng'] && (
                        <p className="mt-1 text-xs text-red-500">{errors['location.lng']}</p>
                      )}
                    </div>
                  </div>
                </div>
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
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit For Review</span>
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