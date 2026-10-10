// Create React App: configure REACT_APP_API_BASE_URL in Netlify or .env.
export const API_BASE_URL = (
  process.env.REACT_APP_API_BASE_URL || 'https://solara-station.onrender.com'
).replace(/\/$/, '');
