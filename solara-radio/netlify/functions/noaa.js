const JSON_HEADERS = { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120' };

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`NOAA HTTP ${response.status}`);
  return response.json();
}

async function getText(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`NOAA HTTP ${response.status}`);
  return response.text();
}

function numeric(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function scale(value, prefix) {
  const number = numeric(value);
  return number === null ? null : `${prefix}${number}`;
}

exports.handler = async function () {
  const result = { gScale: null, sScale: null, rScale: null, kp: null, ap: null, sfi: null, time: null, warnings: [] };
  const settled = await Promise.allSettled([
    getJson('https://services.swpc.noaa.gov/products/noaa-scales.json'),
    getJson('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'),
    getText('https://services.swpc.noaa.gov/text/daily-solar-indices.txt'),
  ]);

  if (settled[0].status === 'fulfilled') {
    const data = settled[0].value;
    // NOAA uses a key "0" for the current observed scales; avoid relying on object insertion order.
    const current = data?.['0'];
    if (current?.G && current?.S && current?.R) {
      result.gScale = scale(current.G.Scale, 'G');
      result.sScale = scale(current.S.Scale, 'S');
      result.rScale = scale(current.R.Scale, 'R');
      result.time = [current.DateStamp, current.TimeStamp].filter(Boolean).join(' ') || null;
    } else result.warnings.push('NOAA scale data format unavailable');
  } else result.warnings.push('NOAA storm scales unavailable');

  if (settled[1].status === 'fulfilled') {
    const rows = settled[1].value;
    const latest = Array.isArray(rows) ? [...rows].reverse().find(row => numeric(row?.kp_index) !== null) : null;
    if (latest) {
      result.kp = numeric(latest.kp_index);
      if (!result.time) result.time = latest.time_tag ?? null;
    } else result.warnings.push('Kp data unavailable');
  } else result.warnings.push('Kp data unavailable');

  if (settled[2].status === 'fulfilled') {
    const lines = settled[2].value.split(/\r?\n/);
    const row = [...lines].reverse().find(line => /^\s*\d{4}\s+\d{1,2}\s+\d{1,2}\s+/.test(line));
    if (row) {
      const parts = row.trim().split(/\s+/);
      // Preserve the original source column mapping; validate against the live NOAA format.
      result.sfi = numeric(parts[3]);
      result.ap = numeric(parts[5]);
    } else result.warnings.push('Daily solar indices format unavailable');
  } else result.warnings.push('Daily solar indices unavailable');

  const hasData = [result.gScale, result.sScale, result.rScale, result.kp, result.ap, result.sfi].some(value => value !== null);
  return {
    statusCode: hasData ? 200 : 503,
    headers: JSON_HEADERS,
    body: JSON.stringify(hasData ? result : { error: 'NOAA data temporarily unavailable', warnings: result.warnings }),
  };
};
