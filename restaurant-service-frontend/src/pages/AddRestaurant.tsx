// Improved AddRestaurant component with Leaflet Map for location selection
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import FormField from '../components/shared/FormField';
import type * as L from 'leaflet';

declare global {
  interface Window {
    L: typeof L;
  }
}

interface FormErrors {
  [key: string]: string;
}

export default function AddRestaurant() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    address: '',
    lat: '',
    lng: '',
    contactNumber: '',
    email: '',
    cuisineType: '',
    openingHours: '',
    imageUrl: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const navigate = useNavigate();

  // Load Leaflet scripts
  useEffect(() => {
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    leafletCSS.crossOrigin = '';
    document.head.appendChild(leafletCSS);

    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletScript.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    leafletScript.crossOrigin = '';
    
    leafletScript.onload = () => {
      initializeMap();
    };
    
    leafletScript.onerror = () => {
      setMapError('Failed to load map. Please enter coordinates manually.');
    };
    
    document.head.appendChild(leafletScript);

    return () => {
      document.head.removeChild(leafletCSS);
      document.head.removeChild(leafletScript);
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.L) return;
    
    try {
      const defaultLat = 40.7128;
      const defaultLng = -74.0060;
      const initialLat = form.lat ? parseFloat(form.lat) : defaultLat;
      const initialLng = form.lng ? parseFloat(form.lng) : defaultLng;

      const map = window.L.map(mapRef.current).setView([initialLat, initialLng], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const marker = window.L.marker([initialLat, initialLng], {
        draggable: true
      }).addTo(map);

      mapInstanceRef.current = map;
      markerRef.current = marker;

      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setForm(prev => ({
          ...prev,
          lat: position.lat.toFixed(6),
          lng: position.lng.toFixed(6)
        }));
        getAddressFromCoords(position.lat, position.lng);
      });

      map.on('click', (event: L.LeafletMouseEvent) => {
        const { lat, lng } = event.latlng;
        marker.setLatLng([lat, lng]);
        setForm(prev => ({
          ...prev,
          lat: lat.toFixed(6),
          lng: lng.toFixed(6)
        }));
        getAddressFromCoords(lat, lng);
      });

      setMapLoaded(true);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing map. Please enter coordinates manually.');
    }
  };

  // Update marker position when lat/lng input fields change
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current && form.lat && form.lng) {
      const lat = parseFloat(form.lat);
      const lng = parseFloat(form.lng);
      if (!isNaN(lat) && !isNaN(lng)) {
        markerRef.current.setLatLng([lat, lng]);
        mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
      }
    }
  }, [form.lat, form.lng]);

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        { headers: { 'Accept-Language': 'en-US,en' } }
      );
      if (!response.ok) throw new Error('Failed to fetch address');
      const data = await response.json();
      if (data?.display_name) {
        setForm(prev => ({ ...prev, address: data.display_name }));
      }
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
    }
  };

  // Use browser geolocation to set current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          
          setForm(prev => ({
            ...prev,
            lat: lat,
            lng: lng
          }));
          
          // Update map marker and center
          if (markerRef.current && mapInstanceRef.current) {
            markerRef.current.setLatLng([position.coords.latitude, position.coords.longitude]);
            mapInstanceRef.current.setView([position.coords.latitude, position.coords.longitude], 15);
            
            // Get address for this location
            getAddressFromCoords(position.coords.latitude, position.coords.longitude);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser');
    }
  };

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
    
    if (!form.lat.trim()) {
      newErrors.lat = 'Latitude is required';
    } else if (isNaN(parseFloat(form.lat))) {
      newErrors.lat = 'Latitude must be a valid number';
    }
    
    if (!form.lng.trim()) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng)
        },
        cuisineType: form.cuisineType.split(',').map(c => c.trim()),
      };
      
      await restaurantApi.post('/', payload);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || 'Submission failed. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderImagePreview = () => {
    if (!form.imageUrl) return null;
    
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

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b">Add New Restaurant</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Restaurant Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter restaurant name"
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
                placeholder="Brief description of your restaurant"
                required
                error={errors.description}
                isTextarea
                rows={4}
              />
            </div>
            
            {/* Location Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Location Information</h3>
              
              {/* Location Actions */}
              <div className="mb-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Use my current location
                  </button>
                </div>
              </div>
              
              {/* Map */}
              <div className="mb-4">
                <div 
                  ref={mapRef}
                  className="w-full h-64 rounded-md border border-gray-300 bg-gray-100 z-0"
                  style={{ display: mapError ? 'none' : 'block' }}
                >
                  {!mapLoaded && !mapError && (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                    </div>
                  )}
                </div>
                
                {mapError && (
                  <div className="w-full p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    {mapError}
                  </div>
                )}
                
                <p className="mt-2 text-sm text-gray-600">
                  Click on the map to set location or drag the marker to adjust position
                </p>
              </div>
              
              {/* Search button with Nominatim */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="address-search"
                    placeholder="Enter an address to search"
                    className="block w-full border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const searchInput = document.getElementById('address-search') as HTMLInputElement;
                      if (searchInput && searchInput.value) {
                        // Search address using Nominatim
                        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput.value)}`)
                          .then(response => response.json())
                          .then(data => {
                            if (data && data.length > 0) {
                              const result = data[0];
                              const lat = parseFloat(result.lat);
                              const lng = parseFloat(result.lon);
                              
                              // Update form
                              setForm(prev => ({
                                ...prev,
                                lat: lat.toFixed(6),
                                lng: lng.toFixed(6),
                                address: result.display_name
                              }));
                              
                              // Update map
                              if (markerRef.current && mapInstanceRef.current) {
                                markerRef.current.setLatLng([lat, lng]);
                                mapInstanceRef.current.setView([lat, lng], 15);
                              }
                            } else {
                              alert('Address not found. Try a different search term.');
                            }
                          })
                          .catch(error => {
                            console.error('Error searching for address:', error);
                            alert('Error searching for address. Please try again.');
                          });
                      }
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full street address"
                  required
                  error={errors.address}
                />
              </div>
              
              <FormField
                label="Latitude"
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="e.g. 40.7128"
                required
                error={errors.lat}
                type="number"
                step="0.000001"
              />
              
              <FormField
                label="Longitude"
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="e.g. -74.0060"
                required
                error={errors.lng}
                type="number"
                step="0.000001"
              />
            </div>
            
            <FormField
              label="Contact Number"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              placeholder="Phone number"
              required
              error={errors.contactNumber}
            />
            
            <FormField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Contact email"
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
              placeholder="e.g. Mon-Fri: 9AM-10PM, Sat-Sun: 10AM-11PM"
              required
              error={errors.openingHours}
            />
            
            <div className="md:col-span-2">
              <FormField
                label="Image URL"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="URL to restaurant image"
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
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Restaurant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}