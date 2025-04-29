import { FC, useState } from 'react';
import toast from 'react-hot-toast';
import { updateDriverAvailability } from '../api/driver';

interface RiderStatusToggleProps {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  hasActiveDeliveries: boolean;
  driverId: string;
}

const RiderStatusToggle: FC<RiderStatusToggleProps> = ({ isOnline, setIsOnline, hasActiveDeliveries, driverId }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (isOnline && hasActiveDeliveries) {
      toast.error('You have active deliveries! Complete them before going offline.');
      return;
    }

    try {
      setLoading(true);
      const newStatus = !isOnline;
      await updateDriverAvailability(driverId, newStatus);
      setIsOnline(newStatus);
      toast.success(`You are now ${newStatus ? 'Online' : 'Offline'}`);
    } catch (error) {
      console.error('Failed to update driver status:', error);
      toast.error('Failed to update your status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isOnline && hasActiveDeliveries) {
    return null; // Hide Go Offline button
  }

  return (
    <div className="flex justify-center z-10">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition shadow-lg
          ${isOnline ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} 
          text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
      </button>
    </div>
  );
};

export default RiderStatusToggle;