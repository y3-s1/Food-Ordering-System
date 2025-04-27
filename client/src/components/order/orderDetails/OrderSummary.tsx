import React from 'react';

interface SummaryProps {
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  totalPrice: number;
}

export const OrderSummary: React.FC<SummaryProps> = ({ deliveryFee, serviceFee, tax, totalPrice }) => (
  <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
    <h2 className="text-lg font-semibold mb-4">Summary</h2>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Delivery Fee</span>
        <span>${deliveryFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Service Fee</span>
        <span>${serviceFee.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="border-t pt-2 flex justify-between font-semibold">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  </div>
);