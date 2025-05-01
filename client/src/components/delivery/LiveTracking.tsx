import { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { deliveryApi } from '../../api/axiosInstances';

interface Location {
  lat: number;
  lng: number;
}

interface TrackingData {
  status: string;
  driverLocation: Location;
  deliveryLocation: Location;
  restaurantLocation: Location;
  deliveryAddress: string;
  estimatedTime?: string;
}

const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [35, 35],
  iconAnchor: [15, 30],
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3177/3177361.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const LiveTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchTrackingData = async () => {
    try {
      const res = await deliveryApi.get(`/live-tracking/${orderId}`);
      setTrackingData(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tracking info:', err);
      setError('Tracking info not available at the moment.');
    }
  };

  useEffect(() => {
    fetchTrackingData(); // initial fetch

    const interval = setInterval(fetchTrackingData, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  if (!trackingData) {
    return <p className="text-center mt-10">Loading tracking info...</p>;
  }

  const { driverLocation, deliveryLocation, restaurantLocation, deliveryAddress, estimatedTime, status } = trackingData;

  return (
    <div className=' bg-gray-100'>
      <div className="text-left ml-15 pt-5">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded shadow"
        >
          ← Back
        </button>
      </div>
      <div className="max-w-6xl mx-auto p-6 pt-0">

        <h1 className="text-xl font-bold mb-4 text-center text-blue-800"> Live Tracking</h1>

        <div className="w-full h-[60vh] rounded-lg shadow overflow-hidden">
          <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={10} scrollWheelZoom={true} className="h-full w-full">
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[driverLocation.lat, driverLocation.lng]} icon={riderIcon}>
              <Popup>Rider</Popup>
            </Marker>

            <Marker position={[deliveryLocation.lat, deliveryLocation.lng]} icon={deliveryIcon}>
              <Popup>Delivery Destination</Popup>
            </Marker>

            <Marker position={[restaurantLocation.lat, restaurantLocation.lng]} icon={restaurantIcon}>
              <Popup>Restaurant</Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="mt-4 text-center text-gray-700">
          <p><b>Status:</b> {status}</p>
          <p><b>Delivery Address:</b> {deliveryAddress}</p>
          {estimatedTime && <p><b>ETA:</b> {new Date(estimatedTime).toLocaleTimeString()}</p>}
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
