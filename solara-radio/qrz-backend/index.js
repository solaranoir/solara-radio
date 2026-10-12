const express = require('express');
const axios = require('axios');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');
const csv = require('csv-parser');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

// ===== Spotify Setup ======
let spotifyToken = null;
let tokenExpiresAt = 0;

async function getSpotifyToken() {
  const now = Date.now();
  if (spotifyToken && now < tokenExpiresAt) return spotifyToken;

  const authOptions = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    data: 'grant_type=client_credentials',
  };

  const response = await axios(authOptions);
  spotifyToken = response.data.access_token;
  tokenExpiresAt = now + response.data.expires_in * 1000 - 60000; // refresh 1 min early
  return spotifyToken;
}

// ===== QRZ Session Setup =====
let sessionKey = null;

async function getSessionKey() {
  const url = `https://xmldata.qrz.com/xml/current/?username=${process.env.QRZ_USERNAME};password=${process.env.QRZ_PASSWORD}`;
  const response = await axios.get(url);
  const match = response.data.match(/<Key>(.*?)<\/Key>/);
  sessionKey = match ? match[1] : null;
}
async function fetchCallsignData(callsign) {
  if (!sessionKey) await getSessionKey();

  let url = `https://xmldata.qrz.com/xml/current/?s=${sessionKey};callsign=${callsign}`;
  let response = await axios.get(url);
  let data = await parseStringPromise(response.data);

  // Check for session error and retry
  if (data.QRZDatabase?.Session?.[0]?.Error?.[0] === 'Invalid session key') {
    console.log("Session expired. Getting new session key...");
    await getSessionKey(); // refresh session
    url = `https://xmldata.qrz.com/xml/current/?s=${sessionKey};callsign=${callsign}`;
    response = await axios.get(url);
    data = await parseStringPromise(response.data);
    console.log("Raw QRZ response (after re-auth):", response.data);
  }

  return data;
}

app.get('/api/recent-logbook', async (req, res) => {
  try {
    // Re-authenticate if session is missing or expired
    if (!sessionKey) await getSessionKey();

    // Build logbook query URL (replace with your actual QRZ callsign)
    const logbookUrl = `https://xmldata.qrz.com/xml/current/?s=${sessionKey};search=KK7QEA`;

    const response = await axios.get(logbookUrl);

    console.log('🔍 Raw QRZ Logbook XML Response:\n', response.data);
    const jsonData = await parseStringPromise(response.data);

    // Check for session errors (session expired, etc.)
    const sessionError = jsonData?.QRZDatabase?.Session?.[0]?.Error?.[0];
    if (sessionError && sessionError.includes("Invalid session key")) {
      console.log("Session expired. Getting new session key...");
      await getSessionKey(); // Refresh session
      return res.redirect('/api/recent-logbook'); // Retry once
    }

    const logbook = jsonData?.QRZDatabase?.Callsign || [];

    const recentContacts = logbook.slice(0, 5).map(entry => ({
      callsign: entry.call?.[0] || 'Unknown',
      frequency: entry.freq?.[0] || 'Unknown',
      mode: entry.mode?.[0] || 'Unknown',
      datetime: `${entry.qso_date?.[0] || ''} ${entry.time_on?.[0] || ''}`,
      country: entry.country?.[0] || 'Unknown',
      state: entry.state?.[0] || ''
    }));

    res.json(recentContacts);
  } catch (error) {
    console.error('Error fetching QRZ logbook:', error.message);
    res.status(500).json({ error: 'Failed to fetch QRZ logbook' });
  }
});

app.get('/api/spotify-playlists', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.get(
      `https://api.spotify.com/v1/users/${process.env.SPOTIFY_USER_ID}/playlists?limit=50`,
      { headers }
    );

    const playlists = response.data.items
      .filter((p) => p.name.startsWith("SCM:"))
      .map((p) => ({
        name: p.name,
        id: p.id,
        uri: p.uri,
      }));

    res.json(playlists);
  } catch (error) {
    console.error('Error fetching Spotify playlists:', error.message);
    res.status(500).json({ error: 'Failed to fetch Spotify playlists' });
  }
});

// ===== Middleware: Upload Secret Protection =====
function verifyUploadSecret(req, res, next) {
  const clientSecret = req.headers['x-upload-secret'];
  if (clientSecret !== process.env.UPLOAD_SECRET) {
    return res.status(403).json({ error: 'Forbidden: Invalid upload secret.' });
  }
  next();
}

// ===== Callsign Lookup (QRZ XML) =====
app.get('/api/lookup/:callsign', async (req, res) => {
  try {
    const { callsign } = req.params;
    const data = await fetchCallsignData(callsign);
    const callsignData = data.QRZDatabase.Callsign?.[0] || {};

    res.json({
      callsign: callsignData.call?.[0] || callsign,
      country: callsignData.country?.[0] || 'Unknown',
      state: callsignData.state?.[0] || '',
      dxcc: callsignData.dxcc?.[0] || '',
      grid: callsignData.grid?.[0] || '',
      name: callsignData.fname?.[0] || '',
      qth: callsignData.qth?.[0] || '',
    });
  } catch (error) {
    console.error('Error fetching QRZ data:', error.message);
    res.status(500).json({ error: 'Failed to fetch QRZ data' });
  }
});

// ===== File Upload Setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads'),
  filename: (req, file, cb) => cb(null, 'logbook.adi'),
});
const upload = multer({ storage });

// ===== Upload Logbook (ADIF) =====
app.post('/api/upload-logbook', verifyUploadSecret, upload.single('logbook'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
  res.json({ message: 'Logbook uploaded successfully.' });
});

// ===== Serve Uploaded Files =====
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== ADIF File Parsing + QRZ Lookup (Optional Integration) =====
app.get('/api/recent-contacts', async (req, res) => {
  try {
    const adifPath = path.join(__dirname, 'uploads', 'logbook.adi');
    const file = fs.readFileSync(adifPath, 'utf8');
    const records = [];

    const adifContacts = file.split('<eor>').slice(0, 10);
    for (let entry of adifContacts) {
      const record = {};
      const matches = entry.match(/<([^:]+):(\d+)>([^<]*)/g);
      if (matches) {
        matches.forEach(match => {
          const parts = match.match(/<([^:]+):(\d+)>([^<]*)/);
          if (parts) {
            record[parts[1].toLowerCase()] = parts[3];
          }
        });
      }

      // QRZ lookup
      if (record.call) {
        try {
          if (!sessionKey) await getSessionKey();
          const url = `https://xmldata.qrz.com/xml/current/?s=${sessionKey};callsign=${record.call}`;
          const response = await axios.get(url);
          const jsonData = await parseStringPromise(response.data);
          const callInfo = jsonData.QRZDatabase.Callsign?.[0] || {};

          records.push({
            callsign: record.call,
            frequency: record.freq,
            mode: record.mode,
            datetime: record.qso_date + ' ' + record.time_on,
            country: callInfo.country?.[0] || 'Unknown',
            state: callInfo.state?.[0] || '',
          });
        } catch (err) {
          records.push({
            callsign: record.call,
            frequency: record.freq,
            mode: record.mode,
            datetime: record.qso_date + ' ' + record.time_on,
            country: 'Lookup failed',
            state: '',
          });
        }
      }
    }

    res.json(records);
  } catch (error) {
    console.error('Error parsing ADIF:', error.message);
    res.status(500).json({ error: 'Failed to parse logbook' });
  }
});

// Serve parks from CSV
app.get('/api/parks', (req, res) => {
  const { state } = req.query;
  const results = [];

  fs.createReadStream(path.join(__dirname, 'all_parks_ext.csv'))
    .pipe(csv())
    .on('data', (data) => {
      // Only return parks in the specified state (if provided)
      // Filter by "US-XX" if a state is provided
      if (!state || data.locationDesc === `US-${state}`) {
        results.push(data);
      }
    })
    .on('end', () => {
      res.json(results);
    })
    .on('error', (error) => {
      console.error('Error reading all_parks_ext.csv:', error);
      res.status(500).json({ error: 'Failed to load parks data.' });
    });
});

// ===== Live POTA spots proxy =====
// Configure POTA_SPOTS_URL with a verified upstream JSON feed URL.
// Do not expose upstream credentials or assume an undocumented API path.
const SPOTS_CACHE_MS = 60 * 1000;
let spotsCache = { expires: 0, items: [] };

app.get('/api/pota/spots', async (req, res) => {
  const upstream = process.env.POTA_SPOTS_URL;
  if (!upstream) {
    return res.status(503).json({ error: 'Live POTA spot feed is not configured.' });
  }

  try {
    const parsed = new URL(upstream);
    if (parsed.protocol !== 'https:') {
      return res.status(503).json({ error: 'POTA spot feed must use HTTPS.' });
    }
    if (Date.now() < spotsCache.expires) {
      return res.json({ spots: spotsCache.items });
    }

    const response = await axios.get(parsed.toString(), {
      timeout: 10000,
      headers: { Accept: 'application/json' },
      maxContentLength: 5 * 1024 * 1024,
    });
    const payload = response.data;
    const records = Array.isArray(payload) ? payload : payload?.spots;
    if (!Array.isArray(records)) throw new Error('Unexpected spot feed response shape');

    const spots = records.slice(0, 2000).map((item) => ({
      callsign: item.callsign ?? item.activator ?? item.activatorCallsign ?? null,
      reference: item.reference ?? item.parkReference ?? item.park ?? null,
      parkName: item.parkName ?? item.name ?? null,
      frequency: item.frequency ?? null,
      mode: item.mode ?? null,
      spotTime: item.spotTime ?? item.time ?? item.timestamp ?? item.createdAt ?? null,
      latitude: item.latitude ?? null,
      longitude: item.longitude ?? null,
    }));
    spotsCache = { items: spots, expires: Date.now() + SPOTS_CACHE_MS };
    return res.json({ spots });
  } catch (error) {
    console.error('POTA spots proxy error:', error.message);
    return res.status(502).json({ error: 'Live POTA spots are temporarily unavailable.' });
  }
});

// ===== Nearest Park from all_parks_ext.csv =====
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const toRad = (deg) => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

let parkDataCache = null;

function loadParksFromCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'all_parks_ext.csv'))
      .pipe(csv())
      .on('data', (data) => {
        if (data.latitude && data.longitude) {
          results.push({
            reference: data.reference,
            name: data.name,
            state: data.locationDesc?.replace('US-', '') || '',
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

app.get('/api/nearest-park', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon)) || Number(lat) < -90 || Number(lat) > 90 || Number(lon) < -180 || Number(lon) > 180) {
    return res.status(400).json({ error: 'Invalid latitude or longitude' });
  }

  try {
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);

    // Lazy-load park data
    if (!parkDataCache) {
      parkDataCache = await loadParksFromCSV(); // Should return array of parks with lat/lon
    }

    let nearest = null;
    let minDistance = Infinity;

    for (const park of parkDataCache) {
      const dist = haversineDistance(userLat, userLon, park.latitude, park.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = park;
      }
    }

    if (nearest) {
      // ✅ Ensure response includes lat/lon
      res.json({
        reference: nearest.reference,
        name: nearest.name,
        state: nearest.state,
        latitude: nearest.latitude,
        longitude: nearest.longitude,
      });
    } else {
      res.status(404).json({ error: 'No parks found nearby' });
    }
  } catch (err) {
    console.error('Error finding nearest park:', err.message);
    res.status(500).json({ error: 'Failed to locate nearest park' });
  }
});

app.get('/api/satellite-passes', async (req, res) => {
  const { lat, lon, noradId = 25544 } = req.query;
  const apiKey = process.env.N2YO_API_KEY;

  if (!lat || !lon || !apiKey) {
    return res.status(400).json({ error: 'Missing parameters or API key' });
  }

  const url = `https://api.n2yo.com/rest/v1/satellite/radiopasses/${noradId}/${lat}/${lon}/0/2/60?apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching from N2YO:', err);
    res.status(500).json({ error: 'Failed to fetch satellite data' });
  }
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`QRZ backend running on port ${PORT}`);
});

