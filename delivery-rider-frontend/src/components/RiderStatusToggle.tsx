import { FC } from 'react';
import toast from 'react-hot-toast';

interface RiderStatusToggleProps {
  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  hasActiveDeliveries: boolean;
}

const RiderStatusToggle: FC<RiderStatusToggleProps> = ({ isOnline, setIsOnline, hasActiveDeliveries }) => {
  const handleToggle = () => {
    if (!isOnline) {
      setIsOnline(true);
      toast.success('You are now Online');
    } else {
      if (hasActiveDeliveries) {
        toast.error('You have active deliveries! Complete them before going offline.');
        return;
      }
      setIsOnline(false);
      toast.success('You are now Offline');
    }
  };

  // When rider has active deliveries, hide Go Offline button
  if (isOnline && hasActiveDeliveries) {
    return null;
  }

  return (
    <div className="flex justify-center my-4">
      <button
        onClick={handleToggle}
        className={`px-4 py-2 rounded-full font-semibold text-sm transition
          ${isOnline ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
      >
        {isOnline ? 'Go Offline' : 'Go Online'}
      </button>
    </div>
  );
};

export default RiderStatusToggle;
