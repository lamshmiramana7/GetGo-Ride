import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Zap, Car, Truck, MapPin, ArrowLeft, ShieldCheck, Check, Clock, CreditCard, ChevronRight, User, Phone, Star, AlertCircle } from 'lucide-react';
import { MOCK_DRIVERS, VEHICLE_CATEGORIES, SAVED_ADDRESSES, PAYMENT_METHODS, CHENNAI_LOCATIONS } from '../data/mockData';
import GetGoLogo from '../components/GetGoLogo';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createVehicleIcon = () => L.divIcon({
  className: '',
  html: `<div style="background:#1B5E20;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const PICKUP_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#2563EB;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});
const DROP_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#DC2626;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});

function MapController({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center]);
  return null;
}

export default function RideBookingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('location'); // 'location' | 'vehicle' | 'confirm' | 'tracking'
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [selectedDriver, setSelectedDriver] = useState(MOCK_DRIVERS[0]);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [trackingState, setTrackingState] = useState('arriving'); // 'arriving' | 'onTrip' | 'completed'
  const [showReceipt, setShowReceipt] = useState(false);
  const [driverPos, setDriverPos] = useState({ lat: 13.0827, lng: 80.2707 });
  const [etaMins, setEtaMins] = useState(4);
  const trackingIntervalRef = useRef(null);

  const vehicleDrivers = useMemo(() => {
    return MOCK_DRIVERS.filter(d => d.vehicle === selectedVehicle);
  }, [selectedVehicle]);

  const estimatedFare = useMemo(() => {
    if (!dropCoords) return 145;
    const dist = Math.sqrt(
      Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) +
      Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)
    );
    const rate = selectedVehicle === 'bike' ? 10 : selectedVehicle === 'auto' ? 14 : selectedVehicle === 'van' ? 24 : 18;
    return Math.max(45, Math.round(dist * rate + 20));
  }, [selectedVehicle, dropCoords, pickupCoords]);

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

  const handleConfirmBooking = () => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setStep('tracking');
      setTrackingState('arriving');
      // Animate driver moving
      trackingIntervalRef.current = setInterval(() => {
        setEtaMins(prev => Math.max(1, prev - 1));
      }, 3000);
    }, 1200);
  };

  useEffect(() => () => clearInterval(trackingIntervalRef.current), []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn-secondary"
          onClick={() => {
            if (step === 'location') navigate('/');
            else if (step === 'vehicle') setStep('location');
            else if (step === 'confirm') setStep('vehicle');
            else setStep('confirm');
          }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
            {step === 'location' && 'Book a Ride'}
            {step === 'vehicle' && 'Select Vehicle'}
            {step === 'confirm' && 'Confirm Booking'}
            {step === 'tracking' && 'Live Trip Tracking'}
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Instant city pickup · Flat rate guarantee
          </p>
        </div>
      </div>

      {/* ── MAP CONTAINER ── */}
      <div className="flat-card" style={{ height: 220, padding: 0, overflow: 'hidden', position: 'relative' }}>
        <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapController center={[pickupCoords.lat, pickupCoords.lng]} />
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_ICON} />
          {dropCoords && <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_ICON} />}
          {MOCK_DRIVERS.slice(0, 8).map(d => (
            <Marker key={d.id} position={[d.pos.lat, d.pos.lng]} icon={createVehicleIcon()} />
          ))}
        </MapContainer>
        <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'var(--bg-surface)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
          Active drivers nearby
        </div>
      </div>

      {/* ── STEP 1: LOCATION INPUT ── */}
      {step === 'location' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: 18, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#2563EB' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 36 }}
                placeholder="Enter pickup location..."
                value={pickup}
                onChange={e => { setPickup(e.target.value); handleSearch(e.target.value, 'pickup'); }}
                onFocus={() => setActiveField('pickup')}
              />
              {activeField === 'pickup' && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 100, marginTop: 4 }}>
                  {searchSuggestions.map((s, i) => (
                    <div key={i} onClick={() => selectLocation(s, 'pickup')} style={{ padding: '12px 16px', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                      <MapPin size={14} style={{ marginRight: 8, color: 'var(--brand-green-text)' }} /> {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 14, top: 18, width: 10, height: 10, borderRadius: '50%', backgroundColor: '#DC2626' }} />
              <input
                className="input-field"
                style={{ paddingLeft: 36 }}
                placeholder="Where to? (Enter destination)"
                value={dropoff}
                onChange={e => { setDropoff(e.target.value); handleSearch(e.target.value, 'dropoff'); }}
                onFocus={() => setActiveField('dropoff')}
              />
              {activeField === 'dropoff' && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 100, marginTop: 4 }}>
                  {searchSuggestions.map((s, i) => (
                    <div key={i} onClick={() => selectLocation(s, 'dropoff')} style={{ padding: '12px 16px', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                      <MapPin size={14} style={{ marginRight: 8, color: 'var(--brand-green-text)' }} /> {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Saved Pickers */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
            {SAVED_ADDRESSES.map(a => (
              <button
                key={a.id}
                onClick={() => { setDropoff(a.address); setDropCoords({ lat: a.lat, lng: a.lng }); }}
                className="badge-flat"
                style={{ cursor: 'pointer', padding: '6px 12px' }}
              >
                <span>{a.label}</span>
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            disabled={!pickup || !dropoff}
            onClick={() => setStep('vehicle')}
          >
            Continue to Vehicle Selection
          </button>
        </div>
      )}

      {/* ── STEP 2: VEHICLE SELECTION ── */}
      {step === 'vehicle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flat-card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
            <MapPin size={16} color="var(--brand-green-text)" />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pickup} → {dropoff}</span>
          </div>

          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Select Ride Option</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
            {[
              { id: 'bike', label: 'GetGo Bike', desc: 'Fast single passenger', icon: Zap, rate: '₹10/km' },
              { id: 'auto', label: 'GetGo Auto', desc: '3 seats · Eco friendly', icon: Car, rate: '₹14/km' },
              { id: 'car', label: 'GetGo Comfort Car', desc: '4 seats · A/C sedan', icon: Car, rate: '₹18/km' },
              { id: 'van', label: 'GetGo XL Van', desc: '6 seats · Extra luggage', icon: Truck, rate: '₹24/km' },
            ].map(v => {
              const Icon = v.icon;
              const isSel = selectedVehicle === v.id;
              return (
                <div
                  key={v.id}
                  className={isSel ? 'flat-card-selected' : 'flat-card-interactive'}
                  onClick={() => setSelectedVehicle(v.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 'var(--radius-md)',
                    backgroundColor: isSel ? 'var(--brand-green)' : 'var(--bg-secondary)',
                    color: isSel ? '#FFFFFF' : 'var(--brand-green-text)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{v.label}</div>
                    <div className="text-caption" style={{ color: 'var(--text-secondary)' }}>{v.desc}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--brand-green-text)', fontSize: 15 }}>{v.rate}</div>
                </div>
              );
            })}
          </div>

          <button className="btn-primary" onClick={() => setStep('confirm')}>
            Proceed with Selected Ride
          </button>
        </div>
      )}

      {/* ── STEP 3: CONFIRM BOOKING ── */}
      {step === 'confirm' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Booking Summary</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Review ride fare & assigned driver</p>
          </div>

          {/* Assigned Driver Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--brand-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
              {selectedDriver.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{selectedDriver.name}</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{selectedDriver.vehicleModel} · {selectedDriver.vehicleNo}</div>
            </div>
            <div className="badge-flat-green">⭐ {selectedDriver.rating}</div>
          </div>

          {/* Route & Fare */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pickup</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{pickup}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Destination</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{dropoff}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Payment Method</span>
              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{paymentMethod.label}</span>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-body-medium" style={{ color: 'var(--text-primary)' }}>Total Fare</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--brand-green-text)' }}>₹{estimatedFare}</span>
            </div>
          </div>

          <button className="btn-primary" onClick={handleConfirmBooking} disabled={isDispatching}>
            {isDispatching ? 'Confirming with Driver…' : `Confirm Booking — ₹${estimatedFare}`}
          </button>
        </div>
      )}

      {/* ── STEP 4: LIVE TRACKING ── */}
      {step === 'tracking' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span className="badge-flat-green">
                <Check size={14} /> Trip Confirmed
              </span>
              <h2 className="text-section" style={{ color: 'var(--text-primary)', marginTop: 8 }}>
                {trackingState === 'arriving' ? `Driver arriving in ~${etaMins} mins` : trackingState === 'onTrip' ? 'Trip in Progress' : 'Trip Completed'}
              </h2>
            </div>
            <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>
              OTP Code<br />
              <strong style={{ fontSize: 18, color: 'var(--brand-green-text)', letterSpacing: 2 }}>4 8 2 9</strong>
            </div>
          </div>

          {/* Driver Card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--brand-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18 }}>
              {selectedDriver.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{selectedDriver.name}</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{selectedDriver.vehicleModel} · {selectedDriver.vehicleNo}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" style={{ width: 36, height: 36, padding: 0, borderRadius: '50%' }}>
                <Phone size={16} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trackingState === 'arriving' && (
              <button className="btn-primary" onClick={() => setTrackingState('onTrip')}>
                Start Ride (Passenger Onboard)
              </button>
            )}
            {trackingState === 'onTrip' && (
              <button className="btn-primary" onClick={() => { setTrackingState('completed'); setShowReceipt(true); }}>
                Complete Ride & View E-Receipt
              </button>
            )}
            {trackingState === 'completed' && (
              <button className="btn-primary" onClick={() => setShowReceipt(true)}>
                View Trip Receipt & Invoice
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate('/')}>
              Return to Home Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ── E-RECEIPT MODAL ── */}
      {showReceipt && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="badge-flat-green" style={{ marginBottom: 8 }}>Official E-Receipt</div>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>GetGo Transport Receipt</h2>
              <p className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>Trip ID: #GETGO-2026-9812</p>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Driver</span>
                <span style={{ fontWeight: 600 }}>{selectedDriver.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Vehicle</span>
                <span style={{ fontWeight: 600 }}>{selectedDriver.vehicleModel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment</span>
                <span style={{ fontWeight: 600 }}>{paymentMethod.label}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total Fare Paid</span>
                <span style={{ color: 'var(--brand-green-text)' }}>₹{estimatedFare}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn-primary" onClick={() => { setShowReceipt(false); navigate('/'); }}>
                Done & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
