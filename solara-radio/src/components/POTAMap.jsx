import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';

function validPoint(item) {
  const lat = Number(item?.latitude ?? item?.lat);
  const lon = Number(item?.longitude ?? item?.lon ?? item?.lng);
  return item && item.latitude !== null && item.longitude !== null && Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
}
function Focus({ selected }) {
  const map = useMap();
  useEffect(() => {
    if (validPoint(selected)) map.flyTo([Number(selected.latitude ?? selected.lat), Number(selected.longitude ?? selected.lon ?? selected.lng)], 10, { duration: .6 });
  }, [map, selected]);
  return null;
}
export default function POTAMap({ parks = [], spots = [], selected, onSelect }) {
  const markers = [
    ...parks.filter(validPoint).map(p => ({ ...p, kind: 'park' })),
    ...spots.filter(validPoint).map(s => ({ ...s, kind: 'spot' }))
  ].slice(0, 350);
  return (
    <div className="pota-map-frame" aria-label="POTA park and spot map">
      <MapContainer center={[39.5, -98.35]} zoom={4} scrollWheelZoom={false} className="pota-leaflet-map">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Focus selected={selected} />
        {markers.map((item, index) => (
          <CircleMarker key={`${item.kind}-${item.reference || item.parkReference || index}-${index}`}
            center={[Number(item.latitude ?? item.lat), Number(item.longitude ?? item.lon ?? item.lng)]}
            radius={item.kind === 'spot' ? 9 : 6}
            pathOptions={{ color: item.kind === 'spot' ? '#EC935E' : '#A3B68D', fillColor: item.kind === 'spot' ? '#EC935E' : '#24666D', fillOpacity: .85, weight: 2 }}
            eventHandlers={{ click: () => onSelect?.(item) }}>
            <Popup><strong>{item.name || item.parkName || item.reference || 'POTA location'}</strong><br />{item.reference || item.parkReference || ''}{item.callsign ? <><br />{item.callsign}</> : null}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="pota-map-legend"><span>● Parks</span><span>● Live spots with coordinates</span></div>
    </div>
  );
}
