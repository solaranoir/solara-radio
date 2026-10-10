import { createContext, useContext, useEffect, useState } from 'react';

const GeolocationContext = createContext(null);

export function GeolocationProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setLocation(null);
      setError(null);
      return;
    }
    let active = true;
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!active) return;
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setError(null);
      },
      (err) => {
        if (!active) return;
        setLocation(null);
        setError(err.message);
      },
      { timeout: 12000, maximumAge: 300000 }
    );
    return () => { active = false; };
  }, [enabled]);

  return (
    <GeolocationContext.Provider value={{ location, enabled, error, setEnabled }}>
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (!context) throw new Error('useGeolocation must be used within GeolocationProvider');
  return context;
}

export { GeolocationContext };
