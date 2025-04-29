import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { Restaurant } from '../types/types';

export default function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);

  const fetchRestaurant = async () => {
    try {
      const res = await restaurantApi.get(`/${id}`);
      const r = res.data;
      setForm({
        ...r,
        lat: r.location.lat,
        lng: r.location.lng,
        cuisineType: r.cuisineType.join(', ')
      });
    } catch (err) {
      alert('Failed to load restaurant');
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        ...form,
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng)
        },
        cuisineType: form.cuisineType.split(',').map((c: string) => c.trim())
      };
      await restaurantApi.put(`/${id}`, payload);
      alert('Restaurant updated!');
      navigate('/dashboard');
    } catch (err) {
      alert('Update failed');
    }
  };

  if (!form) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Edit Restaurant</h2>
      {[
        { label: 'Name', name: 'name' },
        { label: 'Description', name: 'description' },
        { label: 'Address', name: 'address' },
        { label: 'Latitude', name: 'lat' },
        { label: 'Longitude', name: 'lng' },
        { label: 'Contact Number', name: 'contactNumber' },
        { label: 'Email', name: 'email' },
        { label: 'Cuisine Types', name: 'cuisineType' },
        { label: 'Opening Hours', name: 'openingHours' },
        { label: 'Image URL', name: 'imageUrl' },
      ].map((field) => (
        <div key={field.name} className="mb-3">
          <label className="block mb-1 text-sm font-medium">{field.label}</label>
          <input
            name={field.name}
            value={(form as any)[field.name]}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </div>
  );
}
