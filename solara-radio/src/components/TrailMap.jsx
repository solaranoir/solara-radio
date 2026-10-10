import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';

export default function TrailMap({ trail, park }) {
  const center = useMemo(() => ({
    lat: parseFloat(park.latitude),
    lon: parseFloat(park.longitude)
  }), [park]);

  const coordinates = useMemo(() => {
    // Convert Overpass trail geometry to [lat, lon] pairs
    const nodes = trail.geometry || [];
    return nodes.map(node => [node.lat, node.lon]);
  }, [trail]);

  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '500px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[center.lat, center.lon]}>
        <Popup>{park.name}</Popup>
      </Marker>

      {coordinates.length > 0 && (
        <Polyline
          positions={coordinates}
          pathOptions={{ color: '#EC935E', weight: 4 }} // coffee-colored trail
        />
      )}
    </MapContainer>
  );
}

