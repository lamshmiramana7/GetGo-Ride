import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Plane, ArrowLeft, ExternalLink, Check, Users, Plus, Trash2, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PRIVATE_BUS_CHARTERS } from '../data/mockData';
import { useLanguage } from '../App';

// ─── EXPANDED BUS CATALOGUE ─────────────────────────────────────────
const INTERCITY_BUSES = {
  ac: [
    { id: 'ib_001', operator: 'TNSTC Volvo A/C Sleeper', model: 'Volvo 9400 Multi-Axle', type: 'AC Sleeper', seats: 36, fare: 950, amenities: ['AC', 'Pushback Seats', 'USB Charging', 'Blanket', 'CCTV'], departureTime: '20:00', arrivalTime: '04:30', duration: '8h 30m', rating: 4.6, available: 14 },
    { id: 'ib_002', operator: 'KPN Travels A/C Sleeper', model: 'Scania Metrolink HD', type: 'AC Sleeper 2+1', seats: 27, fare: 1050, amenities: ['AC', '2+1 Berth', 'Reading Light', 'Pillow & Blanket', 'CCTV'], departureTime: '21:30', arrivalTime: '06:00', duration: '8h 30m', rating: 4.8, available: 9 },
    { id: 'ib_003', operator: 'SRS Travels Platinum', model: 'Volvo B11R Multi-Axle', type: 'AC Luxury Sleeper', seats: 30, fare: 1150, amenities: ['AC', 'Recliner Seats', 'Charging Port', 'Entertainment Screen', 'Washroom'], departureTime: '22:00', arrivalTime: '06:15', duration: '8h 15m', rating: 4.9, available: 6 },
    { id: 'ib_004', operator: 'Parveen Express Gold', model: 'Ashok Leyland Viking AC', type: 'AC Sleeper 2+2', seats: 40, fare: 820, amenities: ['AC', 'Reclining Seat', 'USB Charger', 'CCTV'], departureTime: '22:45', arrivalTime: '07:00', duration: '8h 15m', rating: 4.5, available: 18 },
    { id: 'ib_005', operator: 'Orange Travels Express', model: 'Mercedes-Benz OC500 AC', type: 'AC Semi-Sleeper', seats: 45, fare: 780, amenities: ['AC', 'Semi-Sleeper Seat', 'Mobile Charger', 'Water Bottle'], departureTime: '23:00', arrivalTime: '07:15', duration: '8h 15m', rating: 4.4, available: 21 },
    { id: 'ib_006', operator: 'VRL Travels Executive', model: 'Tata Starbus Ultra AC', type: 'AC Seater', seats: 50, fare: 650, amenities: ['AC', 'Pushback Seat', 'Charging Port'], departureTime: '06:00', arrivalTime: '14:00', duration: '8h 00m', rating: 4.3, available: 30 },
  ],
  nonac: [
    { id: 'ib_007', operator: 'TNSTC Express Super', model: 'Tata LP 1613 CNG', type: 'Non-AC Ordinary', seats: 55, fare: 320, amenities: ['Fan', 'Cushioned Seat', 'Luggage Space'], departureTime: '06:30', arrivalTime: '15:00', duration: '8h 30m', rating: 4.0, available: 40 },
    { id: 'ib_008', operator: 'Prasanna Purple Tours', model: 'Ashok Leyland Eagle LP', type: 'Non-AC Sleeper', seats: 36, fare: 480, amenities: ['Fan', 'Sleeper Berth', 'Mobile Charging'], departureTime: '21:00', arrivalTime: '05:30', duration: '8h 30m', rating: 4.1, available: 22 },
    { id: 'ib_009', operator: 'Raj National Express', model: 'Leyland Titan Euro4', type: 'Non-AC Seater', seats: 48, fare: 380, amenities: ['Fan', 'Push-back Seat', 'Luggage Rack'], departureTime: '07:00', arrivalTime: '15:30', duration: '8h 30m', rating: 3.9, available: 35 },
    { id: 'ib_010', operator: 'Chartered Speed Lines', model: 'TATA Marcopolo Non-AC', type: 'Non-AC Semi-Sleeper', seats: 42, fare: 420, amenities: ['Fan', 'Reclining Seat', 'Curtains'], departureTime: '20:30', arrivalTime: '05:00', duration: '8h 30m', rating: 4.0, available: 28 },
    { id: 'ib_011', operator: 'Green Line Travels', model: 'Ashok Leyland Viking LP', type: 'Non-AC Economy', seats: 54, fare: 290, amenities: ['Fan', 'Basic Seat', 'Curtains'], departureTime: '05:30', arrivalTime: '14:00', duration: '8h 30m', rating: 3.7, available: 50 },
    { id: 'ib_012', operator: 'Tamil Nadu SETC Ultra', model: 'Volvo B7R Non-AC Express', type: 'Non-AC Express', seats: 48, fare: 350, amenities: ['Fan', 'Seat Cover', 'Luggage Space'], departureTime: '08:00', arrivalTime: '16:30', duration: '8h 30m', rating: 4.2, available: 32 },
  ],
};

// ─── GROUP CHARTER DRIVERS ───────────────────────────────────────────
const CHARTER_DRIVERS = [
  {
    id: 'drv_001',
    name: 'Murugan Selvakumar',
    phone: '+91 98432 11234',
    photo: '🧑‍✈️',
    rating: 4.9,
    trips: 312,
    experience: '8 yrs',
    languages: ['Tamil', 'Telugu', 'English'],
    packages: [
      { capacity: 12, bus: 'Tempo Traveller Force', type: 'Non-AC', perDay: 3200, total2Days: 6400 },
      { capacity: 12, bus: 'Tempo Traveller AC Force', type: 'AC', perDay: 4200, total2Days: 8400 },
    ],
  },
  {
    id: 'drv_002',
    name: 'Sureshkumar Pillai',
    phone: '+91 97865 43210',
    photo: '👨‍💼',
    rating: 4.7,
    trips: 198,
    experience: '6 yrs',
    languages: ['Tamil', 'English'],
    packages: [
      { capacity: 30, bus: 'Eicher Mini Bus', type: 'Non-AC', perDay: 6500, total2Days: 13000 },
      { capacity: 30, bus: 'Tata Winger AC Bus', type: 'AC', perDay: 8000, total2Days: 16000 },
    ],
  },
  {
    id: 'drv_003',
    name: 'Ramachandran G.',
    phone: '+91 99432 56789',
    photo: '👷',
    rating: 4.8,
    trips: 427,
    experience: '12 yrs',
    languages: ['Tamil', 'Hindi', 'English'],
    packages: [
      { capacity: 50, bus: 'Ashok Leyland Volvo Coach', type: 'Non-AC', perDay: 12000, total2Days: 24000 },
      { capacity: 50, bus: 'Volvo Multi-Axle Luxury AC', type: 'AC', perDay: 16500, total2Days: 33000 },
    ],
  },
  {
    id: 'drv_004',
    name: 'Arockia Dass J.',
    phone: '+91 96543 87654',
    photo: '🧑‍🔧',
    rating: 4.6,
    trips: 156,
    experience: '5 yrs',
    languages: ['Tamil', 'Malayalam'],
    packages: [
      { capacity: 12, bus: 'Maruti Van (12 Seater)', type: 'Non-AC', perDay: 2800, total2Days: 5600 },
      { capacity: 30, bus: 'Tata Starbus Mini', type: 'Non-AC', perDay: 5800, total2Days: 11600 },
    ],
  },
];

// ─── CITY COORDINATES for map ────────────────────────────────────────
const CITY_COORDS = {
  'Chennai':    [13.0827, 80.2707],
  'Madurai':    [9.9252, 78.1198],
  'Coimbatore': [11.0168, 76.9558],
  'Trichy':     [10.7905, 78.7047],
  'Bangalore':  [12.9716, 77.5946],
  'Hyderabad':  [17.3850, 78.4867],
  'Pondicherry':[11.9416, 79.8083],
  'Ooty':       [11.4102, 76.6950],
  'Salem':      [11.6643, 78.1460],
};

const busMapIcon = (color = '#1B5E20') => L.divIcon({
  className: '',
  html: `<div style="background:${color};border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:17px">🚌</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const pinIcon = (color = '#2563EB') => L.divIcon({
  className: '',
  html: `<div style="position:relative"><svg viewBox='0 0 30 40' width='30' height='40' xmlns='http://www.w3.org/2000/svg'><path d='M15 0C6.7 0 0 6.7 0 15c0 10.8 13.3 24.5 14.5 25.8a.8.8 0 001 0C16.7 39.5 30 25.8 30 15 30 6.7 23.3 0 15 0z' fill='${color}'/><circle cx='15' cy='15' r='6' fill='white'/></svg></div>`,
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const POPULAR_ROUTES = [
  { from: 'Chennai', to: 'Madurai' },
  { from: 'Chennai', to: 'Coimbatore' },
  { from: 'Chennai', to: 'Trichy' },
  { from: 'Chennai', to: 'Bangalore' },
  { from: 'Chennai', to: 'Hyderabad' },
  { from: 'Chennai', to: 'Pondicherry' },
  { from: 'Chennai', to: 'Ooty' },
  { from: 'Chennai', to: 'Salem' },
];

export default function TravelPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Main Tab
  const [tab, setTab] = useState('bus');
  const [step, setStep] = useState('search'); // 'search' | 'results' | 'passengers' | 'confirmed'

  // Bus State
  const [busType, setBusType] = useState('ac'); // 'ac' | 'nonac'
  const [searchFrom, setSearchFrom] = useState('Chennai');
  const [searchTo, setSearchTo] = useState('Madurai');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedBus, setSelectedBus] = useState(null);

  // Passenger State (Bus booking)
  const [passengers, setPassengers] = useState([{ id: 1, name: '', age: '', gender: 'Male', seat: '' }]);
  const [bookingRef, setBookingRef] = useState('');

  // Group Charter State
  const [charterFrom, setCharterFrom] = useState('Chennai, Tamil Nadu');
  const [charterTo, setCharterTo] = useState('Ooty / Kodaikanal, Tamil Nadu');
  const [charterDate, setCharterDate] = useState(new Date().toISOString().split('T')[0]);
  const [charterDays, setCharterDays] = useState(2);
  const [groupSize, setGroupSize] = useState(50);
  const [charterBusType, setCharterBusType] = useState('AC'); // 'AC' | 'Non-AC'
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedDriverPackage, setSelectedDriverPackage] = useState(null);
  const [charterPassengers, setCharterPassengers] = useState([{ id: 1, name: '', age: '', gender: 'Male', phone: '' }]);
  const [showCharterModal, setShowCharterModal] = useState(false);
  const [charterBookingRef, setCharterBookingRef] = useState('');

  // Flight & Train
  const [flightFrom, setFlightFrom] = useState('Chennai (MAA)');
  const [flightTo, setFlightTo] = useState('Delhi (DEL)');
  const [trainFrom, setTrainFrom] = useState('Chennai Central (MAS)');
  const [trainTo, setTrainTo] = useState('Bangalore City (SBC)');

  // ─── Bus Passenger Helpers ─────────────────────────────────────
  const addPassenger = () => {
    if (!selectedBus || passengers.length >= selectedBus.available) return;
    setPassengers(p => [...p, { id: Date.now(), name: '', age: '', gender: 'Male', seat: '' }]);
  };
  const removePassenger = (id) => { if (passengers.length > 1) setPassengers(p => p.filter(x => x.id !== id)); };
  const updatePassenger = (id, f, v) => setPassengers(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  // ─── Charter Passenger Helpers ─────────────────────────────────
  const addCharterPassenger = () => {
    if (charterPassengers.length >= groupSize) return;
    setCharterPassengers(p => [...p, { id: Date.now(), name: '', age: '', gender: 'Male', phone: '' }]);
  };
  const removeCharterPassenger = (id) => { if (charterPassengers.length > 1) setCharterPassengers(p => p.filter(x => x.id !== id)); };
  const updateCharterPassenger = (id, f, v) => setCharterPassengers(p => p.map(x => x.id === id ? { ...x, [f]: v } : x));

  // ─── Confirm Booking ──────────────────────────────────────────
  const handleConfirmBooking = () => {
    if (passengers.some(p => !p.name.trim() || !p.age)) {
      alert('Please fill Name and Age for all passengers.');
      return;
    }
    setBookingRef(`GG-BUS-${Math.floor(100000 + Math.random() * 900000)}`);
    setStep('confirmed');
  };

  const handleCharterConfirm = () => {
    if (!selectedDriver || !selectedDriverPackage) {
      alert('Please select a driver first.');
      return;
    }
    if (charterPassengers.some(p => !p.name.trim())) {
      alert('Please fill passenger names.');
      return;
    }
    setCharterBookingRef(`GG-CHARTER-${Math.floor(100000 + Math.random() * 900000)}`);
    setShowCharterModal(true);
  };

  const totalBusFare = selectedBus ? selectedBus.fare * passengers.length : 0;
  const charterTotal = selectedDriverPackage ? selectedDriverPackage.perDay * charterDays : 0;

  // Drivers filtered by group size
  const eligibleDrivers = CHARTER_DRIVERS.filter(d =>
    d.packages.some(p => p.capacity >= groupSize)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn-secondary"
          onClick={() => { if (step !== 'search') setStep(step === 'passengers' ? 'results' : 'search'); else navigate('/'); }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)', flexShrink: 0 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>Intercity Travel & Group Charter</h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            ❄️ AC Bus · 💨 Non-AC Bus · 🚌 Group Charter · ✈️ Flights · 🚆 Trains
          </p>
        </div>
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, backgroundColor: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        {[
          { id: 'bus', label: 'Bus', icon: '🚌' },
          { id: 'charter', label: 'Charter', icon: '🚐' },
          { id: 'flights', label: 'Flights', icon: '✈️' },
          { id: 'trains', label: 'Trains', icon: '🚆' },
        ].map(tObj => (
          <button
            key={tObj.id}
            onClick={() => { setTab(tObj.id); setStep('search'); setSelectedBus(null); setSelectedDriver(null); setSelectedDriverPackage(null); setPassengers([{ id: 1, name: '', age: '', gender: 'Male', seat: '' }]); }}
            style={{
              height: 44,
              borderRadius: 8,
              backgroundColor: tab === tObj.id ? 'var(--brand-green)' : 'transparent',
              color: tab === tObj.id ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span>{tObj.icon}</span>
            <span>{tObj.label}</span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1: INTERCITY BUS
         ══════════════════════════════════════════════════════ */}
      {tab === 'bus' && (
        <>
          {/* SEARCH STEP */}
          {step === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Search Intercity Buses</h2>

                {/* AC / Non-AC BIG TOGGLE */}
                <div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Select Bus Type</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      onClick={() => setBusType('ac')}
                      style={{
                        padding: '16px 12px',
                        borderRadius: 12,
                        border: `2px solid ${busType === 'ac' ? '#1B5E20' : 'var(--border)'}`,
                        backgroundColor: busType === 'ac' ? '#E8F5E9' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>❄️</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: busType === 'ac' ? '#1B5E20' : 'var(--text-primary)' }}>AC Bus</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Air Conditioned · Sleeper</span>
                      {busType === 'ac' && (
                        <span style={{ fontSize: 10, color: '#1B5E20', fontWeight: 700 }}>✓ SELECTED</span>
                      )}
                    </button>

                    <button
                      onClick={() => setBusType('nonac')}
                      style={{
                        padding: '16px 12px',
                        borderRadius: 12,
                        border: `2px solid ${busType === 'nonac' ? '#B45309' : 'var(--border)'}`,
                        backgroundColor: busType === 'nonac' ? '#FEF3C7' : 'var(--bg-surface)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>💨</span>
                      <span style={{ fontWeight: 800, fontSize: 15, color: busType === 'nonac' ? '#B45309' : 'var(--text-primary)' }}>Non-AC Bus</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Fan / Economy · Budget</span>
                      {busType === 'nonac' && (
                        <span style={{ fontSize: 10, color: '#B45309', fontWeight: 700 }}>✓ SELECTED</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Route & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>From</label>
                    <input className="input-field" placeholder="Origin city" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>To</label>
                    <input className="input-field" placeholder="Destination city" value={searchTo} onChange={e => setSearchTo(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4, textTransform: 'uppercase' }}>Travel Date</label>
                  <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
                </div>

                <button className="btn-primary" style={{ height: 48 }} onClick={() => setStep('results')}>
                  Search {busType === 'ac' ? '❄️ AC' : '💨 Non-AC'} Buses →
                </button>

                <button
                  onClick={() => window.open('https://www.tnstc.in/OTRSOnline/', '_blank', 'noopener,noreferrer')}
                  style={{ width: '100%', padding: '11px 14px', backgroundColor: '#FFFFFF', color: '#1B5E20', border: '2px solid #1B5E20', borderRadius: 8, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <Bus size={16} />
                  Book on Official TNSTC Portal
                  <ExternalLink size={14} />
                </button>
              </div>

              {/* Popular Routes */}
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Popular Routes</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {POPULAR_ROUTES.map((r, i) => (
                    <button key={i} onClick={() => { setSearchFrom(r.from); setSearchTo(r.to); }} className="badge-flat" style={{ cursor: 'pointer', fontSize: 12, padding: '5px 10px' }}>
                      {r.from} → {r.to}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RESULTS STEP */}
          {step === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Route bar */}
              <div className="flat-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, backgroundColor: busType === 'ac' ? '#DBEAFE' : '#FEF9C3', color: busType === 'ac' ? '#1D4ED8' : '#854D0E' }}>
                    {busType === 'ac' ? '❄️ AC BUS' : '💨 NON-AC BUS'}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{searchFrom} → {searchTo}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{travelDate}</span>
                </div>
                <button onClick={() => setStep('search')} className="btn-secondary" style={{ height: 32, padding: '0 12px', fontSize: 12 }}>Change</button>
              </div>

              <h2 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>
                {busType === 'ac' ? '❄️ AC' : '💨 Non-AC'} Buses Available ({INTERCITY_BUSES[busType].length})
              </h2>

              {/* ROUTE MAP */}
          {step === 'results' && (() => {
            const fromCoords = CITY_COORDS[searchFrom] || CITY_COORDS['Chennai'];
            const toCoords = CITY_COORDS[searchTo] || CITY_COORDS['Madurai'];
            const midLat = (fromCoords[0] + toCoords[0]) / 2;
            const midLng = (fromCoords[1] + toCoords[1]) / 2;
            return (
              <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <div style={{ backgroundColor: '#1B5E20', padding: '6px 14px', fontSize: 12, color: '#FFF', fontWeight: 700, display: 'flex', gap: 14 }}>
                  <span>🔵 {searchFrom}</span>
                  <span>→→→</span>
                  <span>🔴 {searchTo}</span>
                  <span style={{ marginLeft: 'auto', fontWeight: 400 }}>{busType === 'ac' ? '❄️ AC' : '💨 Non-AC'} Route</span>
                </div>
                <MapContainer center={[midLat, midLng]} zoom={6} style={{ height: 200, width: '100%' }} scrollWheelZoom={false} zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                  <Marker position={fromCoords} icon={pinIcon('#2563EB')} />
                  <Marker position={toCoords} icon={busMapIcon()} />
                  <Polyline positions={[fromCoords, toCoords]} pathOptions={{ color: '#1B5E20', weight: 4, opacity: 0.75, dashArray: '10 6' }} />
                </MapContainer>
                <div style={{ padding: '6px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)' }}>
                  🔵 {searchFrom} Departure · 🚌 {searchTo} Arrival · Tap a bus to select
                </div>
              </div>
            );
          })()}

          {/* Bus Cards */}
              {INTERCITY_BUSES[busType].map(bus => (
                <div
                  key={bus.id}
                  className="flat-card"
                  onClick={() => setSelectedBus(bus)}
                  style={{
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    border: selectedBus?.id === bus.id ? '2px solid var(--brand-green)' : '1px solid var(--border)',
                    backgroundColor: selectedBus?.id === bus.id ? '#E8F5E9' : 'var(--bg-surface)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{bus.operator}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bus.model}</div>
                      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, backgroundColor: busType === 'ac' ? '#DBEAFE' : '#FEF9C3', color: busType === 'ac' ? '#1D4ED8' : '#854D0E' }}>
                          {busType === 'ac' ? '❄️' : '💨'} {bus.type}
                        </span>
                        <span style={{ fontSize: 11, color: '#F59E0B' }}>★ {bus.rating}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-green-text)' }}>₹{bus.fare}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per person</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: bus.available <= 10 ? '#EF4444' : '#16A34A', marginTop: 2 }}>
                        {bus.available} seats
                      </div>
                    </div>
                  </div>

                  {/* Time Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{bus.departureTime}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{searchFrom}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bus.duration}</div>
                      <div style={{ height: 1, width: 50, backgroundColor: 'var(--border)', margin: '3px auto' }} />
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>🚌</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{bus.arrivalTime}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{searchTo}</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                    {bus.amenities.map((am, i) => (
                      <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{am}</span>
                    ))}
                  </div>

                  <button
                    className={selectedBus?.id === bus.id ? 'btn-primary' : 'btn-secondary'}
                    style={{ height: 38, fontSize: 13 }}
                    onClick={e => { e.stopPropagation(); setSelectedBus(bus); }}
                  >
                    {selectedBus?.id === bus.id ? '✓ Selected' : 'Select This Bus'}
                  </button>
                </div>
              ))}

              {/* Sticky Proceed */}
              {selectedBus && (
                <div style={{ position: 'sticky', bottom: 8 }}>
                  <div className="flat-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid var(--brand-green)', backgroundColor: '#E8F5E9' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{selectedBus.operator}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹{selectedBus.fare}/person · {selectedBus.type}</div>
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', padding: '0 20px', height: 42 }} onClick={() => setStep('passengers')}>
                      Add Passengers →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PASSENGERS STEP */}
          {step === 'passengers' && selectedBus && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Bus Summary */}
              <div className="flat-card" style={{ padding: 14, backgroundColor: '#E8F5E9', border: '1px solid var(--brand-green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#1B5E20', fontSize: 14 }}>{selectedBus.operator}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{searchFrom} → {searchTo} · {travelDate}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedBus.type} · {selectedBus.departureTime} – {selectedBus.arrivalTime}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#1B5E20' }}>₹{selectedBus.fare}<br /><span style={{ fontSize: 10, fontWeight: 400, color: 'var(--text-muted)' }}>/pax</span></div>
                </div>
              </div>

              {/* Passenger Management */}
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>Passenger Details</h2>
                    <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{passengers.length} passenger{passengers.length !== 1 ? 's' : ''} · Total: <strong style={{ color: '#1B5E20' }}>₹{totalBusFare}</strong></p>
                  </div>
                  <button
                    onClick={addPassenger}
                    disabled={passengers.length >= selectedBus.available}
                    style={{
                      width: 48, height: 48, borderRadius: 24,
                      backgroundColor: passengers.length >= selectedBus.available ? 'var(--bg-secondary)' : 'var(--brand-green)',
                      color: '#FFFFFF', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(27,94,32,0.35)', fontSize: 24, fontWeight: 900,
                    }}
                    title="Add Passenger"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {passengers.map((p, idx) => (
                    <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, backgroundColor: 'var(--bg-secondary)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: 'var(--brand-green)', color: '#FFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Passenger {idx + 1}</span>
                        </div>
                        {passengers.length > 1 && (
                          <button onClick={() => removePassenger(p.id)} style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px', gap: 8, marginBottom: 8 }}>
                        <input className="input-field" placeholder="Full Name *" value={p.name} onChange={e => updatePassenger(p.id, 'name', e.target.value)} style={{ height: 40, fontSize: 13 }} />
                        <input className="input-field" placeholder="Age *" type="number" min="1" max="110" value={p.age} onChange={e => updatePassenger(p.id, 'age', e.target.value)} style={{ height: 40, fontSize: 13 }} />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <select value={p.gender} onChange={e => updatePassenger(p.id, 'gender', e.target.value)} style={{ height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13 }}>
                          <option>Male</option><option>Female</option><option>Other</option>
                        </select>
                        <input className="input-field" placeholder="Seat Preference" value={p.seat} onChange={e => updatePassenger(p.id, 'seat', e.target.value)} style={{ height: 40, fontSize: 13 }} />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={addPassenger} disabled={passengers.length >= selectedBus.available} style={{ width: '100%', height: 44, borderRadius: 8, border: '2px dashed var(--border)', backgroundColor: 'transparent', color: '#1B5E20', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <Plus size={18} /> Add Another Passenger
                </button>
              </div>

              {/* Fare Summary */}
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div className="text-caption" style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fare Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Bus Fare</span><span style={{ fontWeight: 600 }}>₹{selectedBus.fare} × {passengers.length}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>GetGo Service Fee</span><span style={{ fontWeight: 600, color: '#16A34A' }}>₹0 (Free)</span></div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                  <span>Total Amount</span><span style={{ color: '#1B5E20' }}>₹{totalBusFare}</span>
                </div>
              </div>

              <button className="btn-primary" style={{ height: 50, fontSize: 15 }} onClick={handleConfirmBooking}>
                Confirm & Pay ₹{totalBusFare}
              </button>
            </div>
          )}

          {/* CONFIRMED STEP */}
          {step === 'confirmed' && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#E8F5E9', border: '2px solid #1B5E20', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={32} color="#1B5E20" />
              </div>
              <div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Booking Confirmed!</h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Ref: <strong style={{ color: '#1B5E20' }}>#{bookingRef}</strong></p>
              </div>
              <div style={{ width: '100%', backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 12, fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Operator</span><span style={{ fontWeight: 700 }}>{selectedBus?.operator}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Route</span><span style={{ fontWeight: 700 }}>{searchFrom} → {searchTo}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Date & Time</span><span style={{ fontWeight: 700 }}>{travelDate} · {selectedBus?.departureTime}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Passengers</span><span style={{ fontWeight: 700 }}>{passengers.length} person{passengers.length > 1 ? 's' : ''}</span></div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                  <span>Total Paid</span><span style={{ color: '#1B5E20' }}>₹{totalBusFare}</span>
                </div>
              </div>
              <button className="btn-primary" onClick={() => { setStep('search'); setSelectedBus(null); setPassengers([{ id: 1, name: '', age: '', gender: 'Male', seat: '' }]); navigate('/'); }}>
                Back to Home
              </button>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2: GROUP CHARTER with DRIVERS + PASSENGERS
         ══════════════════════════════════════════════════════ */}
      {tab === 'charter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Private Group Bus Charter & Rental</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Choose AC or Non-AC, select group size, find available drivers with packages</p>

            {/* Bus Type Toggle */}
            <div>
              <div className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Charter Bus Type</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {['AC', 'Non-AC'].map(bt => (
                  <button
                    key={bt}
                    onClick={() => { setCharterBusType(bt); setSelectedDriver(null); setSelectedDriverPackage(null); }}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 12,
                      border: `2px solid ${charterBusType === bt ? (bt === 'AC' ? '#1D4ED8' : '#B45309') : 'var(--border)'}`,
                      backgroundColor: charterBusType === bt ? (bt === 'AC' ? '#DBEAFE' : '#FEF3C7') : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{bt === 'AC' ? '❄️' : '💨'}</span>
                    <span style={{ fontWeight: 800, fontSize: 14, color: charterBusType === bt ? (bt === 'AC' ? '#1D4ED8' : '#B45309') : 'var(--text-primary)' }}>{bt} Bus</span>
                    {charterBusType === bt && <span style={{ fontSize: 10, fontWeight: 700, color: bt === 'AC' ? '#1D4ED8' : '#B45309' }}>✓ SELECTED</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Group Size */}
            <div>
              <div className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Group Size (Passengers)</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[12, 30, 50].map(sz => (
                  <button
                    key={sz}
                    onClick={() => { setGroupSize(sz); setSelectedDriver(null); setSelectedDriverPackage(null); }}
                    style={{ flex: 1, height: 44, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: `2px solid ${groupSize === sz ? 'var(--brand-green)' : 'var(--border)'}`, backgroundColor: groupSize === sz ? '#E8F5E9' : 'var(--bg-surface)', color: groupSize === sz ? '#1B5E20' : 'var(--text-secondary)' }}
                  >
                    {sz} Pax
                  </button>
                ))}
              </div>
            </div>

            {/* Route & Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Pickup City</label>
                <input className="input-field" placeholder="e.g. Chennai" value={charterFrom} onChange={e => setCharterFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Destination</label>
                <input className="input-field" placeholder="e.g. Ooty" value={charterTo} onChange={e => setCharterTo(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Start Date</label>
                <input className="input-field" type="date" value={charterDate} onChange={e => setCharterDate(e.target.value)} />
              </div>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Days</label>
                <input className="input-field" type="number" min="1" max="15" value={charterDays} onChange={e => setCharterDays(Math.max(1, Number(e.target.value)))} />
              </div>
            </div>
          </div>

          {/* Available Drivers */}
          <div>
            <h3 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', marginBottom: 12 }}>
              🧑‍✈️ Available Drivers for {groupSize} Pax ({charterBusType} Bus)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {eligibleDrivers.map(driver => {
                const pkg = driver.packages.find(p => p.capacity >= groupSize && p.type === charterBusType);
                if (!pkg) return null;
                const totalPackage = pkg.perDay * charterDays;
                const isSelected = selectedDriver?.id === driver.id;

                return (
                  <div
                    key={driver.id}
                    className="flat-card"
                    onClick={() => { setSelectedDriver(driver); setSelectedDriverPackage({ ...pkg, total: totalPackage }); }}
                    style={{
                      padding: 16,
                      border: `2px solid ${isSelected ? '#1B5E20' : 'var(--border)'}`,
                      backgroundColor: isSelected ? '#E8F5E9' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {/* Driver Info Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isSelected ? '#1B5E20' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: `2px solid ${isSelected ? '#1B5E20' : 'var(--border)'}` }}>
                          {driver.photo}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{driver.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            ⭐ {driver.rating} · {driver.trips} trips · {driver.experience} exp
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            📞 {driver.phone}
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#1B5E20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={16} color="#FFF" />
                        </div>
                      )}
                    </div>

                    {/* Package Card */}
                    <div style={{ backgroundColor: isSelected ? '#FFFFFF' : 'var(--bg-secondary)', padding: 14, borderRadius: 10, border: `1px solid ${isSelected ? '#1B5E20' : 'var(--border)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{pkg.bus}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                            {charterBusType === 'AC' ? '❄️' : '💨'} {pkg.type} · Up to {pkg.capacity} Passengers
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>₹{pkg.perDay}/day</span>
                            <span style={{ fontSize: 11, padding: '2px 7px', borderRadius: 4, backgroundColor: '#E8F5E9', color: '#1B5E20', border: '1px solid #A7F3D0', fontWeight: 700 }}>
                              {charterDays} Days = ₹{totalPackage}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                          <div style={{ fontSize: 22, fontWeight: 800, color: '#1B5E20' }}>₹{totalPackage}</div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Total Package</div>
                        </div>
                      </div>
                    </div>

                    {/* Languages */}
                    <div style={{ display: 'flex', gap: 5 }}>
                      {driver.languages.map((l, i) => (
                        <span key={i} style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{l}</span>
                      ))}
                    </div>

                    <button
                      className={isSelected ? 'btn-primary' : 'btn-secondary'}
                      style={{ height: 38, fontSize: 13 }}
                      onClick={e => { e.stopPropagation(); setSelectedDriver(driver); setSelectedDriverPackage({ ...pkg, total: totalPackage }); }}
                    >
                      {isSelected ? '✓ Driver Selected' : 'Select This Driver'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Passenger List for Charter */}
          {selectedDriver && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>Group Passenger List</h3>
                  <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{charterPassengers.length} added · Max {groupSize}</p>
                </div>
                <button
                  onClick={addCharterPassenger}
                  disabled={charterPassengers.length >= groupSize}
                  style={{
                    width: 48, height: 48, borderRadius: 24,
                    backgroundColor: charterPassengers.length >= groupSize ? 'var(--bg-secondary)' : 'var(--brand-green)',
                    color: '#FFFFFF', border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(27,94,32,0.35)',
                  }}
                >
                  <Plus size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {charterPassengers.map((p, idx) => (
                  <div key={p.id} style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, backgroundColor: 'var(--bg-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#1B5E20', color: '#FFF', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{idx + 1}</div>
                        <span style={{ fontWeight: 700, fontSize: 13 }}>Passenger {idx + 1}</span>
                      </div>
                      {charterPassengers.length > 1 && (
                        <button onClick={() => removeCharterPassenger(p.id)} style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 1fr', gap: 8 }}>
                      <input className="input-field" placeholder="Full Name *" value={p.name} onChange={e => updateCharterPassenger(p.id, 'name', e.target.value)} style={{ height: 38, fontSize: 13 }} />
                      <input className="input-field" placeholder="Age" type="number" value={p.age} onChange={e => updateCharterPassenger(p.id, 'age', e.target.value)} style={{ height: 38, fontSize: 13 }} />
                      <select value={p.gender} onChange={e => updateCharterPassenger(p.id, 'gender', e.target.value)} style={{ height: 38, padding: '0 8px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', fontSize: 13 }}>
                        <option>Male</option><option>Female</option><option>Other</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addCharterPassenger} disabled={charterPassengers.length >= groupSize} style={{ width: '100%', height: 44, borderRadius: 8, border: '2px dashed var(--border)', backgroundColor: 'transparent', color: '#1B5E20', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Plus size={18} /> Add Another Passenger
              </button>
            </div>
          )}

          {/* Charter Summary & Confirm */}
          {selectedDriver && selectedDriverPackage && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div className="text-caption" style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Charter Package Summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Driver</span><span style={{ fontWeight: 700 }}>{selectedDriver.name}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Bus</span><span style={{ fontWeight: 700 }}>{selectedDriverPackage.bus}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Type</span><span className="badge-flat" style={{ fontSize: 11 }}>{charterBusType === 'AC' ? '❄️' : '💨'} {charterBusType}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Route</span><span style={{ fontWeight: 700 }}>{charterFrom} → {charterTo}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Duration</span><span style={{ fontWeight: 700 }}>{charterDays} Days from {charterDate}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Passengers</span><span style={{ fontWeight: 700 }}>{charterPassengers.length} added / {groupSize} max</span></div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                <span>Total Package</span><span style={{ color: '#1B5E20' }}>₹{charterTotal}</span>
              </div>
            </div>
          )}

          {selectedDriver && (
            <button className="btn-primary" style={{ height: 50, fontSize: 15 }} onClick={handleCharterConfirm}>
              Confirm Charter Booking →
            </button>
          )}

          {/* Charter Confirmation Modal */}
          {showCharterModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
              <div className="flat-card" style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8F5E9', border: '2px solid #1B5E20', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Check size={28} color="#1B5E20" />
                  </div>
                  <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Charter Booking Confirmed!</h2>
                  <p className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>Ref: <strong style={{ color: '#1B5E20' }}>#{charterBookingRef}</strong></p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 10, fontSize: 13, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Driver</span><span style={{ fontWeight: 700 }}>{selectedDriver?.name}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Bus</span><span style={{ fontWeight: 700 }}>{selectedDriverPackage?.bus}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Route</span><span style={{ fontWeight: 700 }}>{charterFrom} → {charterTo}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Group Size</span><span style={{ fontWeight: 700 }}>{charterPassengers.length} passengers</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 8, fontWeight: 800, fontSize: 15 }}>
                    <span>Total Package</span><span style={{ color: '#1B5E20' }}>₹{charterTotal}</span>
                  </div>
                </div>
                <p className="text-caption" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Our GetGo Travel Executive will contact you within 30 minutes to confirm trip details.</p>
                <button className="btn-primary" onClick={() => setShowCharterModal(false)}>Close & Done</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3: INDIGO FLIGHTS
         ══════════════════════════════════════════════════════ */}
      {tab === 'flights' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>IndiGo Flight Search & Booking</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="From Airport (e.g. Chennai MAA)" value={flightFrom} onChange={e => setFlightFrom(e.target.value)} />
            <input className="input-field" placeholder="To Airport (e.g. Delhi DEL)" value={flightTo} onChange={e => setFlightTo(e.target.value)} />
            <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => window.open(`https://www.goindigo.in/?origin=${flightFrom.slice(0, 3)}&destination=${flightTo.slice(0, 3)}`, '_blank', 'noopener,noreferrer')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Search & Book on IndiGo <ExternalLink size={16} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 4: CONFIRMTKT TRAINS
         ══════════════════════════════════════════════════════ */}
      {tab === 'trains' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>ConfirmTkt / IRCTC Train Search</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="From Station (e.g. Chennai Central MAS)" value={trainFrom} onChange={e => setTrainFrom(e.target.value)} />
            <input className="input-field" placeholder="To Station (e.g. Bangalore SBC)" value={trainTo} onChange={e => setTrainTo(e.target.value)} />
            <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => window.open('https://www.confirmtkt.com/rbooking/', '_blank', 'noopener,noreferrer')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            Search Trains on ConfirmTkt IRCTC <ExternalLink size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
