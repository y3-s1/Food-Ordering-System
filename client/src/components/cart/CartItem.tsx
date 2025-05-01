import React from 'react';
import QuantityControl from './QuantityControl';
import { CartItem } from '../../types/cart/cart'; // Make sure the import matches your actual file name
import { useCart } from '../../context/CartContext';
// import FoodItemModal from './FoodItemModel';

interface Props {
  item: CartItem;
  onUpdateQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  onUpdateItem?: (updatedItem: CartItem) => void;
}

const CartItemComponent: React.FC<Props> = ({
  item,
  onUpdateQty: propUpdateQty,
  onRemove: propRemove,
  // onUpdateItem: propUpdateItem
}) => {
  const { _id, name, imageUrl, quantity, unitPrice } = item;
  // const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get cart context methods
  const { updateQty, removeCartItem } = useCart();
  
  // Use provided handlers or default to context methods
  const handleUpdateQty = propUpdateQty || updateQty;
  const handleRemove = propRemove || removeCartItem;
  
  // For full item updates (including notes, etc.)
  // const handleUpdateItem = (updatedItem: CartItem) => {
  //   if (propUpdateItem) {
  //     propUpdateItem(updatedItem);
  //   } else {
      // If no specific update item handler is provided, update the quantity
      // and potentially other aspects would be handled by your API
      // handleUpdateQty(updatedItem._id, updatedItem.quantity);
      
      // If your cart service has a method to update the entire item
      // including notes, you would call that here instead
  //   }
  // };
  
  // const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div
        className="flex py-4 border-b cursor-pointer"
        // onClick={() => setIsModalOpen(true)}
      >
        <img
          src={imageUrl || '/api/placeholder/150/150'} // Using placeholder API instead of direct URL
          alt={name}
          className="w-16 h-16 rounded object-cover mr-4"
        />
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          {item.notes && (
            <p className="text-sm text-gray-500 mt-1">Note: {item.notes}</p>
          )}
          <p className="mt-1">LKR {unitPrice.toFixed(2)}</p>
          <div className="mt-2 flex items-center justify-between">
            <QuantityControl
              quantity={quantity}
              onIncrement={() => handleUpdateQty(_id, quantity + 1)}
              onDecrement={() => quantity > 1 && handleUpdateQty(_id, quantity - 1)}
            />
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent opening modal when clicking remove
                handleRemove(_id);
              }}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      {/* Food Item Modal */}
      {/* {isModalOpen && (
        <FoodItemModal
          item={item}
          onClose={closeModal}
          onUpdate={handleUpdateItem}
          onRemove={handleRemove}
        />
      )} */}
    </>
  );
};

export default CartItemComponent;