import { Fab } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import { useEffect, useState } from 'react';
import { Delivery } from '../types/delivery';
import toast from 'react-hot-toast';

interface NavigateButtonProps {
  currentPosition: { lat: number; lng: number } | null;
  deliveries: Delivery[];
}

const NavigateButton: React.FC<NavigateButtonProps> = ({ currentPosition, deliveries }) => {
  const [navigateUrl, setNavigateUrl] = useState<string | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const findDestination = async () => {
      if (!currentPosition || deliveries.length === 0) {
        setNavigateUrl(null);
        return;
      }

      const outForDelivery = deliveries.find((d) => d.status === 'OUT_FOR_DELIVERY');
      if (outForDelivery) {
        const destLat = outForDelivery.location.lat;
        const destLng = outForDelivery.location.lng;
        setNavigateUrl(
            `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.lat},${currentPosition.lng}&destination=${destLat},${destLng}&travelmode=driving`
          );
        return;
      }

      const assigned = deliveries.find((d) => d.status === 'ASSIGNED');
      if (assigned) {
        const restLat = assigned.resLocation.lat;
        const restLng = assigned.resLocation.lng;

        setNavigateUrl(
            `https://www.google.com/maps/dir/?api=1&origin=${currentPosition.lat},${currentPosition.lng}&destination=${restLat},${restLng}&travelmode=driving`
          );
        return;

      } else {
        setNavigateUrl(null);
      }
    };

    findDestination();
  }, [currentPosition, deliveries]);

  if (!navigateUrl) return null; // Do not show button if no navigation available

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
      <Fab
        variant="extended"
        color="primary"
        className={`${isPulsing ? 'animate-pulse-once' : ''}`}
        onClick={() => {
            setIsPulsing(true);
            toast.success('Opening Google Maps...');
            setTimeout(() => {
            window.open(navigateUrl!, '_blank');
            setIsPulsing(false);
            }, 500);
        }}
        >
        <NavigationIcon sx={{ mr: 1 }} />
        Navigate
        </Fab>
    </div>
  );
};

export default NavigateButton;
