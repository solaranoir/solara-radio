import { useEffect, useState } from 'react';
export default function TimeAndDateWidget() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(timer); }, []);
  return <div className="sidebar-widget solara-clock"><h3 className="sidebar-heading">Local & UTC Time</h3><div className="solara-clock__times"><div><span>Browser local time</span><strong>{now.toLocaleString()}</strong></div><div><span>UTC</span><strong>{now.toLocaleString('en-US', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium', hour12: false })}</strong></div></div><p className="solara-tool-note">Time conversion works without location permission.</p></div>;
}
