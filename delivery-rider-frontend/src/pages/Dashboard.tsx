import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Delivery } from '../types/delivery';
import { getDeliveriesByDriver, updateDeliveryStatus } from '../api/delivery';
import { updateDriverLocation } from '../api/driver';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useRef } from 'react';
import { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import { calculateDistance } from '../utils/geo';
import NavigateButton from '../components/NavigateButton';
import RiderStatusToggle from '../components/RiderStatusToggle';


const Dashboard = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingDeliveryId, setUpdatingDeliveryId] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(15);
  const [distanceToDelivery, setDistanceToDelivery] = useState<number | null>(null);
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(true);

  const driverId = '6604e71234567890abcdefab'; // Temp

  const [confirmModal, setConfirmModal] = useState<{
    visible: boolean;
    deliveryId: string | null;
  }>(() => ({ visible: false, deliveryId: null }));

  const riderIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
  
  const deliveryIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177361.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });  



  const fetchData = useCallback(async () => {
    try {
      const data = await getDeliveriesByDriver(driverId);
      setDeliveries(data);
  
      const active = data.find((d) => d.status === 'OUT_FOR_DELIVERY');
      if (active) {
        setActiveDelivery(active);
        setZoomLevel(9);   // Zoom out when there is active delivery
      } else {
        setActiveDelivery(null);
        setZoomLevel(15);  // Normal zoom otherwise
      }
    } catch (error) {
      console.error('Failed to fetch deliveries', error);
    } finally {
      setLoading(false);
    }
  }, [driverId]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
  
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
        try {
          await updateDriverLocation(driverId, latitude, longitude);
          console.log('Location updated:', latitude, longitude);
        } catch (error) {
          console.error('Failed to update location', error);
        }
      },
      (error) => {
        setLocationError('Failed to get your location');
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      }
    );
  
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);


  useEffect(() => {
    if (mapRef.current && currentPosition) {
      mapRef.current.flyTo(
        [currentPosition.lat, currentPosition.lng],
        zoomLevel,
        {
          animate: true,
          duration: 1.5,
        }
      );
    }
  }, [zoomLevel, currentPosition]);


  useEffect(() => {
    if (currentPosition && activeDelivery?.location) {
      const distance = calculateDistance(
        currentPosition.lat,
        currentPosition.lng,
        activeDelivery.location.lat,
        activeDelivery.location.lng
      );
      setDistanceToDelivery(distance);
    } else {
      setDistanceToDelivery(null);
    }
  }, [currentPosition, activeDelivery]);
  
  


  const hasActiveDeliveries = deliveries.some(
    (d) => d.status === 'ASSIGNED' || d.status === 'OUT_FOR_DELIVERY'
  );

  const visibleDeliveries = isOnline
  ? deliveries
  : deliveries.filter((d) => d.status === 'DELIVERED');

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    if (newStatus === 'OUT_FOR_DELIVERY') {
      // Check if rider already has an active delivery
      const alreadyOutForDelivery = deliveries.some(
        (d) => d.status === 'OUT_FOR_DELIVERY'
      );
      if (alreadyOutForDelivery) {
        toast.error('You already have an active delivery. Complete it first.');
        return;
      }
    }
  
    setUpdatingDeliveryId(id);
    const toastId = toast.loading(
      newStatus === 'DELIVERED'
        ? 'Marking as Delivered...'
        : 'Starting Delivery...'
    );
    try {
      await updateDeliveryStatus(id, newStatus);
      
      await fetchData(); // Refresh dashboard
  
      toast.success(
        newStatus === 'DELIVERED'
          ? 'Delivered successfully!'
          : '🚚 Marked as Out for Delivery',
        { id: toastId }
      );
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update delivery status', { id: toastId });
    } finally {
      setUpdatingDeliveryId(null);
    }
  };
  
  

  if (loading) {
    return <p className="text-center mt-10">Loading deliveries...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
        🚚 Delivery Dashboard
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isOnline ? 'ONLINE' : 'OFFLINE'}
        </span>
      </h1>

      {locationError && (
        <div className="text-center text-red-600 font-semibold my-2">
          {locationError}
        </div>
      )}

      {/* RiderStatusToggle*/}
      <RiderStatusToggle
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        hasActiveDeliveries={hasActiveDeliveries}
      />

      {currentPosition && (
        <div className="h-64 w-full mb-6">
          <MapContainer
            center={[currentPosition.lat, currentPosition.lng]}
            zoom={zoomLevel}
            scrollWheelZoom={false}
            className="h-full w-full rounded-lg shadow"
            ref={(mapInstance: LeafletMap) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Rider Marker */}
            <Marker
              position={[currentPosition.lat, currentPosition.lng]}
              icon={riderIcon}
            >
              <Popup>🚴‍♂️ You (Rider)</Popup>
            </Marker>

            {/* Delivery Destination Marker */}
            {activeDelivery && activeDelivery.location && (
              <Marker
                position={[activeDelivery.location.lat, activeDelivery.location.lng]}
                icon={deliveryIcon}
              >
                <Popup>📦 Delivery Destination</Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      )}

      {distanceToDelivery !== null && (
        <div className="text-center text-gray-700 mb-4">
          📏 Distance to Delivery: <b>{distanceToDelivery.toFixed(2)} km</b>
        </div>
      )}

      <div className="grid gap-4 w-full">
        {visibleDeliveries.map((delivery) => (
          <div
            key={delivery._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col cursor-pointer hover:shadow-lg transition relative w-full"
            onClick={(e) => {
              if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') {
                navigate(`/delivery/${delivery._id}`);
              }
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-blue-700">
                  Delivery ID: 
                </span>
                <span className="text-xs font-medium text-blue-600">
                  {delivery._id}
                </span>
              </div>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  delivery.status === 'DELIVERED'
                    ? 'bg-green-200 text-green-800'
                    : delivery.status === 'OUT_FOR_DELIVERY'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {delivery.status}
              </span>
            </div>

            <p className="text-gray-600">📍 {delivery.deliveryAddress}</p>
            <p className="text-gray-500 mt-1 text-sm">
              ETA: {new Date(delivery.estimatedTime).toLocaleTimeString()}
            </p>

            <div className="mt-3 flex gap-2 transition-opacity duration-200">
              {delivery.status === 'ASSIGNED' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleStatusUpdate(delivery._id, 'OUT_FOR_DELIVERY');
                  }}
                  disabled={updatingDeliveryId === delivery._id}
                  className={`${
                    updatingDeliveryId === delivery._id ? 'opacity-50 cursor-not-allowed' : ''
                  } bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition`}
                >
                  {updatingDeliveryId === delivery._id ? 'Updating...' : 'Start Delivery'}
                </button>
              )}

              {delivery.status === 'OUT_FOR_DELIVERY' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    setConfirmModal({ visible: true, deliveryId: delivery._id });
                  }}
                  disabled={updatingDeliveryId === delivery._id}
                  className={`${
                    updatingDeliveryId === delivery._id
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  } bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition`}
                >
                  Mark Delivered
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {isOnline && <NavigateButton currentPosition={currentPosition} deliveries={deliveries} />}
        {confirmModal.visible && (
          <div className="fixed inset-0 backdrop-blur-xs bg-black/10 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-80 animate-fadeIn">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Confirm Delivery
              </h3>
              <p className="text-sm text-gray-600">
                Are you sure you want to mark this delivery as <b>Delivered</b>?
              </p>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setConfirmModal({ visible: false, deliveryId: null })}
                  className="px-3 py-1 rounded text-gray-700 border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (confirmModal.deliveryId) {
                      await handleStatusUpdate(
                        confirmModal.deliveryId,
                        'DELIVERED'
                      );
                      setConfirmModal({ visible: false, deliveryId: null });
                    }
                  }}
                  className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  Yes, Confirm
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
