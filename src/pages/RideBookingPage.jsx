import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ArrowLeft, Check, CreditCard, X, UserCheck } from 'lucide-react';
import { MOCK_DRIVERS, PAYMENT_METHODS, VEHICLE_CATEGORIES } from '../data/mockData';
import { VEHICLE_BASE64 } from '../assets/vehicleBase64';
import { DRIVER_AVATAR_BASE64 } from '../assets/mediaBase64';
import { useLanguage, useLocation } from '../App';

// ─── Fix Leaflet default icons ────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ─── Custom map icons ─────────────────────────────────────────────────
const makePin = (color) => L.divIcon({
  className: '',
  html: `<svg viewBox="0 0 36 48" width="36" height="48" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 0C8.06 0 0 8.06 0 18c0 13 16 29.5 17.4 31a1 1 0 001.2 0C20 47.5 36 31 36 18 36 8.06 27.94 0 18 0z" fill="${color}"/>
    <circle cx="18" cy="18" r="8" fill="white"/>
  </svg>`,
  iconSize: [36, 48], iconAnchor: [18, 48],
});

const makeCarIcon = (emoji, bg, size = 38) => L.divIcon({
  className: '',
  html: `<div style="background:${bg};border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4);font-size:${size * 0.5}px">${emoji}</div>`,
  iconSize: [size, size], iconAnchor: [size / 2, size / 2],
});

const PICKUP_PIN = makePin('#2563EB');
const DROP_PIN   = makePin('#DC2626');
const CAR_ICON   = makeCarIcon('🚗', '#1B5E20', 42);
const SELECTED_CAR_ICON = makeCarIcon('🚗', '#1B5E20', 46);
const GREY_CAR   = makeCarIcon('🚗', '#374151', 34);

// ─── MapFit: auto-fit bounds when markers change ──────────────────────
function MapFit({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length >= 2) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [JSON.stringify(positions)]);
  return null;
}

// ─── Animate driver marker along a path ──────────────────────────────
function useAnimatedMarker(path, intervalMs = 120, pauseAtEnd = false) {
  const [pos, setPos] = useState(path[0] || [0, 0]);
  const stepRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    stepRef.current = 0;
    setPos(path[0] || [0, 0]);

    timerRef.current = setInterval(() => {
      stepRef.current += 1;
      if (stepRef.current >= path.length) {
        if (!pauseAtEnd) stepRef.current = 0;
        else { clearInterval(timerRef.current); return; }
      }
      setPos(path[stepRef.current]);
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [JSON.stringify(path), intervalMs, pauseAtEnd]);

  return pos;
}

// ─── Interpolate points between two coords (N steps) ─────────────────
function interpolate([lat1, lng1], [lat2, lng2], steps = 80) {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t];
  });
}

// ─── LiveTrackingMap: animated driver approaching pickup, then to dest ─
function LiveTrackingMap({ pickupCoords, dropCoords, driverStartOffset = [0.012, 0.015], emoji = '🚗', label = '' }) {
  const pickupPos = [pickupCoords.lat, pickupCoords.lng];
  const dropPos   = [dropCoords.lat, dropCoords.lng];
  const driverStart = [pickupCoords.lat + driverStartOffset[0], pickupCoords.lng + driverStartOffset[1]];

  // Phase 1: driver → pickup (40 steps), Phase 2: pickup → drop (80 steps)
  const phase1 = interpolate(driverStart, pickupPos, 45);
  const phase2 = interpolate(pickupPos, dropPos, 85);
  const fullPath = [...phase1, ...phase2];

  const driverPos = useAnimatedMarker(fullPath, 120, false);

  const driverIcon = useMemo(() => makeCarIcon(emoji, '#1B5E20', 42), [emoji]);

  return (
    <>
      <Marker position={pickupPos} icon={PICKUP_PIN} />
      <Marker position={dropPos} icon={DROP_PIN} />
      <Marker position={driverPos} icon={driverIcon} />
      {/* Route polyline */}
      <Polyline positions={[pickupPos, dropPos]} pathOptions={{ color: '#1B5E20', weight: 4, opacity: 0.55, dashArray: '10 6' }} />
      {/* Driver approach trail */}
      <Polyline positions={[driverStart, pickupPos]} pathOptions={{ color: '#F59E0B', weight: 2.5, opacity: 0.5, dashArray: '6 4' }} />
      <MapFit positions={[driverStart, pickupPos, dropPos]} />
    </>
  );
}

// ─── NearbyDriversMap: show driver pins on map ───────────────────────
function NearbyDriversMap({ pickupCoords, drivers, selectedDriverId }) {
  const pickupPos = [pickupCoords.lat, pickupCoords.lng];
  const offsets   = [[0.009, 0.013], [-0.011, 0.008], [0.006, -0.015], [-0.007, -0.010], [0.014, -0.005], [-0.013, 0.016]];

  return (
    <>
      <Marker position={pickupPos} icon={PICKUP_PIN} />
      {drivers.slice(0, 5).map((dr, i) => {
        const off = offsets[i] || [0, 0];
        const pos = [pickupCoords.lat + off[0], pickupCoords.lng + off[1]];
        const icon = selectedDriverId === dr.id ? SELECTED_CAR_ICON : GREY_CAR;
        return <Marker key={dr.id} position={pos} icon={icon} />;
      })}
    </>
  );
}

export default function RideBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { userLocation } = useLocation();

  const [step, setStep] = useState('location');
  const [pickup, setPickup] = useState(userLocation);
  const [dropoff, setDropoff] = useState(searchParams.get('destination') || 'T. Nagar, Chennai');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords]     = useState({ lat: 13.0418, lng: 80.2341 });
  const [selectedCategory, setSelectedCategory] = useState('car');
  const [selectedDriver, setSelectedDriver] = useState(MOCK_DRIVERS[6]);
  const [paymentMethod, setPaymentMethod]   = useState(PAYMENT_METHODS[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDispatching, setIsDispatching]   = useState(false);
  const [showReceipt, setShowReceipt]       = useState(false);
  const [trackPhase, setTrackPhase]         = useState('arriving'); // 'arriving' | 'inride' | 'done'

  const availableDrivers = useMemo(() =>
    MOCK_DRIVERS.filter(d => d.vehicle === selectedCategory), [selectedCategory]);

  const calculatedDistance = useMemo(() => {
    const dist = Math.sqrt(
      Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) +
      Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)
    );
    return Math.max(2.5, Math.round(dist * 10) / 10);
  }, [pickupCoords, dropCoords]);

  const fareBreakdown = useMemo(() => {
    const cat = VEHICLE_CATEGORIES.find(c => c.id === selectedCategory) || VEHICLE_CATEGORIES[2];
    const perKm = selectedDriver ? selectedDriver.perKmRate : cat.perKmRate;
    const distFare = Math.round(calculatedDistance * perKm);
    return { baseRate: cat.baseRate, perKmRate: perKm, distanceKm: calculatedDistance, distanceFare: distFare, totalFare: cat.baseRate + distFare };
  }, [selectedCategory, selectedDriver, calculatedDistance]);

  const handleConfirmBooking = () => {
    setIsDispatching(true);
    setTimeout(() => { setIsDispatching(false); setTrackPhase('arriving'); setStep('tracking'); }, 1200);
  };

  // Auto-advance track phases for demo
  useEffect(() => {
    if (step !== 'tracking') return;
    const t1 = setTimeout(() => setTrackPhase('inride'), 8000);
    const t2 = setTimeout(() => setTrackPhase('done'), 20000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const VEHICLE_IMAGES = VEHICLE_BASE64;

  const trackMessages = {
    arriving: { title: `${selectedDriver?.name} is en route to you!`, sub: 'Driver approaching pickup location • ~3 min', color: '#F59E0B' },
    inride:   { title: 'You are in the ride!', sub: `En route to ${dropoff}`, color: '#1B5E20' },
    done:     { title: 'Ride Completed! 🎉', sub: 'You have arrived safely.', color: '#1B5E20' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn-secondary" onClick={() => {
          if (step === 'location') navigate('/');
          else if (step === 'vehicle') setStep('location');
          else if (step === 'driver') setStep('vehicle');
          else if (step === 'confirm') setStep('driver');
          else setStep('confirm');
        }} style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>{t('bookRide') || 'Book a City Ride'}</h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Instant Bike, Auto, Sedan & XL Van Pickups</p>
        </div>
      </div>

      {/* ══════════ STEP 1: LOCATION + LIVE MAP ══════════ */}
      {step === 'location' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* LIVE MAP — pickup + drop with dashed route */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div style={{ backgroundColor: '#1B5E20', padding: '7px 14px', fontSize: 12, color: '#FFF', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>📍 Set Your Route</span>
              <span style={{ fontWeight: 400, opacity: 0.8 }}>Tap pins to adjust</span>
            </div>
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={13} style={{ height: 260, width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_PIN} />
              <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_PIN} />
              <Polyline positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]} pathOptions={{ color: '#1B5E20', weight: 3, opacity: 0.7, dashArray: '8 5' }} />
              <MapFit positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]} />
            </MapContainer>
            <div style={{ padding: '7px 14px', backgroundColor: 'var(--bg-secondary)', display: 'flex', gap: 16, fontSize: 12 }}>
              <span>🔵 <strong>Pickup:</strong> {pickup}</span>
              <span>🔴 <strong>Drop:</strong> {dropoff}</span>
            </div>
          </div>

          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>1. Pickup & Destination</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#2563EB" style={{ position: 'absolute', left: 14, top: 13 }} />
                <input className="input-field" placeholder="Pickup address" value={pickup} onChange={e => setPickup(e.target.value)} style={{ paddingLeft: 42 }} />
              </div>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} color="#DC2626" style={{ position: 'absolute', left: 14, top: 13 }} />
                <input className="input-field" placeholder="Destination address" value={dropoff} onChange={e => setDropoff(e.target.value)} style={{ paddingLeft: 42 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['T. Nagar', 'Chennai Airport', 'Central Station', 'OMR Tech Park', 'Tambaram'].map(loc => (
                <button key={loc} onClick={() => setDropoff(loc + ', Chennai')} className={dropoff.includes(loc) ? 'badge-flat-green' : 'badge-flat'} style={{ cursor: 'pointer', fontSize: 12 }}>{loc}</button>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setStep('vehicle')} disabled={!pickup.trim() || !dropoff.trim()}>Choose Vehicle →</button>
          </div>
        </div>
      )}

      {/* ══════════ STEP 2: VEHICLE SELECTION ══════════ */}
      {step === 'vehicle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flat-card" style={{ padding: 14, fontSize: 14 }}>
            <span style={{ color: 'var(--text-muted)' }}>From:</span> <strong>{pickup}</strong> &nbsp;→&nbsp;
            <span style={{ color: 'var(--text-muted)' }}>To:</span> <strong>{dropoff}</strong>
            <button className="btn-text" onClick={() => setStep('location')} style={{ fontSize: 12, float: 'right' }}>Change</button>
          </div>
          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>2. Select Vehicle Type</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {VEHICLE_CATEGORIES.map(cat => {
              const isSel = selectedCategory === cat.id;
              return (
                <div key={cat.id} onClick={() => setSelectedCategory(cat.id)}
                  style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', borderRadius: 'var(--radius-lg)', border: `2px solid ${isSel ? 'var(--brand-green)' : 'var(--border)'}`, backgroundColor: isSel ? 'var(--brand-green-tint)' : 'var(--bg-surface)', transition: 'all 0.15s' }}>
                  <div style={{ fontSize: 32 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15 }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{cat.description}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-green-text)', marginTop: 4 }}>₹{cat.baseRate} base + ₹{cat.perKmRate}/km</div>
                  </div>
                  {isSel && <Check size={20} color="var(--brand-green-text)" />}
                </div>
              );
            })}
          </div>
          <button className="btn-primary" onClick={() => { setSelectedDriver(availableDrivers[0] || MOCK_DRIVERS[0]); setStep('driver'); }}>
            View Available Drivers →
          </button>
        </div>
      )}

      {/* ══════════ STEP 3: DRIVER SELECTION + LIVE NEARBY MAP ══════════ */}
      {step === 'driver' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>3. Choose Driver</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Nearby {selectedCategory} drivers around {pickup}</p>
          </div>

          {/* LIVE NEARBY DRIVERS MAP */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div style={{ backgroundColor: '#1B5E20', padding: '7px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#FFF', fontSize: 12, fontWeight: 700 }}>🚗 Nearby Drivers — Live</span>
              <span style={{ color: '#4ADE80', fontSize: 11 }}>{availableDrivers.length} available</span>
            </div>
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={14} style={{ height: 230, width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              <NearbyDriversMap pickupCoords={pickupCoords} drivers={availableDrivers} selectedDriverId={selectedDriver?.id} />
            </MapContainer>
            <div style={{ padding: '5px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)' }}>
              🟢 Selected driver &nbsp;⚫ Other nearby &nbsp;🔵 Your pickup
            </div>
          </div>

          {/* Driver Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {availableDrivers.map(dr => {
              const isSel = selectedDriver?.id === dr.id;
              const fareCalc = Math.round(calculatedDistance * dr.perKmRate + (VEHICLE_CATEGORIES.find(c => c.id === selectedCategory)?.baseRate || 50));
              return (
                <div key={dr.id} onClick={() => setSelectedDriver(dr)}
                  style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, borderRadius: 'var(--radius-lg)', border: `2px solid ${isSel ? 'var(--brand-green)' : 'var(--border)'}`, backgroundColor: isSel ? 'var(--brand-green-tint)' : 'var(--bg-surface)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand-green)', flexShrink: 0 }}>
                        <img src={DRIVER_AVATAR_BASE64} alt={dr.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>{dr.name} <UserCheck size={13} color="var(--brand-green-text)" /></div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{dr.vehicleModel} · {dr.vehicleNo}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 12 }}>
                          <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {dr.rating}</span>
                          <span style={{ color: 'var(--text-muted)' }}>({dr.trips} trips)</span>
                          <span style={{ color: 'var(--brand-green-text)', fontWeight: 600 }}>{dr.distanceKm} km away</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-green-text)' }}>₹{fareCalc}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>₹{dr.perKmRate}/km</div>
                    </div>
                  </div>
                  {isSel && <button className="btn-primary" style={{ height: 36, fontSize: 13 }}>✓ Selected — Continue</button>}
                </div>
              );
            })}
          </div>
          <button className="btn-primary" onClick={() => setStep('confirm')}>Review Fare & Confirm →</button>
        </div>
      )}

      {/* ══════════ STEP 4: CONFIRM BOOKING ══════════ */}
      {step === 'confirm' && selectedDriver && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>4. Review & Confirm Ride</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Clear fare breakdown before booking</p>
          </div>
          <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand-green)' }}>
              <img src={DRIVER_AVATAR_BASE64} alt={selectedDriver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{selectedDriver.name} ({selectedDriver.rating} ★)</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedDriver.vehicleModel} · {selectedDriver.vehicleNo}</div>
            </div>
            <span className="badge-flat-green" style={{ fontSize: 12 }}>₹{selectedDriver.perKmRate}/km</span>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Base Charge</span><span style={{ fontWeight: 600 }}>₹{fareBreakdown.baseRate}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Distance ({fareBreakdown.distanceKm} km × ₹{fareBreakdown.perKmRate})</span><span style={{ fontWeight: 600 }}>₹{fareBreakdown.distanceFare}</span></div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
              <span>Total Fare</span><span style={{ color: 'var(--brand-green-text)', fontSize: 20 }}>₹{fareBreakdown.totalFare}</span>
            </div>
          </div>
          <div onClick={() => setShowPaymentModal(true)} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CreditCard size={20} color="var(--brand-green-text)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Payment: {paymentMethod.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paymentMethod.detail}</div>
              </div>
            </div>
            <button className="btn-text" style={{ fontSize: 12 }}>Change</button>
          </div>
          <button className="btn-primary" onClick={handleConfirmBooking} disabled={isDispatching} style={{ height: 50, fontSize: 16 }}>
            {isDispatching ? '⏳ Connecting to driver…' : `Confirm Booking — ₹${fareBreakdown.totalFare}`}
          </button>
        </div>
      )}

      {/* ══════════ STEP 5: LIVE ANIMATED TRACKING MAP ══════════ */}
      {step === 'tracking' && selectedDriver && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* LIVE MAP with animated driver marker */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--brand-green)', boxShadow: '0 4px 20px rgba(27,94,32,0.2)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            {/* Live indicator header */}
            <div style={{ backgroundColor: trackPhase === 'done' ? '#1B5E20' : '#1B5E20', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                backgroundColor: trackPhase === 'done' ? '#4ADE80' : '#FBBF24',
                display: 'inline-block',
                animation: trackPhase === 'done' ? 'none' : 'blink 1s infinite',
              }} />
              <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>
                {trackPhase === 'arriving' && `🚗 LIVE — ${selectedDriver.name} approaching your pickup`}
                {trackPhase === 'inride'  && `🟢 IN RIDE — Heading to ${dropoff}`}
                {trackPhase === 'done'    && '✅ TRIP COMPLETED — You have arrived!'}
              </span>
              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
            </div>
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={14} style={{ height: 320, width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              {trackPhase !== 'done' ? (
                <LiveTrackingMap
                  pickupCoords={pickupCoords}
                  dropCoords={dropCoords}
                  driverStartOffset={[0.013, 0.016]}
                  emoji="🚗"
                />
              ) : (
                <>
                  <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_PIN} />
                  <Marker position={[dropCoords.lat, dropCoords.lng]} icon={CAR_ICON} />
                </>
              )}
            </MapContainer>
            <div style={{ padding: '6px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
              <span>🔵 Pickup</span>
              <span>🔴 Destination</span>
              <span>🚗 {selectedDriver.name}</span>
              <span style={{ marginLeft: 'auto', color: '#1B5E20', fontWeight: 700 }}>
                {trackPhase === 'arriving' ? '~3 min ETA' : trackPhase === 'inride' ? 'In Ride' : '✅ Done'}
              </span>
            </div>
          </div>

          {/* Status Card */}
          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <span className="badge-flat-green"><Check size={14} /> {trackMessages[trackPhase].title}</span>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{trackMessages[trackPhase].sub}</p>
            </div>

            {/* Driver Info */}
            <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand-green)' }}>
                <img src={DRIVER_AVATAR_BASE64} alt={selectedDriver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedDriver.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedDriver.vehicleNo} · {selectedDriver.vehicleModel}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-green-text)' }}>₹{fareBreakdown.totalFare}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>via {paymentMethod.label}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => setShowReceipt(true)}>View Receipt</button>
              {trackPhase === 'done' && (
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/')}>Home</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PAYMENT_METHODS.map(pm => {
                const isSel = paymentMethod.id === pm.id;
                return (
                  <div key={pm.id} onClick={() => { setPaymentMethod(pm); setShowPaymentModal(false); }}
                    style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderRadius: 'var(--radius-md)', border: `2px solid ${isSel ? 'var(--brand-green)' : 'var(--border)'}`, backgroundColor: isSel ? 'var(--brand-green-tint)' : 'var(--bg-surface)' }}>
                    <span style={{ fontSize: 20 }}>{pm.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{pm.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pm.detail}</div>
                    </div>
                    {isSel && <Check size={18} color="var(--brand-green-text)" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* E-Receipt Modal */}
      {showReceipt && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <span className="badge-flat-green">Official Ride Receipt</span>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)', marginTop: 8 }}>GetGo Transport Receipt</h2>
              <p className="text-caption" style={{ color: 'var(--text-muted)' }}>Trip ID: #GG-{Date.now().toString().slice(-6)}</p>
            </div>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Driver</span><span style={{ fontWeight: 600 }}>{selectedDriver?.name}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Route</span><span style={{ fontWeight: 600 }}>{pickup} → {dropoff}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Distance</span><span style={{ fontWeight: 600 }}>{fareBreakdown.distanceKm} km</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Payment</span><span style={{ fontWeight: 600 }}>{paymentMethod.label}</span></div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                <span>Total Paid</span><span style={{ color: 'var(--brand-green-text)' }}>₹{fareBreakdown.totalFare}</span>
              </div>
            </div>
            <button className="btn-primary" onClick={() => setShowReceipt(false)}>Close Receipt</button>
          </div>
        </div>
      )}
    </div>
  );
}
