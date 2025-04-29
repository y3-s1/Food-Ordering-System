import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';

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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        location: {
          lat: parseFloat(form.lat),
          lng: parseFloat(form.lng)
        },
        cuisineType: form.cuisineType.split(',').map(c => c.trim()),
      };
      await restaurantApi.post('/', payload);
      alert('Restaurant submitted for approval!');
      navigate('/dashboard');
    } catch (err) {
      alert('Submission failed.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add Restaurant</h2>
      {[
        { label: 'Name', name: 'name' },
        { label: 'Description', name: 'description' },
        { label: 'Address', name: 'address' },
        { label: 'Latitude', name: 'lat' },
        { label: 'Longitude', name: 'lng' },
        { label: 'Contact Number', name: 'contactNumber' },
        { label: 'Email', name: 'email' },
        { label: 'Cuisine Types (comma-separated)', name: 'cuisineType' },
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
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </div>
  );
}
