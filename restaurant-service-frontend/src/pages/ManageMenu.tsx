import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import restaurantApi from '../api/restaurantApi';
import { MenuItem } from '../types/types';

export default function ManageMenu() {
  const { id } = useParams();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '' });

  const fetchMenu = async () => {
    try {
      const res = await restaurantApi.get(`/${id}/menu-items`);
      setMenuItems(res.data);
    } catch {
      alert('Failed to load menu');
    }
  };

  useEffect(() => { fetchMenu(); }, [id]);

  const handleCreate = async () => {
    try {
      const payload = { ...newItem, price: parseFloat(newItem.price) };
      await restaurantApi.post(`/${id}/menu-items`, payload);
      setNewItem({ name: '', description: '', price: '', category: '' });
      fetchMenu();
    } catch {
      alert('Failed to add item');
    }
  };

  const handleToggle = async (itemId: string) => {
    await restaurantApi.patch(`/${id}/menu-items/${itemId}/toggle-availability`);
    fetchMenu();
  };

  const handleDelete = async (itemId: string) => {
    await restaurantApi.delete(`/${id}/menu-items/${itemId}`);
    fetchMenu();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Menu</h2>

      <div className="mb-6 bg-gray-100 p-4 rounded shadow-sm">
        <h3 className="font-semibold mb-2">Add New Item</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="Name" className="input" />
          <input value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} placeholder="Category" className="input" />
          <input value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} type="number" placeholder="Price" className="input" />
          <input value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} placeholder="Description" className="input col-span-2" />
        </div>
        <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded">Add Item</button>
      </div>

      <div className="grid gap-4">
        {menuItems.map(item => (
          <div key={item._id} className="p-4 border rounded bg-white shadow-sm">
            <h4 className="font-semibold">{item.name}</h4>
            <p>{item.description}</p>
            <p className="text-sm text-gray-600">Price: ${item.price} | Category: {item.category}</p>
            <p>Status: {item.isAvailable ? 'Available' : 'Unavailable'}</p>
            <div className="mt-2 flex gap-3">
              <button onClick={() => handleToggle(item._id)} className="text-sm text-blue-600 underline">Toggle</button>
              <button onClick={() => handleDelete(item._id)} className="text-sm text-red-500 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
