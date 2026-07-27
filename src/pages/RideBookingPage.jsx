import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../App';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_DRIVERS, VEHICLE_CATEGORIES, SAVED_ADDRESSES, PAYMENT_METHODS, CHENNAI_LOCATIONS } from '../data/mockData';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createVehicleIcon = (emoji) => L.divIcon({
  className: '',
  html: `<div style="background:#00A651;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4);animation:markerPulse 2s infinite">${emoji}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const PICKUP_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#2563EB;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});
const DROP_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#EF4444;width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

const STEPS = ['location', 'vehicle', 'drivers', 'confirm', 'tracking'];

const VEHICLE_ICONS = { bike: '🏍️', auto: '🛺', car: '🚗', van: '🚐' };

function MapController({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center]);
  return null;
}

export default function RideBookingPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState('location');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [revealedDriver, setRevealedDriver] = useState(null);
  const [bookForOther, setBookForOther] = useState(false);
  const [otherName, setOtherName] = useState('');
  const [otherPhone, setOtherPhone] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [tracking, setTracking] = useState({ status: 'searching', eta: null, driverPos: null });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [driverPos, setDriverPos] = useState(null);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [tripCompleted, setTripCompleted] = useState(false);
  const [activeTrip, setActiveTrip] = useState(null);
  const trackingRef = useRef(null);

  const vehicleDrivers = useMemo(() => {
    if (!selectedVehicle) return [];
    return MOCK_DRIVERS.filter(d => d.vehicle === selectedVehicle)
      .sort((a, b) => a.rate - b.rate);
  }, [selectedVehicle]);

  const estimatedFare = useMemo(() => {
    if (!selectedDriver || !dropCoords) return null;
    const dist = Math.sqrt(
      Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) +
      Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)
    );
    return Math.round(dist * selectedDriver.rate + 15);
  }, [selectedDriver, dropCoords, pickupCoords]);

  const handleSearch = (query, field) => {
    if (!query) { setSearchSuggestions([]); return; }
    const results = CHENNAI_LOCATIONS.filter(l =>
      l.name.toLowerCase().includes(query.toLowerCase())
    );
    setSearchSuggestions(results.slice(0, 5));
    setActiveField(field);
  };

  const selectLocation = (loc, field) => {
    if (field === 'pickup') {
      setPickup(loc.name);
      setPickupCoords({ lat: loc.lat, lng: loc.lng });
    } else {
      setDropoff(loc.name);
      setDropCoords({ lat: loc.lat, lng: loc.lng });
    }
    setSearchSuggestions([]);
    setActiveField(null);
  };

  const startTracking = (driver) => {
    setRevealedDriver(driver);
    setDriverPos({ ...driver.pos });
    setTracking({ status: 'arriving', eta: Math.floor(Math.random() * 5) + 3 });

    let eta = Math.floor(Math.random() * 5) + 3;
    trackingRef.current = setInterval(() => {
      setTracking(prev => {
        const newEta = Math.max(0, (prev.eta || eta) - 1);
        if (newEta === 0) {
          clearInterval(trackingRef.current);
          return { ...prev, status: 'arrived', eta: 0 };
        }
        return { ...prev, eta: newEta };
      });
      // Animate driver moving toward pickup
      setDriverPos(prev => ({
        lat: prev.lat + (pickupCoords.lat - prev.lat) * 0.15,
        lng: prev.lng + (pickupCoords.lng - prev.lng) * 0.15,
      }));
    }, 2000);
  };

  useEffect(() => () => clearInterval(trackingRef.current), []);

  // ── STEP: LOCATION ──
  if (step === 'location') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="top-bar-title">{t('bookRideTitle')}</span>
      </div>

      {/* Map */}
      <div style={{ flex: '0 0 220px', position: 'relative' }}>
        <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController center={[pickupCoords.lat, pickupCoords.lng]} />
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_ICON} />
          {dropCoords && <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_ICON} />}
          {MOCK_DRIVERS.slice(0, 10).map(d => (
            <Marker key={d.id} position={[d.pos.lat, d.pos.lng]} icon={createVehicleIcon(VEHICLE_ICONS[d.vehicle])}>
              <Popup>{d.vehicle} · ⭐ {d.rating}</Popup>
            </Marker>
          ))}
        </MapContainer>
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(15,17,23,0.85)', borderRadius: 8, padding: '4px 10px', fontSize: '0.6875rem', color: '#9CA3AF', zIndex: 1000 }}>
          Live vehicles on map
        </div>
      </div>

      {/* Hero Banner & Inputs */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 95, position: 'relative', border: '1.5px solid rgba(0,166,81,0.3)', boxShadow: 'var(--shadow-md)', flexShrink: 0 }}>
          <img src="assets/ride_banner.png" alt="Book Ride" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.0625rem', color: '#fff' }}>Instant City Rides</div>
            <div style={{ fontSize: '0.75rem', color: '#00A651', fontWeight: 600, marginTop: 2 }}>⚡ Fast Bike & Auto Pickups · Flat Rate</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Pickup */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#2563EB', border: '2px solid #fff', zIndex: 1 }} />
            <input
              id="pickup-input"
              className="input-field"
              style={{ paddingLeft: 36 }}
              placeholder={t('pickupPlaceholder')}
              value={pickup}
              onChange={e => { setPickup(e.target.value); handleSearch(e.target.value, 'pickup'); }}
              onFocus={() => setActiveField('pickup')}
            />
            {activeField === 'pickup' && searchSuggestions.length > 0 && (
              <Suggestions list={searchSuggestions} onSelect={loc => selectLocation(loc, 'pickup')} />
            )}
          </div>
          {/* Line connector */}
          <div style={{ width: 2, height: 10, background: 'var(--border)', marginLeft: 18 }} />
          {/* Dropoff */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#EF4444', border: '2px solid #fff', zIndex: 1 }} />
            <input
              id="dropoff-input"
              className="input-field"
              style={{ paddingLeft: 36 }}
              placeholder={t('dropoffPlaceholder')}
              value={dropoff}
              onChange={e => { setDropoff(e.target.value); handleSearch(e.target.value, 'dropoff'); }}
              onFocus={() => setActiveField('dropoff')}
            />
            {activeField === 'dropoff' && searchSuggestions.length > 0 && (
              <Suggestions list={searchSuggestions} onSelect={loc => selectLocation(loc, 'dropoff')} />
            )}
          </div>
        </div>

        {/* Book for Others Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Book for someone else</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Add passenger details</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={bookForOther} onChange={e => setBookForOther(e.target.checked)} />
            <span className="toggle-slider" />
          </label>
        </div>
        {bookForOther && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'slideUp 0.25s ease' }}>
            <input id="other-name" className="input-field" placeholder="Passenger name" value={otherName} onChange={e => setOtherName(e.target.value)} />
            <input id="other-phone" className="input-field" placeholder="Passenger phone" type="tel" value={otherPhone} onChange={e => setOtherPhone(e.target.value)} />
          </div>
        )}

        {/* Saved addresses quick pick */}
        <div className="scroll-row">
          {SAVED_ADDRESSES.map(a => (
            <button key={a.id} onClick={() => { setDropoff(a.address); setDropCoords({ lat: a.lat, lng: a.lng }); }}
              style={{ flexShrink: 0, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, padding: '6px 14px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>

        <button
          id="choose-vehicle-btn"
          className="btn btn-primary"
          disabled={!pickup || !dropoff}
          onClick={() => { if (pickup && dropoff) setStep('vehicle'); }}
        >
          {t('chooseVehicle')}
        </button>
      </div>
    </div>
  );

  // ── STEP: VEHICLE ──
  if (step === 'vehicle') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => setStep('location')}>←</button>
        <span className="top-bar-title">{t('chooseVehicle').replace(' →', '')}</span>
      </div>
      <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span style={{ fontWeight: 600, color: '#2563EB' }}>📍</span> {pickup} → <span style={{ fontWeight: 600, color: '#EF4444' }}>📍</span> {dropoff}
        </div>

        <div className="section-title">{t('selectVehicleType')}</div>
        <div className="vehicle-grid">
          {VEHICLE_CATEGORIES.map(cat => (
            <div key={cat.id} id={`vehicle-${cat.id}`} className={`vehicle-cat-btn ${selectedVehicle === cat.id ? 'selected' : ''}`} onClick={() => setSelectedVehicle(cat.id)}>
              <div style={{ width: 50, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                )}
              </div>
              <div className="vehicle-cat-label">{cat.label}</div>
              <div className="vehicle-cat-capacity">{cat.description}</div>
              <div style={{ fontSize: '0.625rem', color: 'var(--brand-green)', fontWeight: 600, marginTop: 2 }}>from ₹{cat.baseRate}/km</div>
            </div>
          ))}
        </div>

        {selectedVehicle && (
          <div style={{ animation: 'slideUp 0.25s ease' }}>
            <div className="section-title">Available nearby ({vehicleDrivers.length})</div>
            {vehicleDrivers.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>😔</div>
                <div style={{ fontWeight: 600 }}>No vehicles available right now</div>
                <div style={{ fontSize: '0.8125rem', marginTop: 4 }}>We'll auto-assign the nearest available driver</div>
              </div>
            ) : (
              <div className="scroll-list">
                {vehicleDrivers.map(d => (
                  <AnonymousDriverCard
                    key={d.id}
                    driver={d}
                    selected={selectedDriver?.id === d.id}
                    onSelect={() => setSelectedDriver(d)}
                    dropCoords={dropCoords}
                    pickupCoords={pickupCoords}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <button
          id="confirm-driver-btn"
          className="btn btn-primary"
          disabled={!selectedDriver && vehicleDrivers.length > 0}
          onClick={() => {
            if (vehicleDrivers.length === 0 || selectedDriver) setStep('confirm');
          }}
        >
          {selectedDriver ? 'Confirm Selection →' : vehicleDrivers.length === 0 ? 'Auto-Assign Driver →' : 'Select a Driver First'}
        </button>
      </div>
    </div>
  );

  // ── STEP: CONFIRM ──
  if (step === 'confirm') {
    const driver = selectedDriver || vehicleDrivers[0] || MOCK_DRIVERS[0];
    const pLat = pickupCoords?.lat ?? 13.0827;
    const pLng = pickupCoords?.lng ?? 80.2707;
    const dLat = dropCoords?.lat ?? 13.0418;
    const dLng = dropCoords?.lng ?? 80.2341;

    const rawDist = Math.sqrt(
      Math.pow((dLat - pLat) * 111, 2) +
      Math.pow((dLng - pLng) * 111, 2)
    );
    const distNum = isNaN(rawDist) || rawDist <= 0 ? 5.2 : Math.max(1.5, Math.round(rawDist * 10) / 10);
    const distStr = distNum.toFixed(1);
    const etaMin = Math.max(4, Math.round(distNum * 3));
    const fare = Math.round(distNum * (driver?.rate || 12) + 15);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="top-bar">
          <button className="back-btn" onClick={() => setStep('vehicle')}>←</button>
          <span className="top-bar-title">Confirm Booking</span>
        </div>
        <div style={{ flex: 1, padding: 16, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Anonymous driver preview */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)', padding: 20, textAlign: 'center' }}>
            <div style={{ width: 70, height: 48, margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={VEHICLE_CATEGORIES.find(c => c.id === (selectedVehicle || 'car'))?.image || 'assets/car.png'} alt="Vehicle" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
            </div>
            <div style={{ fontFamily: 'Poppins', fontSize: '1.0625rem', fontWeight: 700 }}>Driver assigned</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>Identity revealed after confirmation</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating</div>
                <div style={{ fontWeight: 700, color: 'var(--gold)', fontSize: '1rem' }}>⭐ {driver.rating}</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate</div>
                <div style={{ fontWeight: 700, color: 'var(--brand-green)', fontSize: '1rem' }}>₹{driver.rate}/km</div>
              </div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vehicle</div>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{driver.vehicleModel}</div>
              </div>
            </div>
          </div>

          {/* Trip details */}
          <div className="card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <RouteRow icon="📍" color="#2563EB" label="Pickup" value={pickup || 'Chennai Central Station'} />
              <div style={{ borderLeft: '2px dashed var(--border)', marginLeft: 11, paddingLeft: 16, height: 8 }} />
              <RouteRow icon="📍" color="#EF4444" label="Drop-off" value={dropoff || 'Anna Nagar'} />
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Distance · Duration</div>
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, marginTop: 2 }}>{distStr} km · ~{etaMin} min</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Fare</div>
                <div style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-green)' }}>₹{fare}</div>
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div
            id="payment-method-card"
            className="card"
            onClick={() => setShowPaymentSelector(true)}
            style={{ cursor: 'pointer', transition: 'var(--transition)' }}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Payment Method</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--brand-green)', fontWeight: 700 }}>Tap to Change</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '1.75rem' }}>{paymentMethod.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {paymentMethod.label}
                    {paymentMethod.type === 'cod' && <span className="badge badge-gold">Cash</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{paymentMethod.detail}</div>
                </div>
              </div>
              <button
                id="change-payment-btn"
                onClick={(e) => { e.stopPropagation(); setShowPaymentSelector(true); }}
                style={{ fontSize: '0.8125rem', color: 'var(--brand-green)', fontWeight: 700, background: 'rgba(0,166,81,0.1)', border: '1px solid rgba(0,166,81,0.3)', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
              >
                Change ✏️
              </button>
            </div>
          </div>

          <button
            id="book-confirm-btn"
            className="btn btn-gold"
            onClick={() => {
              setIsDispatching(true);
              setTimeout(() => {
                setIsDispatching(false);
                const assigned = revealedDriver || driver;
                setActiveTrip({
                  id: `trip_${Date.now()}`,
                  driver: assigned,
                  pickup: pickup || 'Chennai Central Station',
                  dropoff: dropoff || 'Anna Nagar',
                  fare,
                  paymentMethod: paymentMethod.label,
                  status: 'arriving',
                });
                setStep('tracking');
                startTracking(assigned);
              }, 1200);
            }}
          >
            Confirm Booking — ₹{fare}
          </button>

          {/* Dispatch Animation Overlay */}
          {isDispatching && (
            <div style={{ position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'bounce 1s infinite' }}>🚕</div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.25rem' }}>GetGo Ride Dispatch System</div>
              <div style={{ fontSize: '0.875rem', color: '#00A651', fontWeight: 700, marginTop: 4 }}>Connecting Driver #GETGO-{Math.floor(10000 + Math.random() * 90000)}</div>
              <div style={{ width: '100%', maxWidth: 260, height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginTop: 24, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#00A651', width: '100%', animation: 'shimmer 1.2s ease-in-out' }} />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginTop: 12 }}>Allocating verified driver & generating trip OTP...</div>
            </div>
          )}

          {/* Payment Method Selector Bottom Sheet */}
          {showPaymentSelector && (
            <div
              className="bottom-sheet-overlay"
              onClick={() => setShowPaymentSelector(false)}
              style={{ position: 'fixed', inset: 0, zIndex: 3000, maxWidth: 'var(--mobile-max)', margin: '0 auto' }}
            >
              <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ padding: '16px 20px 32px' }}>
                <div className="bottom-sheet-handle" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0 16px' }}>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.125rem' }}>Select Payment Method</div>
                  <button onClick={() => setShowPaymentSelector(false)} style={{ background: 'var(--bg-input)', border: 'none', borderRadius: 8, padding: '4px 10px', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {PAYMENT_METHODS.map(pm => (
                    <div
                      key={pm.id}
                      id={`select-pm-${pm.id}`}
                      onClick={() => { setPaymentMethod(pm); setShowPaymentSelector(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 16px',
                        background: paymentMethod.id === pm.id ? 'rgba(0,166,81,0.08)' : 'var(--bg-card)',
                        border: `1.5px solid ${paymentMethod.id === pm.id ? 'var(--brand-green)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                      }}
                    >
                      <span style={{ fontSize: '1.75rem' }}>{pm.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {pm.label}
                          {pm.type === 'cod' && <span className="badge badge-gold">Cash</span>}
                          {pm.default && <span className="badge badge-green">Default</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{pm.detail}</div>
                      </div>
                      {paymentMethod.id === pm.id && <span style={{ color: 'var(--brand-green)', fontWeight: 800, fontSize: '1.25rem' }}>✓</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Driver identity revealed after confirmation · No hidden charges
          </p>
        </div>
      </div>
    );
  }

  // ── STEP: TRACKING ──
  if (step === 'tracking') return (
    <TrackingScreen
      driver={revealedDriver}
      pickup={pickup}
      dropoff={dropoff}
      tracking={tracking}
      driverPos={driverPos}
      pickupCoords={pickupCoords}
      onChat={() => navigate('/chat')}
      onCancel={() => { clearInterval(trackingRef.current); navigate('/'); }}
      vehicleIcon={VEHICLE_ICONS[selectedVehicle || 'car']}
    />
  );

  return null;
}

function AnonymousDriverCard({ driver, selected, onSelect, dropCoords, pickupCoords }) {
  const dist = dropCoords ? Math.sqrt(
    Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) +
    Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)
  ).toFixed(1) : '?';
  const fare = dropCoords ? Math.round(dist * driver.rate + 15) : null;
  const etaMin = Math.floor(Math.random() * 8 + 2);

  return (
    <div id={`driver-card-${driver.id}`} className={`driver-card ${selected ? 'selected' : ''}`} onClick={onSelect}>
      <div className="driver-vehicle-icon" style={{ width: 46, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-input)', borderRadius: 10, padding: 4 }}>
        <img src={`assets/${driver.vehicle}.png`} alt={driver.vehicle} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
      </div>
      <div className="driver-info">
        <div className="driver-vehicle-type">{driver.vehicleModel}</div>
        <div className="driver-vehicle-model">{driver.color} · {driver.vehicleNo}</div>
        <div className="driver-meta">
          <span className="rating-badge">⭐ {driver.rating}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {driver.trips} trips</span>
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className="driver-rate">₹{driver.rate}/km</div>
        {fare && <div style={{ fontSize: '0.75rem', color: 'var(--brand-green)', fontWeight: 600 }}>~₹{fare}</div>}
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>{etaMin} min away</div>
      </div>
      {selected && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}>✓</div>}
    </div>
  );
}

function RouteRow({ icon, color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#fff', flexShrink: 0, marginTop: 1 }}>●</div>
      <div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function Suggestions({ list, onSelect }) {
  return (
    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginTop: 4, zIndex: 999, overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
      {list.map((loc, i) => (
        <div key={i} onClick={() => onSelect(loc)} style={{ padding: '10px 14px', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ color: 'var(--text-muted)' }}>📍</span> {loc.name}
        </div>
      ))}
    </div>
  );
}

function TrackingScreen({ driver, pickup, dropoff, tracking, driverPos, pickupCoords, onChat, onCancel, vehicleIcon }) {
  const navigate = useNavigate();
  const [rideState, setRideState] = useState('arriving'); // 'arriving' | 'onTrip' | 'completed'
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const otpCode = "4 8 2 9";

  const statusMsg = {
    arriving: `🚗 Driver en route · Arriving in ${tracking.eta || 3} mins`,
    onTrip: '🛣️ Trip in Progress · En route to destination',
    completed: '✅ Trip Completed · Official E-Receipt Ready',
  }[rideState];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <span className="top-bar-title">Live Tracking</span>
        <button id="chat-btn" onClick={onChat} style={{ background: 'var(--brand-green)', border: 'none', color: '#fff', borderRadius: 20, padding: '6px 14px', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          💬 Chat
        </button>
      </div>

      {/* Security OTP Banner */}
      <div style={{ background: '#0F172A', color: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security OTP</div>
        <div style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.2em', color: '#FFD700' }}>{otpCode}</div>
      </div>

      {/* Map */}
      <div style={{ flex: '0 0 260px', position: 'relative' }}>
        <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_ICON} />
          {driverPos && (
            <Marker position={[driverPos.lat, driverPos.lng]} icon={L.divIcon({
              className: '',
              html: `<div style="background:#00A651;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,166,81,0.5)">${vehicleIcon}</div>`,
              iconSize: [40, 40], iconAnchor: [20, 20],
            })} />
          )}
        </MapContainer>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(15,17,23,0.95))', padding: '24px 16px 10px', zIndex: 1000 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#fff' }}>{statusMsg}</div>
        </div>
      </div>

      {/* Driver & Trip Details */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {driver && (
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--brand-green)', padding: 16, display: 'flex', gap: 14 }}>
            <div style={{ width: 56, height: 56, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid var(--brand-green)', overflow: 'hidden' }}>
              {driver.photo ? (
                <img src={driver.photo} alt={driver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: '1.75rem' }}>{vehicleIcon}</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.0625rem' }}>{driver.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>{driver.vehicleModel} · {driver.vehicleNo}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <span className="rating-badge">⭐ {driver.rating}</span>
                <span className="badge badge-green">✓ Verified Driver</span>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <RouteRow icon="📍" color="#2563EB" label="Pickup" value={pickup || 'Chennai Central Station'} />
          <div style={{ borderLeft: '2px dashed var(--border)', marginLeft: 11, height: 10, marginTop: 4, marginBottom: 4 }} />
          <RouteRow icon="📍" color="#EF4444" label="Drop-off" value={dropoff || 'Anna Nagar'} />
        </div>

        {/* Real-time Order Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rideState === 'arriving' && (
            <button
              id="start-ride-btn"
              className="btn btn-primary"
              onClick={() => setRideState('onTrip')}
            >
              🟢 Start Ride (Driver Picked Up)
            </button>
          )}

          {rideState === 'onTrip' && (
            <button
              id="complete-ride-btn"
              className="btn btn-gold"
              onClick={() => { setRideState('completed'); setShowReceiptModal(true); }}
            >
              🏁 Finish Ride & Generate Tax Receipt
            </button>
          )}

          {rideState === 'completed' && (
            <button
              id="view-receipt-btn"
              className="btn btn-primary"
              onClick={() => setShowReceiptModal(true)}
            >
              🧾 View E-Receipt & Invoice
            </button>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button id="sos-btn" style={{ flex: 1, background: 'rgba(239,68,68,0.15)', border: '1.5px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', padding: '12px', color: '#F87171', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
              🆘 SOS Emergency
            </button>
            <button onClick={onCancel} style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
              ✕ End Session
            </button>
          </div>
        </div>
      </div>

      {/* GetGo Ride E-Receipt Modal */}
      {showReceiptModal && (
        <div className="bottom-sheet-overlay" onClick={() => setShowReceiptModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 4000, maxWidth: 'var(--mobile-max)', margin: '0 auto' }}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()} style={{ padding: '20px' }}>
            <div className="bottom-sheet-handle" />
            <div style={{ textAlign: 'center', margin: '8px 0 16px' }}>
              <div style={{ fontSize: '2rem' }}>🧾</div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.125rem', marginTop: 4 }}>GetGo Ride Network</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--brand-green)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Trip E-Receipt & Invoice</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: 2 }}>Receipt No: GETGO-2026-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>

            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Date & Time</span><span style={{ fontWeight: 600 }}>{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Assigned Driver</span><span style={{ fontWeight: 600 }}>{driver?.name || 'Venkatesh S'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Vehicle Reg.</span><span style={{ fontWeight: 600 }}>{driver?.vehicleNo || 'TN-01-AB-4592'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Platform Fee</span><span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>₹0.00 (Driver 100% Payout)</span></div>
              <div className="divider" style={{ margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700 }}>Total Paid</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.375rem', color: 'var(--brand-green)' }}>₹{driver?.rate ? Math.round(5.2 * driver.rate + 15) : 77}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
              <button
                className="btn btn-primary"
                onClick={() => {
                  alert('📄 PDF E-Receipt Downloaded to your device!');
                }}
              >
                🖨️ Download Trip Receipt (PDF)
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setShowReceiptModal(false);
                  navigate('/');
                }}
              >
                ⭐ Rate Driver & Return Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
