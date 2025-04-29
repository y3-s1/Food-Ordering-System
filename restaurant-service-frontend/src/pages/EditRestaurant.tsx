// Improved EditRestaurant component with structured form
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { Restaurant } from '../types/types';
import FormField from '../components/shared/FormField';

interface FormErrors {
  [key: string]: string;
}

export default function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [originalRestaurant, setOriginalRestaurant] = useState<Restaurant | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const res = await restaurantApi.get(`/${id}`);
      const restaurant = res.data;
      
      setOriginalRestaurant(restaurant);
      
      setForm({
        ...restaurant,
        lat: restaurant.location.lat,
        lng: restaurant.location.lng,
        cuisineType: restaurant.cuisineType.join(', ')
      });
    } catch (err) {
      alert('Failed to load restaurant');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  // Check if form has changed from original data
  useEffect(() => {
    if (form && originalRestaurant) {
      const formChanged = 
        form.name !== originalRestaurant.name ||
        form.description !== originalRestaurant.description ||
        form.address !== originalRestaurant.address ||
        form.lat !== originalRestaurant.location.lat ||
        form.lng !== originalRestaurant.location.lng ||
        form.contactNumber !== originalRestaurant.contactNumber ||
        form.email !== originalRestaurant.email ||
        form.cuisineType !== originalRestaurant.cuisineType.join(', ') ||
        form.openingHours !== originalRestaurant.openingHours ||
        form.imageUrl !== originalRestaurant.imageUrl;
      
      setHasChanges(formChanged);
    }
  }, [form, originalRestaurant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    
    if (!form.lat) {
      newErrors.lat = 'Latitude is required';
    } else if (isNaN(parseFloat(form.lat))) {
      newErrors.lat = 'Latitude must be a valid number';
    }
    
    if (!form.lng) {
      newErrors.lng = 'Longitude is required';
    } else if (isNaN(parseFloat(form.lng))) {
      newErrors.lng = 'Longitude must be a valid number';
    }
    
    if (!form.contactNumber.trim()) newErrors.contactNumber = 'Contact number is required';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!form.cuisineType.trim()) newErrors.cuisineType = 'At least one cuisine type is required';
    if (!form.openingHours.trim()) newErrors.openingHours = 'Opening hours are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      const payload = {
        ...form,
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng)
        },
        cuisineType: form.cuisineType.split(',').map((c: string) => c.trim()),
      };
      
      await restaurantApi.put(`/${id}`, payload);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Update failed. Please try again.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const renderImagePreview = () => {
    if (!form?.imageUrl) return null;
    
    return (
      <div className="mt-2 mb-4">
        <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
        <div className="border rounded-md overflow-hidden h-40 bg-gray-100">
          <img
            src={form.imageUrl}
            alt="Restaurant preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
            }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-red-500">Failed to load restaurant data.</p>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6 pb-2 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Edit Restaurant</h2>
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
        
        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Restaurant Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                error={errors.name}
              />
            </div>
            
            <div className="md:col-span-2">
              <FormField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                error={errors.description}
                isTextarea
                rows={4}
              />
            </div>
            
            <div className="md:col-span-2">
              <FormField
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                error={errors.address}
              />
            </div>
            
            <FormField
              label="Latitude"
              name="lat"
              value={form.lat}
              onChange={handleChange}
              required
              error={errors.lat}
              type="number"
            />
            
            <FormField
              label="Longitude"
              name="lng"
              value={form.lng}
              onChange={handleChange}
              required
              error={errors.lng}
              type="number"
            />
            
            <FormField
              label="Contact Number"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              error={errors.contactNumber}
            />
            
            <FormField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              error={errors.email}
              type="email"
            />
            
            <div className="md:col-span-2">
              <FormField
                label="Cuisine Types"
                name="cuisineType"
                value={form.cuisineType}
                onChange={handleChange}
                placeholder="Comma-separated list (e.g. Italian, Seafood, Vegan)"
                required
                error={errors.cuisineType}
              />
            </div>
            
            <FormField
              label="Opening Hours"
              name="openingHours"
              value={form.openingHours}
              onChange={handleChange}
              required
              error={errors.openingHours}
            />
            
            <div className="md:col-span-2">
              <FormField
                label="Image URL"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                error={errors.imageUrl}
              />
              {renderImagePreview()}
            </div>
          </div>
          
          <div className="flex justify-end mt-6 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mr-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className={`px-6 py-2 rounded-md flex items-center ${
                hasChanges 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {saving && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}