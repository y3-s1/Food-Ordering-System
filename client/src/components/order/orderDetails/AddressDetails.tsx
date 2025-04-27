import React from 'react';

interface AddressProps {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export const AddressDetails: React.FC<AddressProps> = ({ street, city, postalCode, country }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
    <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
    <p>{street}</p>
    <p>
      {city}, {postalCode}
    </p>
    <p>{country}</p>
  </div>
);