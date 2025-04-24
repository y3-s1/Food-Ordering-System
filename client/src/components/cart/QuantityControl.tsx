import React from 'react';

interface Props {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const QuantityControl: React.FC<Props> = ({ quantity, onIncrement, onDecrement }) => (
  <div className="flex items-center space-x-2">
    <button onClick={onDecrement} className="px-2 py-1 rounded-full border">-</button>
    <span className="w-6 text-center">{quantity}</span>
    <button onClick={onIncrement} className="px-2 py-1 rounded-full border">+</button>
  </div>
);

export default QuantityControl;
