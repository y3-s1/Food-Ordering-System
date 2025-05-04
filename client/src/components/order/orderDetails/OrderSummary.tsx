import React from 'react';

interface SummaryProps {
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  totalPrice: number;
}

export const OrderSummary: React.FC<SummaryProps> = ({ deliveryFee, serviceFee, tax, totalPrice }) => (
  <div className="bg-white rounded-xl p-6 shadow-md h-full">
    <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Order Summary</h2>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Delivery Fee</span>
        <span className="font-medium">${deliveryFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Service Fee</span>
        <span className="font-medium">${serviceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">${tax.toFixed(2)}</span>
      </div>
      <div className="border-t border-gray-200 pt-3 mt-3">
        <div className="flex justify-between items-center font-semibold text-lg">
          <span>Total</span>
          <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
);