import { useState, useEffect } from 'react';
import { toLatLon, toMaiden } from 'maidenhead';
import { useGeolocation } from '../context/GeolocationProvider';

export default function LocalPlantsWidget() {
  const { location, enabled, error: geoError } = useGeolocation();
  const [gridSquare, setGridSquare] = useState('');
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const plantsPerPage = 5;

  useEffect(() => {
    if (
      enabled &&
      location &&
      typeof location.latitude === 'number' &&
      typeof location.longitude === 'number'
    ) {
      const { latitude, longitude } = location;
      try {
        const grid = toMaiden(latitude, longitude);
        setGridSquare(grid);
        fetchPlants(latitude, longitude);
      } catch (e) {
        console.error('Error generating Maidenhead grid:', e);
      }
    }
  }, [enabled, location]);

  const fetchPlants = async (lat, lon) => {
    if (
      typeof lat !== 'number' ||
      typeof lon !== 'number' ||
      isNaN(lat) ||
      isNaN(lon)
    ) {
      console.error('Invalid lat/lon values:', lat, lon);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.inaturalist.org/v1/observations?lat=${lat}&lng=${lon}&radius=10&taxon_id=47126&per_page=50`
      );
      const data = await response.json();

      const plantMap = new Map();
      data.results.forEach(item => {
        if (item.taxon?.preferred_common_name && item.taxon?.default_photo) {
          plantMap.set(item.taxon.id, {
            id: item.taxon.id,
            name: item.taxon.preferred_common_name,
            photoUrl: item.taxon.default_photo.medium_url || item.taxon.default_photo.url,
          });
        }
      });

      setPlants(Array.from(plantMap.values()));
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching plant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchFromGrid = () => {
    if (!gridSquare) return;
    try {
      const [lat, lon] = toLatLon(gridSquare.toUpperCase());
      fetchPlants(lat, lon);
    } catch (e) {
      console.error('Invalid grid square:', e);
    }
  };

  const indexOfLastPlant = currentPage * plantsPerPage;
  const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
  const currentPlants = plants.slice(indexOfFirstPlant, indexOfLastPlant);
  const totalPages = Math.ceil(plants.length / plantsPerPage);

  return (
    <div className="solara-widget !min-h-0 !max-h-none !overflow-visible">
      <h3 className="widget-heading">Local Plants</h3>

      <input
        type="text"
        placeholder="Enter Grid Square (e.g. DM13)"
        value={gridSquare}
        onChange={(e) => setGridSquare(e.target.value)}
        className="mb-2 p-2 rounded w-full bg-tan text-gunmetal placeholder-gunmetal"
      />

      <div className="flex gap-4 mb-4">
        <button
          onClick={handleFetchFromGrid}
          className="px-4 py-2 bg-persian-orange text-gunmetal rounded-lg hover:bg-amber-400"
        >
          Use Grid Square
        </button>
      </div>

      {enabled && !location && (
        <p className="text-tan text-sm">Locating…</p>
      )}

      {geoError && (
        <p className="text-persian-orange text-sm">Location error: {geoError}</p>
      )}

      {loading && <p className="font-sans text-tan">Loading plants…</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {currentPlants.length > 0 ? currentPlants.map((plant) => (
          <div key={plant.id} className="bg-sage p-2 rounded-lg shadow-md flex flex-col items-center">
            <img
              src={plant.photoUrl}
              alt={plant.name}
              className="w-full h-40 object-cover rounded mb-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/fallback-plant.jpg'; // Optional: fallback image
              }}
            />
            <p className="font-sans text-gunmetal text-center">{plant.name}</p>
          </div>
        )) : !loading && (
          <p className="font-sans text-tan">No plants found for this location.</p>
        )}
      </div>

      {plants.length > plantsPerPage && (
        <div className="flex justify-center space-x-4 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-persian-orange text-gunmetal rounded-lg hover:bg-amber-400 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-persian-orange text-gunmetal rounded-lg hover:bg-amber-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

