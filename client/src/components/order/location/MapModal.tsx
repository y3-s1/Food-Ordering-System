// src/components/order/MapModal.tsx

import { MapPicker } from "./MapPicker";


export interface MapModalProps {
  isOpen: boolean;
  position: { lat: number; lng: number };
  onChange: (pos: { lat: number; lng: number }) => void;
  onClose: () => void;
}

export function MapModal({ isOpen, position, onChange, onClose }: MapModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
        <h3 className="text-lg font-semibold mb-4">Select delivery location</h3>
        <MapPicker position={position} onChange={onChange} />
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
