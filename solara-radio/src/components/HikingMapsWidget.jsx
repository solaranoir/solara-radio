import { API_BASE_URL } from '../config/api';
import { useState, useEffect } from 'react';
import { FiCompass } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { GiHiking } from 'react-icons/gi';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaMapMarkedAlt } from 'react-icons/fa';

import Modal from './Modal';
import TrailMap from './TrailMap';

export default function HikingMapsWidget() {
  const [states] = useState([
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]);
  const [selectedState, setSelectedState] = useState('');
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [trails, setTrails] = useState([]);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [nearbyPark, setNearbyPark] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // 🔁 Fetch trails
  const fetchNearbyTrails = async (lat, lon) => {
    const query = `
      [out:json];
      (
        way["highway"="path"](around:5000,${lat},${lon});
        relation["highway"="path"](around:5000,${lat},${lon});
      );
      out body geom;
      >;
      out skel qt;
    `;

    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: 'POST',
        body: query,
      });
      const data = await response.json();
      setTrails(data.elements || []);
    } catch (error) {
      console.error('Error fetching trails:', error);
    }
  };

  // 📍 Geolocation logic
  useEffect(() => {
    if (!useCurrentLocation || !navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(5);
        const lon = position.coords.longitude.toFixed(5);
        setUserCoords({ lat, lon });

        try {
          const res = await fetch(`${API_BASE_URL}/api/nearest-park?lat=${lat}&lon=${lon}`);
          const data = await res.json();

          if (data && data.reference && data.state && data.latitude && data.longitude) {
            setNearbyPark(data);                     // ✅ for display
            setSelectedState(data.state);            // ✅ optional, for future use
            setSelectedPark(data);                   // ✅ required to display info
            fetchNearbyTrails(data.latitude, data.longitude);  // ✅ display trails
          }
        } catch (err) {
          console.error('Error fetching nearby POTA site:', err);
        }
      },
      (err) => console.warn('Geolocation denied or failed:', err),
      { enableHighAccuracy: true }
    );
  }, [useCurrentLocation]);


  // 🌎 Manual state-based park list
  useEffect(() => {
    if (!selectedState || useCurrentLocation) return;

    async function fetchParks() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/parks?state=${selectedState}`);
        const data = await response.json();
        setParks(data);

        if (!nearbyPark || nearbyPark.state !== selectedState) {
          setSelectedPark(null);
          setTrails([]);
        }
      } catch (error) {
        console.error('Error fetching parks:', error);
      }
    }

    fetchParks();
  }, [selectedState, useCurrentLocation, nearbyPark]);

  // 🥾 Trail fetch fallback for manually selected park
  useEffect(() => {
    if (!selectedPark || !selectedPark.latitude || !selectedPark.longitude) return;
    fetchNearbyTrails(selectedPark.latitude, selectedPark.longitude);
  }, [selectedPark]);

  return (
    <div className="solara-widget !min-h-0 !max-h-none !overflow-visible">
      <h2 className="widget-heading flex items-center gap-2">
        <FiCompass size={18} className="text-[#A3B68D]" />
        Hiking Trails near POTA spots
      </h2>

      {/* 🔘 Checkbox */}
      <label className="block mb-4 text-tan text-sm flex items-center gap-2">
        <HiOutlineLocationMarker size={18} className="text-[#A3B68D]" />
        <input
          type="checkbox"
          checked={useCurrentLocation}
          onChange={(e) => {
            setUseCurrentLocation(e.target.checked);
            if (!e.target.checked) {
              setNearbyPark(null);
              setSelectedPark(null);
              setSelectedState('');
              setUserCoords(null);
              setParks([]);
              setTrails([]);
            }
          }}
          className="mr-2"
        />
        Use my current location
      </label>

      {/* 📍 Geolocated Park Display */}
      {useCurrentLocation && nearbyPark && (
        <div className="p-2 mb-4 rounded bg-tan text-gunmetal shadow-md">
          <p className="font-semibold text-sm flex items-center gap-1">
            <AiOutlineInfoCircle size={18} className="text-[#A3B68D]" />
            Your current POTA location is:
          </p>
          <p className="text-md font-heading text-coffee font-semibold">
            {nearbyPark.name} ({nearbyPark.reference})
            {userCoords && (
              <span className="ml-2 text-xs text-coffee">
                ({userCoords.lat}, {userCoords.lon})
              </span>
            )}
          </p>
        </div>
      )}

      {/* 🗂️ State Dropdown */}
      {!useCurrentLocation && (
        <select
          onChange={(e) => setSelectedState(e.target.value)}
          value={selectedState}
          className="mb-4 p-2 rounded w-full bg-tan text-gunmetal"
        >
          <option value="">Select a State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      )}

      {/* 🏞️ Park Dropdown */}
      {!useCurrentLocation && parks.length > 0 && (
        <select
          onChange={(e) => {
            const park = parks.find(p => p.reference === e.target.value);
            setSelectedPark(park);
          }}
          value={selectedPark?.reference || ''}
          className="mb-4 p-2 rounded w-full bg-tan text-gunmetal"
        >
          <option value="">Select a POTA Site</option>
          {parks.map((park) => (
            <option key={park.reference} value={park.reference}>
              {park.name} ({park.reference})
            </option>
          ))}
        </select>
      )}

      {/* 🧭 Park Info */}
      {selectedPark && (
        <div className="font-sans text-tan mb-4">
          <p>Selected Park: {selectedPark.name}</p>
          <p>Coordinates: {selectedPark.latitude}, {selectedPark.longitude}</p>
        </div>
      )}

      {/* 🥾 Trail List */}
      {trails.length > 0 && (
        <div className="mt-4 font-sans text-coffee">
          <h3 className="text-xl font-heading mb-2 text-persian-orange flex items-center gap-2">
            <GiHiking size={18} className="text-[#A3B68D]" />
            Nearby Hiking Trails
          </h3>
          <ul className="list-disc list-inside text-sm space-y-1 bg-tan text-gunmetal">
            {trails.slice(0, 5).map((trail, index) => (
              <li key={index}>
                <button
                  onClick={() => setSelectedTrail(trail)}
                  className="text-coffee hover:text-persian-orange font-medium hover:underline"
                >
                  {trail.tags?.name || `Unnamed Trail (${trail.id})`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 🗺️ Trail Map Modal */}
      {selectedTrail && selectedPark?.latitude && selectedPark?.longitude && (
        <Modal onClose={() => setSelectedTrail(null)}>
          <div className="p-4 text-tan">
            <h2 className="text-2xl font-heading mb-2 text-persian-orange flex items-center gap-2">
              <FaMapMarkedAlt size={18} className="text-[#A3B68D]" />
              {selectedTrail.tags?.name || 'Trail Visualization'}
            </h2>
            <TrailMap trail={selectedTrail} park={selectedPark} />
            <p className="mt-2 text-sm">Visualizing trail area around park center.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

