// src/components/shared/MenuItem.tsx
import React from 'react';
import { MenuItem as MenuItemType } from '../../types/types';

interface MenuItemProps {
  menuItem: MenuItemType;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  menuItem, 
  onEdit, 
  onDelete, 
  onToggleAvailability 
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-4">
      <div className="md:w-1/4 h-40 rounded-lg overflow-hidden">
        {menuItem.imageUrl ? (
          <img 
            src={menuItem.imageUrl} 
            alt={menuItem.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="md:w-3/4 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{menuItem.name}</h3>
            <span className="text-sm text-gray-500">{menuItem.category}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-blue-600">${menuItem.price.toFixed(2)}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mt-2 mb-4">{menuItem.description}</p>
        
        <div className="flex items-center gap-2 mt-auto">
          <span className={`px-2 py-1 rounded-full text-xs ${
            menuItem.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {menuItem.isAvailable ? 'Available' : 'Unavailable'}
          </span>
          <span className="text-xs text-gray-500">
            Prep time: {menuItem.preparationTime} min
          </span>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            onClick={() => onEdit(menuItem._id)}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-1 rounded-lg text-sm transition-colors duration-300"
          >
            Edit
          </button>
          <button
            onClick={() => onToggleAvailability(menuItem._id)}
            className={`${
              menuItem.isAvailable 
                ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
                : 'bg-green-100 hover:bg-green-200 text-green-800'
            } px-4 py-1 rounded-lg text-sm transition-colors duration-300`}
          >
            {menuItem.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          </button>
          <button
            onClick={() => onDelete(menuItem._id)}
            className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-1 rounded-lg text-sm transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;