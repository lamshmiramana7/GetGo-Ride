import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zap, Car, MapPin, ArrowLeft, Check, Phone, CreditCard, X, ChevronRight, Star, ShieldCheck, UserCheck, Navigation } from 'lucide-react';
import { MOCK_DRIVERS, PAYMENT_METHODS, INDIAN_GEOGRAPHY, VEHICLE_CATEGORIES } from '../data/mockData';
import { VEHICLE_BASE64 } from '../assets/vehicleBase64';
import { DRIVER_AVATAR_BASE64 } from '../assets/mediaBase64';
import { useLanguage, useLocation } from '../App';

const VEHICLE_IMAGES = VEHICLE_BASE64;

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PICKUP_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#2563EB;width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});
const DROP_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#DC2626;width:16px;height:16px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  iconSize: [16, 16], iconAnchor: [8, 8],
});

function MapController({ center, zoom = 13 }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, zoom); }, [center, zoom]);
  return null;
}

// Driver car icon for map
const driverCarIcon = L.divIcon({
  className: '',
  html: `<div style="background:#1B5E20;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.35);font-size:18px">🚗</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const pickupMapIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative"><svg viewBox='0 0 36 48' width='36' height='48' xmlns='http://www.w3.org/2000/svg'><path d='M18 0C8.06 0 0 8.06 0 18c0 13 16 29.5 17.4 31a1 1 0 001.2 0C20 47.5 36 31 36 18 36 8.06 27.94 0 18 0z' fill='#2563EB'/><circle cx='18' cy='18' r='8' fill='white'/></svg></div>`,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
});

const dropMapIcon = L.divIcon({
  className: '',
  html: `<div style="position:relative"><svg viewBox='0 0 36 48' width='36' height='48' xmlns='http://www.w3.org/2000/svg'><path d='M18 0C8.06 0 0 8.06 0 18c0 13 16 29.5 17.4 31a1 1 0 001.2 0C20 47.5 36 31 36 18 36 8.06 27.94 0 18 0z' fill='#DC2626'/><circle cx='18' cy='18' r='8' fill='white'/></svg></div>`,
  iconSize: [36, 48],
  iconAnchor: [18, 48],
});

export default function RideBookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { userLocation } = useLocation();

  const [step, setStep] = useState('location'); // 'location' | 'vehicle' | 'driver' | 'confirm' | 'tracking'
  const [pickup, setPickup] = useState(userLocation);
  const [dropoff, setDropoff] = useState(searchParams.get('destination') || 'T. Nagar, Chennai');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords] = useState({ lat: 13.0418, lng: 80.2341 });
  const [selectedCategory, setSelectedCategory] = useState('car');
  const [selectedDriver, setSelectedDriver] = useState(MOCK_DRIVERS[6]); // default sedan driver
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  // Available drivers for chosen vehicle category
  const availableDrivers = useMemo(() => {
    return MOCK_DRIVERS.filter(d => d.vehicle === selectedCategory);
  }, [selectedCategory]);

  // Calculate Distance in KM
  const calculatedDistance = useMemo(() => {
    if (!dropCoords || !pickupCoords) return 7.5;
    const dist = Math.sqrt(
      Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) +
      Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)
    );
    return Math.max(2.5, Math.round(dist * 10) / 10);
  }, [pickupCoords, dropCoords]);

  // Calculate Accurate Total Fare based on Selected Driver's Per-KM Rate
  const fareBreakdown = useMemo(() => {
    const categoryInfo = VEHICLE_CATEGORIES.find(c => c.id === selectedCategory) || VEHICLE_CATEGORIES[2];
    const baseRate = categoryInfo.baseRate;
    const perKmRate = selectedDriver ? selectedDriver.perKmRate : categoryInfo.perKmRate;
    const distanceFare = Math.round(calculatedDistance * perKmRate);
    const total = baseRate + distanceFare;

    return {
      baseRate,
      perKmRate,
      distanceKm: calculatedDistance,
      distanceFare,
      totalFare: total,
    };
  }, [selectedCategory, selectedDriver, calculatedDistance]);

  const handleConfirmBooking = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setStep('tracking');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn-secondary"
          onClick={() => {
            if (step === 'location') navigate('/');
            else if (step === 'vehicle') setStep('location');
            else if (step === 'driver') setStep('vehicle');
            else if (step === 'confirm') setStep('driver');
            else setStep('confirm');
          }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
            {t('bookRide') || 'Book a City Ride'}
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Instant Bike, Auto, Sedan & XL Van Pickups
          </p>
        </div>
      </div>

      {/* ── STEP 1: PICKUP & DROPOFF LOCATION ── */}
      {step === 'location' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* LIVE MAP — shows pickup + drop pins */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <MapContainer
              center={[pickupCoords.lat, pickupCoords.lng]}
              zoom={13}
              style={{ height: 260, width: '100%' }}
              scrollWheelZoom={false}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              <MapController center={[pickupCoords.lat, pickupCoords.lng]} />
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupMapIcon} />
              <Marker position={[dropCoords.lat, dropCoords.lng]} icon={dropMapIcon} />
              <Polyline
                positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]}
                pathOptions={{ color: '#1B5E20', weight: 3, opacity: 0.7, dashArray: '8 5' }}
              />
            </MapContainer>
            <div style={{ padding: '8px 14px', backgroundColor: 'var(--bg-secondary)', display: 'flex', gap: 16, fontSize: 12 }}>
              <span>🔵 <strong>Pickup:</strong> {pickup}</span>
              <span>🔴 <strong>Drop:</strong> {dropoff}</span>
            </div>
          </div>

          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>1. Pickup & Destination</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Pickup Location</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={18} color="#2563EB" style={{ position: 'absolute', left: 14 }} />
                  <input className="input-field" placeholder="Enter pickup address" value={pickup} onChange={e => setPickup(e.target.value)} style={{ paddingLeft: 42 }} />
                </div>
              </div>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Destination Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={18} color="#DC2626" style={{ position: 'absolute', left: 14 }} />
                  <input className="input-field" placeholder="Enter destination address" value={dropoff} onChange={e => setDropoff(e.target.value)} style={{ paddingLeft: 42 }} />
                </div>
              </div>
            </div>

            <div>
              <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Popular Destinations</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['T. Nagar, Chennai', 'Chennai Airport', 'Central Railway Station', 'OMR Tech Park', 'Tambaram Bus Stand'].map(loc => (
                  <button key={loc} onClick={() => setDropoff(loc)} className={dropoff === loc ? 'badge-flat-green' : 'badge-flat'} style={{ cursor: 'pointer', fontSize: 13 }}>{loc}</button>
                ))}
              </div>
            </div>

            <button className="btn-primary" onClick={() => setStep('vehicle')} disabled={!pickup.trim() || !dropoff.trim()}>
              Choose Vehicle Category →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: CHOOSE VEHICLE CATEGORY (No Unprofessional Banner per Image 4) ── */}
      {step === 'vehicle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flat-card" style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>From:</span> <strong>{pickup}</strong><br />
              <span style={{ color: 'var(--text-muted)' }}>To:</span> <strong>{dropoff}</strong>
            </div>
            <button className="btn-text" onClick={() => setStep('location')} style={{ fontSize: 13 }}>Change</button>
          </div>

          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>2. Select Vehicle Type</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {VEHICLE_CATEGORIES.map(cat => {
              const isSel = selectedCategory === cat.id;
              return (
                <div
                  key={cat.id}
                  className={isSel ? 'flat-card-selected' : 'flat-card-interactive'}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                >
                  <div style={{ fontSize: 32 }}>{cat.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="text-subtitle" style={{ color: 'var(--text-primary)', fontSize: 16 }}>{cat.label}</div>
                    <div className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{cat.description}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-green-text)', marginTop: 4 }}>
                      Starts at ₹{cat.baseRate} + ₹{cat.perKmRate}/km
                    </div>
                  </div>
                  {isSel && <Check size={20} color="var(--brand-green-text)" />}
                </div>
              );
            })}
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              const firstDriver = availableDrivers[0] || MOCK_DRIVERS[0];
              setSelectedDriver(firstDriver);
              setStep('driver');
            }}
          >
            View Available Drivers →
          </button>
        </div>
      )}

      {/* ── STEP 3: CHOOSE PREFERRED DRIVER & VEHICLE ── */}
      {step === 'driver' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>3. Choose Preferred Driver / Vehicle</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
              Nearby available drivers for {selectedCategory.toUpperCase()} near {pickup}
            </p>
          </div>

          {/* DRIVER LOCATIONS MAP */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={13} style={{ height: 220, width: '100%' }} scrollWheelZoom={false}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              {/* Pickup marker */}
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupMapIcon} />
              {/* Nearby driver pins (offset randomly around pickup) */}
              {availableDrivers.slice(0, 4).map((dr, i) => {
                const offsets = [[0.008, 0.012], [-0.010, 0.007], [0.005, -0.014], [-0.006, -0.009]];
                const pos = [pickupCoords.lat + (offsets[i] || [0, 0])[0], pickupCoords.lng + (offsets[i] || [0, 0])[1]];
                const carIcon = L.divIcon({
                  className: '',
                  html: `<div style="background:${selectedDriver?.id === dr.id ? '#1B5E20' : '#374151'};border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:16px">🚗</div>`,
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                });
                return <Marker key={dr.id} position={pos} icon={carIcon} />;
              })}
            </MapContainer>
            <div style={{ padding: '6px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)' }}>
              🟢 Green = selected driver · ⚫ Grey = other nearby drivers · 🔵 Blue = your pickup
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {availableDrivers.map(dr => {
              const isSel = selectedDriver?.id === dr.id;
              const fareCalc = Math.round(calculatedDistance * dr.perKmRate + VEHICLE_CATEGORIES.find(c => c.id === selectedCategory).baseRate);

              return (
                <div
                  key={dr.id}
                  className={isSel ? 'flat-card-selected' : 'flat-card-interactive'}
                  onClick={() => setSelectedDriver(dr)}
                  style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand-green)', flexShrink: 0 }}>
                        <img src={DRIVER_AVATAR_BASE64} alt={dr.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div className="text-body-medium" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
                          {dr.name} <UserCheck size={14} color="var(--brand-green-text)" />
                        </div>
                        <div className="text-caption" style={{ color: 'var(--text-muted)' }}>
                          {dr.vehicleModel} · <strong style={{ color: 'var(--text-primary)' }}>{dr.vehicleNo}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12 }}>
                          <span style={{ color: '#F59E0B', fontWeight: 700 }}>★ {dr.rating}</span>
                          <span style={{ color: 'var(--text-muted)' }}>({dr.trips} trips)</span>
                          <span style={{ color: 'var(--brand-green-text)', fontWeight: 600 }}>{dr.distanceKm} km away</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-green-text)' }}>
                        ₹{fareCalc}
                      </div>
                      <div className="badge-flat-green" style={{ fontSize: 11, marginTop: 2 }}>
                        ₹{dr.perKmRate}/km rate
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn-primary" onClick={() => setStep('confirm')}>
            Review Fare & Confirm Booking →
          </button>
        </div>
      )}

      {/* ── STEP 4: FARE BREAKDOWN & CONFIRM BOOKING ── */}
      {step === 'confirm' && selectedDriver && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>4. Review & Confirm Ride</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Clear breakdown of per-km rates & fees before booking</p>
          </div>

          {/* Selected Driver Summary */}
          <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--brand-green)' }}>
              <img src={DRIVER_AVATAR_BASE64} alt={selectedDriver.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedDriver.name} ({selectedDriver.rating} ★)</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedDriver.vehicleModel} · {selectedDriver.vehicleNo}</div>
            </div>
            <span className="badge-flat-green" style={{ fontSize: 12 }}>₹{selectedDriver.perKmRate}/km</span>
          </div>

          {/* Transparent Fare Breakdown */}
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Base Category Charge</span>
              <span style={{ fontWeight: 600 }}>₹{fareBreakdown.baseRate}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Distance Rate ({fareBreakdown.distanceKm} km × ₹{fareBreakdown.perKmRate}/km)</span>
              <span style={{ fontWeight: 600 }}>₹{fareBreakdown.distanceFare}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
              <span>Total Payable Fare</span>
              <span style={{ color: 'var(--brand-green-text)', fontSize: 20 }}>₹{fareBreakdown.totalFare}</span>
            </div>
          </div>

          {/* Payment Selector Button */}
          <div
            onClick={() => setShowPaymentModal(true)}
            style={{ padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <CreditCard size={20} color="var(--brand-green-text)" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>Payment: {paymentMethod.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{paymentMethod.detail}</div>
              </div>
            </div>
            <button className="btn-text" style={{ fontSize: 12 }}>Change</button>
          </div>

          <button
            className="btn-primary"
            onClick={handleConfirmBooking}
            disabled={isDispatching}
            style={{ height: 50, fontSize: 16, fontWeight: 700 }}
          >
            {isDispatching ? 'Connecting to Driver…' : `Confirm Booking — ₹${fareBreakdown.totalFare}`}
          </button>
        </div>
      )}

      {/* ── STEP 5: LIVE RIDE TRACKING ── */}
      {step === 'tracking' && selectedDriver && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* LIVE TRACKING MAP */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '2px solid var(--brand-green)', boxShadow: 'var(--shadow-flat)' }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            <div style={{ backgroundColor: '#1B5E20', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
              <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700 }}>🚗 LIVE — {selectedDriver.name} is heading to your pickup</span>
            </div>
            <MapContainer
              center={[pickupCoords.lat + 0.005, pickupCoords.lng + 0.008]}
              zoom={14}
              style={{ height: 300, width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              {/* Your pickup (blue) */}
              <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupMapIcon} />
              {/* Your drop (red) */}
              <Marker position={[dropCoords.lat, dropCoords.lng]} icon={dropMapIcon} />
              {/* Driver (green car, slightly offset approaching pickup) */}
              <Marker
                position={[pickupCoords.lat + 0.009, pickupCoords.lng + 0.011]}
                icon={driverCarIcon}
              />
              {/* Route line pickup → drop */}
              <Polyline
                positions={[[pickupCoords.lat, pickupCoords.lng], [dropCoords.lat, dropCoords.lng]]}
                pathOptions={{ color: '#1B5E20', weight: 4, opacity: 0.6, dashArray: '10 6' }}
              />
              {/* Driver → Pickup approach line */}
              <Polyline
                positions={[[pickupCoords.lat + 0.009, pickupCoords.lng + 0.011], [pickupCoords.lat, pickupCoords.lng]]}
                pathOptions={{ color: '#F59E0B', weight: 3, opacity: 0.9 }}
              />
            </MapContainer>
            <div style={{ padding: '6px 14px', backgroundColor: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 16 }}>
              <span>🔵 Your Pickup</span>
              <span>🔴 Destination</span>
              <span>🚗 Driver approaching (~3 min)</span>
            </div>
          </div>

          <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ textAlign: 'center' }}>
              <span className="badge-flat-green"><Check size={14} /> Driver Confirmed</span>
              <h2 className="text-section" style={{ color: 'var(--text-primary)', marginTop: 8 }}>
                {selectedDriver.name} is on the way!
              </h2>
              <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                Arriving in 3 mins · {selectedDriver.vehicleNo} ({selectedDriver.vehicleModel})
              </p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Ride Amount</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-green-text)' }}>₹{fareBreakdown.totalFare}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Paid via {paymentMethod.label}</div>
              </div>
              <button className="btn-primary" onClick={() => setShowReceipt(true)}>View Receipt</button>
            </div>

            <button className="btn-secondary" onClick={() => navigate('/')}>Back to Home Dashboard</button>
          </div>
        </div>
      )}

      {/* Payment Selection Modal */}
      {showPaymentModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Payment Method</h2>
              <button onClick={() => setShowPaymentModal(false)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PAYMENT_METHODS.map(pm => {
                const isSel = paymentMethod.id === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => { setPaymentMethod(pm); setShowPaymentModal(false); }}
                    className={isSel ? 'flat-card-selected' : 'flat-card-interactive'}
                    style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                  >
                    <CreditCard size={20} color={isSel ? 'var(--brand-green-text)' : 'var(--text-secondary)'} />
                    <div style={{ flex: 1 }}>
                      <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{pm.label}</div>
                      <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{pm.detail}</div>
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

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Driver</span>
                <span style={{ fontWeight: 600 }}>{selectedDriver?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Distance ({fareBreakdown.distanceKm} km)</span>
                <span style={{ fontWeight: 600 }}>₹{fareBreakdown.distanceFare}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Base Fee</span>
                <span style={{ fontWeight: 600 }}>₹{fareBreakdown.baseRate}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span>Total Amount Paid</span>
                <span style={{ color: 'var(--brand-green-text)', fontSize: 18 }}>₹{fareBreakdown.totalFare}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setShowReceipt(false)}>
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
