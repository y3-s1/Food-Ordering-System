import React from 'react';

interface AddressProps {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export const AddressDetails: React.FC<AddressProps> = ({ street, city, postalCode, country }) => (
  <div className="bg-white rounded-xl p-6 shadow-md h-full">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Delivery Address</h2>
    <div className="space-y-2 text-left">
      <p className="text-gray-700">{street}</p>
      <p className="text-gray-700">
        {city}, {postalCode}
      </p>
      <p className="text-gray-700">{country}</p>
    </div>
  </div>
);