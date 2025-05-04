
import { CreateOrderDTO } from '../../../types/order/order';

export interface AddressFormProps {
  address: CreateOrderDTO['deliveryAddress'];
  onChange: (addr: CreateOrderDTO['deliveryAddress']) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function AddressForm({ address, onChange, onSave, onCancel }: AddressFormProps) {
  return (
    <div className="space-y-4">
      {(['street', 'city', 'postalCode', 'country'] as const).map((field) => (
        <input
          key={field}
          type="text"
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={address[field]}
          onChange={(e) => onChange({ ...address, [field]: e.target.value })}
          className="block w-full border rounded p-2"
          required
        />
      ))}
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export interface AddressModalProps extends AddressFormProps {
  isOpen: boolean;
}

export function AddressModal({
  isOpen,
  address,
  onChange,
  onSave,
  onCancel,
}: AddressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>
        <AddressForm
          address={address}
          onChange={onChange}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
