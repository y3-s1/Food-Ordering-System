// src/components/MapPicker.tsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent, LeafletEvent, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
  position: { lat: number; lng: number };
  onChange: (pos: { lat: number; lng: number }) => void;
}

function ClickHandler({ onChange }: Pick<MapPickerProps, 'onChange'>) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });
  return null;
}

export function MapPicker({ position, onChange }: MapPickerProps) {
  return (
    <MapContainer
      center={[position.lat, position.lng]  as LatLngExpression}
      zoom={13}
      style={{ height: 300, width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[position.lat, position.lng]  as LatLngExpression}
        draggable={true}
        eventHandlers={{
          dragend(e: LeafletEvent) {
            const { lat, lng } = e.target.getLatLng();
            onChange({ lat, lng });
          }
        }}
      />
      <ClickHandler onChange={onChange} />
    </MapContainer>
  );
}
