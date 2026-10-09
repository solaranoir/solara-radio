import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Page from './pages/Page';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import './App.css';

export default function App() {
  return (
    <div className="App solara-app">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page" element={<Page />} />
      </Routes>
    </div>
  );
}
