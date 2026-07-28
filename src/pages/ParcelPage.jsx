import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, MapPin, ArrowLeft, Check, X } from 'lucide-react';
import { MOCK_DRIVERS, SAVED_ADDRESSES, CHENNAI_LOCATIONS, PAYMENT_METHODS } from '../data/mockData';
import { useLanguage, useLocation } from '../App';

// ─── Fix Leaflet icons ────────────────────────────────────────────────
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const makePin = (color) => L.divIcon({
  className: '',
  html: `<div style="background:${color};width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.35);position:relative;margin-top:-12px;margin-left:-12px">
    <div style="background:white;width:8px;height:8px;border-radius:50%;position:absolute;top:5px;left:5px"></div>
  </div>`,
  iconSize: [24, 24], iconAnchor: [0, 0],
});

const PICKUP_PIN = makePin('#2563EB');
const DROP_PIN   = makePin('#DC2626');

const makeBikeIcon = (bg = '#1B5E20', size = 38) => L.divIcon({
  className: '',
  html: `<div style="background:${bg};border-radius:50%;width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.4);font-size:${Math.round(size * 0.5)}px;margin-top:-${size/2}px;margin-left:-${size/2}px">🛵</div>`,
  iconSize: [size, size], iconAnchor: [0, 0],
});
const BIKE_ICON = makeBikeIcon('#1B5E20', 42);

// ─── Interpolate path between two coords ─────────────────────────────
function interpolate([lat1, lng1], [lat2, lng2], steps = 80) {
  return Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    return [lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t];
  });
}

// ─── Animated rider marker hook ───────────────────────────────────────
function useAnimatedMarker(path, intervalMs = 110) {
  const [pos, setPos] = useState(path[0] || [0, 0]);
  const stepRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    stepRef.current = 0;
    setPos(path[0] || [0, 0]);
    timerRef.current = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % path.length;
      setPos(path[stepRef.current]);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [JSON.stringify(path), intervalMs]);

  return pos;
}

function MapController({ center, zoom = 13 }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && typeof center[0] === 'number' && typeof center[1] === 'number') {
      try {
        map.invalidateSize();
        map.setView(center, zoom);
      } catch (e) {
        console.warn('MapController error:', e);
      }
    }
  }, [center?.[0], center?.[1], zoom, map]);
  return null;
}

// ─── MapFit ───────────────────────────────────────────────────────────
function MapFit({ positions }) {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        map.invalidateSize();
        if (Array.isArray(positions) && positions.length >= 2) {
          const valid = positions.filter(p => Array.isArray(p) && typeof p[0] === 'number' && !isNaN(p[0]) && typeof p[1] === 'number' && !isNaN(p[1]));
          if (valid.length >= 2) {
            map.fitBounds(L.latLngBounds(valid), { padding: [35, 35], maxZoom: 15 });
          }
        }
      } catch (e) {
        console.warn('MapFit error:', e);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [JSON.stringify(positions), map]);
  return null;
}

// ─── LiveParcelMap ────────────────────────────────────────────────────
function LiveParcelMap({ pickupCoords, dropCoords }) {
  const pickupPos = [pickupCoords.lat, pickupCoords.lng];
  const dropPos   = [dropCoords.lat, dropCoords.lng];
  // Rider starts near sender (slight offset), goes to pickup, then to drop
  const riderStart = [pickupCoords.lat + 0.010, pickupCoords.lng + 0.013];
  const phase1 = interpolate(riderStart, pickupPos, 40);
  const phase2 = interpolate(pickupPos, dropPos, 90);
  const fullPath = [...phase1, ...phase2];

  const riderPos = useAnimatedMarker(fullPath, 110);

  return (
    <>
      <Marker position={pickupPos} icon={PICKUP_PIN} />
      <Marker position={dropPos} icon={DROP_PIN} />
      <Marker position={riderPos} icon={BIKE_ICON} />
      {/* Full route line */}
      <Polyline positions={[pickupPos, dropPos]} pathOptions={{ color: '#1B5E20', weight: 4, opacity: 0.5, dashArray: '10 7' }} />
      {/* Approach line (rider → pickup) */}
      <Polyline positions={[riderStart, pickupPos]} pathOptions={{ color: '#F59E0B', weight: 2.5, opacity: 0.5, dashArray: '6 4' }} />
      <MapFit positions={[riderStart, pickupPos, dropPos]} />
    </>
  );
}

// ─── ParcelPage ───────────────────────────────────────────────────────
export default function ParcelPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { userLocation } = useLocation();

  const [step, setStep] = useState('form'); // 'form' | 'confirm' | 'tracking'
  const [pickup, setPickup]   = useState(userLocation || 'Chennai Central Railway Station');
  const [dropoff, setDropoff] = useState('T. Nagar (Pondy Bazaar), Chennai');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords]     = useState({ lat: 13.0418, lng: 80.2341 });
  const [recipientName, setRecipientName]   = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [parcelDesc, setParcelDesc] = useState('');
  const [parcelWeight, setParcelWeight] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(MOCK_DRIVERS[0]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeField, setActiveField]   = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [trackPhase, setTrackPhase] = useState('pickup'); // 'pickup' | 'transit' | 'delivered'
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [bookingId] = useState(`GG-PKG-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleSearch = (query, field) => {
    if (!query) { setSearchSuggestions([]); return; }
    const results = CHENNAI_LOCATIONS.filter(l => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    setSearchSuggestions(results);
    setActiveField(field);
  };

  const selectLoc = (loc, field) => {
    if (field === 'pickup') { setPickup(loc.name); setPickupCoords({ lat: loc.lat, lng: loc.lng }); }
    else { setDropoff(loc.name); setDropCoords({ lat: loc.lat, lng: loc.lng }); }
    setSearchSuggestions([]);
    setActiveField(null);
  };

  const calculatedFare = useMemo(() => {
    const dist = Math.sqrt(
      Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) +
      Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)
    );
    return Math.max(49, Math.round(dist * 9) + 25);
  }, [pickupCoords, dropCoords]);

  const handleConfirmParcel = () => {
    setIsDispatching(true);
    setTimeout(() => { setIsDispatching(false); setTrackPhase('pickup'); setStep('tracking'); }, 1200);
  };

  // Auto-advance tracking phases
  useEffect(() => {
    if (step !== 'tracking') return;
    const t1 = setTimeout(() => setTrackPhase('transit'), 7000);
    const t2 = setTimeout(() => setTrackPhase('delivered'), 18000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [step]);

  const trackMessages = {
    pickup:    { emoji: '🛵', title: 'Rider en route to pickup', sub: 'Picking up your parcel in ~4 min', bg: '#F59E0B' },
    transit:   { emoji: '📦', title: 'Parcel is in transit!', sub: `Delivering to ${recipientName || 'recipient'}`, bg: '#1B5E20' },
    delivered: { emoji: '✅', title: 'Parcel Delivered!', sub: `${recipientName || 'Recipient'} has received the parcel`, bg: '#1B5E20' },
  };

  const deliveryOtp = useMemo(() => Math.floor(1000 + Math.random() * 9000), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="btn-secondary" onClick={() => { if (step === 'form') navigate('/'); else setStep('form'); }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>{t('sendParcelTitle') || 'Send a Parcel'}</h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Doorstep pickup & express bike delivery with live tracking</p>
        </div>
      </div>

      {/* ══════════ STEP 1: FORM + ALWAYS-VISIBLE LIVE MAP ══════════ */}
      {step === 'form' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ALWAYS VISIBLE LIVE ROUTE MAP */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div style={{ backgroundColor: '#1B5E20', padding: '7px 14px', fontSize: 12, color: '#FFF', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
              <span>📍 Live Parcel Route Map</span>
              <span style={{ fontWeight: 400, opacity: 0.85 }}>🛵 Nearby Couriers Active</span>
            </div>
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={13} style={{ height: 250, width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              <MapController center={[pickupCoords.lat, pickupCoords.lng]} />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_PIN} />
              <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_PIN} />
              {/* Nearby bike courier markers */}
              {[[0.007, 0.009], [-0.008, 0.012], [0.005, -0.011]].map((off, idx) => (
                <Marker key={idx} position={[pickupCoords.lat + off[0], pickupCoords.lng + off[1]]} icon={makeBikeIcon('#374151', 32)} />
              ))}
              <Polyline positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]} pathOptions={{ color: '#1B5E20', weight: 4, opacity: 0.75, dashArray: '9 5' }} />
              <MapFit positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]} />
            </MapContainer>
            <div style={{ padding: '7px 14px', backgroundColor: 'var(--bg-secondary)', display: 'flex', gap: 16, fontSize: 12 }}>
              <span>🔵 <strong>Pickup:</strong> {pickup}</span>
              <span>🔴 <strong>Delivery:</strong> {dropoff}</span>
            </div>
          </div>


          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Pickup & Delivery Details</h2>

            {/* Pickup field + suggestions */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={18} color="#2563EB" style={{ position: 'absolute', left: 12, zIndex: 1 }} />
                <input className="input-field" placeholder="Pickup location…" value={pickup} style={{ paddingLeft: 40 }}
                  onChange={e => { setPickup(e.target.value); handleSearch(e.target.value, 'pickup'); }}
                  onFocus={() => setActiveField('pickup')} />
              </div>
              {activeField === 'pickup' && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 200, marginTop: 4, boxShadow: 'var(--shadow-flat)' }}>
                  {searchSuggestions.map((s, i) => (
                    <div key={i} onClick={() => selectLoc(s, 'pickup')} style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={13} color="var(--brand-green-text)" /> {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropoff field + suggestions */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <MapPin size={18} color="#DC2626" style={{ position: 'absolute', left: 12, zIndex: 1 }} />
                <input className="input-field" placeholder="Delivery address…" value={dropoff} style={{ paddingLeft: 40 }}
                  onChange={e => { setDropoff(e.target.value); handleSearch(e.target.value, 'dropoff'); }}
                  onFocus={() => setActiveField('dropoff')} />
              </div>
              {activeField === 'dropoff' && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 200, marginTop: 4, boxShadow: 'var(--shadow-flat)' }}>
                  {searchSuggestions.map((s, i) => (
                    <div key={i} onClick={() => selectLoc(s, 'dropoff')} style={{ padding: '11px 16px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={13} color="#DC2626" /> {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>



            {/* Recipient details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input-field" placeholder="Recipient's Full Name *" value={recipientName} onChange={e => setRecipientName(e.target.value)} />
              <input className="input-field" type="tel" placeholder="Recipient's Phone Number *" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} />
              <input className="input-field" placeholder="Parcel Description (Docs, Electronics, Clothes…)" value={parcelDesc} onChange={e => setParcelDesc(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input className="input-field" placeholder="Approx. Weight (kg)" type="number" min="0.1" step="0.1" value={parcelWeight} onChange={e => setParcelWeight(e.target.value)} />
                <select style={{ height: 44, padding: '0 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: 14 }}>
                  <option>Standard (1-3 hrs)</option>
                  <option>Express (30-60 min)</option>
                  <option>Scheduled</option>
                </select>
              </div>
            </div>

            <button className="btn-primary" disabled={!pickup || !dropoff || !recipientName || !recipientPhone} onClick={() => setStep('confirm')} style={{ height: 48 }}>
              Find Bike Delivery Riders →
            </button>
          </div>
        </div>
      )}

      {/* ══════════ STEP 2: CONFIRM SUMMARY ══════════ */}
      {step === 'confirm' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Parcel Delivery Summary</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Express Bike Delivery · Insured & GPS Tracked</p>
          </div>

          {/* Route preview map */}
          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <MapContainer center={[(pickupCoords.lat + dropCoords.lat) / 2, (pickupCoords.lng + dropCoords.lng) / 2]} zoom={12} style={{ height: 180, width: '100%' }} scrollWheelZoom={false} zoomControl={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_PIN} />
              <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_PIN} />
              <Polyline positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]} pathOptions={{ color: '#1B5E20', weight: 4, opacity: 0.7, dashArray: '9 5' }} />
              <MapFit positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]} />
            </MapContainer>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>From</span><span style={{ fontWeight: 700 }}>{pickup}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>To</span><span style={{ fontWeight: 700 }}>{dropoff}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Recipient</span><span style={{ fontWeight: 700 }}>{recipientName} ({recipientPhone})</span></div>
            {parcelDesc && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Parcel</span><span style={{ fontWeight: 700 }}>{parcelDesc}</span></div>}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Rider</span><span style={{ fontWeight: 700 }}>{selectedDriver.name} · {selectedDriver.vehicleNo}</span></div>
          </div>

          {/* Payment selector */}
          <div onClick={() => setShowPayModal(true)} style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{paymentMethod.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Payment: {paymentMethod.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paymentMethod.detail}</div>
              </div>
            </div>
            <span style={{ color: '#1B5E20', fontWeight: 700, fontSize: 20 }}>₹{calculatedFare}</span>
          </div>

          <button className="btn-primary" onClick={handleConfirmParcel} disabled={isDispatching} style={{ height: 50, fontSize: 15 }}>
            {isDispatching ? '⏳ Assigning Rider…' : `Confirm Delivery — ₹${calculatedFare}`}
          </button>
        </div>
      )}

      {/* ══════════ STEP 3: LIVE ANIMATED DELIVERY MAP ══════════ */}
      {step === 'tracking' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Animated Live Map */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--brand-green)', boxShadow: '0 4px 20px rgba(27,94,32,0.2)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            {/* LIVE header */}
            <div style={{ backgroundColor: '#1B5E20', padding: '9px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 9, height: 9, borderRadius: '50%',
                backgroundColor: trackPhase === 'delivered' ? '#4ADE80' : '#FBBF24',
                display: 'inline-block',
                animation: trackPhase === 'delivered' ? 'none' : 'blink 0.9s infinite',
              }} />
              <span style={{ color: '#FFF', fontSize: 12, fontWeight: 700 }}>
                {trackMessages[trackPhase].emoji} {trackMessages[trackPhase].title.toUpperCase()}
              </span>
              <span style={{ marginLeft: 'auto', color: '#A7F3D0', fontSize: 11 }}>#{bookingId}</span>
              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.25}}`}</style>
            </div>

            {trackPhase !== 'delivered' ? (
              <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={14} style={{ height: 320, width: '100%' }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <LiveParcelMap pickupCoords={pickupCoords} dropCoords={dropCoords} />
              </MapContainer>
            ) : (
              <MapContainer center={[dropCoords.lat, dropCoords.lng]} zoom={15} style={{ height: 320, width: '100%' }} scrollWheelZoom={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_PIN} />
                <Marker position={[dropCoords.lat, dropCoords.lng]} icon={makeBikeIcon('#16A34A', 42)} />
              </MapContainer>
            )}

            <div style={{ padding: '7px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 14 }}>
              <span>🔵 Pickup: {pickup}</span>
              <span>🔴 Delivery: {dropoff}</span>
              <span style={{ marginLeft: 'auto', color: '#1B5E20', fontWeight: 700 }}>
                {trackPhase === 'pickup' ? '~4 min ETA' : trackPhase === 'transit' ? 'In Transit' : '✅ Delivered!'}
              </span>
            </div>
          </div>

          {/* Status Steps Progress */}
          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {[
                { id: 'pickup', label: 'Pickup', icon: '🛵' },
                { id: 'transit', label: 'Transit', icon: '📦' },
                { id: 'delivered', label: 'Delivered', icon: '✅' },
              ].map((s, i, arr) => {
                const states = ['pickup', 'transit', 'delivered'];
                const current = states.indexOf(trackPhase);
                const isActive = i <= current;
                return (
                  <React.Fragment key={s.id}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isActive ? '#1B5E20' : 'var(--bg-secondary)', border: `2px solid ${isActive ? '#1B5E20' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, transition: 'all 0.4s' }}>
                        {s.icon}
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? '#1B5E20' : 'var(--text-muted)' }}>{s.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ flex: 1, height: 3, backgroundColor: i < current ? '#1B5E20' : 'var(--border)', borderRadius: 2, margin: '0 4px', marginBottom: 16, transition: 'background 0.5s' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Rider Info */}
            <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#1B5E20', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                {selectedDriver.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>{selectedDriver.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>GetGo Bike Courier · {selectedDriver.vehicleNo}</div>
                <div style={{ fontSize: 12, color: '#1B5E20', fontWeight: 600 }}>⭐ {selectedDriver.rating} · {selectedDriver.trips} deliveries</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1B5E20' }}>₹{calculatedFare}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paymentMethod.label}</div>
              </div>
            </div>

            {/* Delivery OTP */}
            <div style={{ padding: 14, border: '2px dashed var(--brand-green)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Delivery OTP</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#1B5E20', letterSpacing: 8, marginTop: 4 }}>{deliveryOtp}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Share with rider on delivery</div>
              </div>
              <Package size={32} color="#1B5E20" />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              {trackPhase === 'delivered' && (
                <button className="btn-primary" style={{ flex: 1 }} onClick={() => navigate('/')}>Back to Home</button>
              )}
              {trackPhase !== 'delivered' && (
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/')}>Track Later</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Select Payment</h2>
              <button onClick={() => setShowPayModal(false)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}><X size={18} /></button>
            </div>
            {PAYMENT_METHODS.map(pm => {
              const isSel = paymentMethod.id === pm.id;
              return (
                <div key={pm.id} onClick={() => { setPaymentMethod(pm); setShowPayModal(false); }}
                  style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderRadius: 'var(--radius-md)', border: `2px solid ${isSel ? '#1B5E20' : 'var(--border)'}`, backgroundColor: isSel ? 'var(--brand-green-tint)' : 'var(--bg-surface)' }}>
                  <span style={{ fontSize: 20 }}>{pm.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{pm.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pm.detail}</div>
                  </div>
                  {isSel && <Check size={18} color="#1B5E20" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
