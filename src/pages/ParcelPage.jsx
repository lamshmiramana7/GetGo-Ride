import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MOCK_DRIVERS, SAVED_ADDRESSES, PAYMENT_METHODS, CHENNAI_LOCATIONS } from '../data/mockData';
import parcelBannerImg from '../assets/parcel_banner.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const BIKE_ICON = L.divIcon({
  className: '',
  html: `<div style="background:#00A651;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.4)">🏍️</div>`,
  iconSize: [30, 30], iconAnchor: [15, 15],
});
const PICKUP_ICON = L.divIcon({ className: '', html: `<div style="background:#2563EB;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
const DROP_ICON = L.divIcon({ className: '', html: `<div style="background:#EF4444;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.5)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });

const bikeDrivers = MOCK_DRIVERS.filter(d => d.vehicle === 'bike');

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

export default function ParcelPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // form | drivers | confirm | tracking | verify
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [parcelDesc, setParcelDesc] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [revealedDriver, setRevealedDriver] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [tracking, setTracking] = useState({ status: 'arriving', eta: 5 });
  const [driverPos, setDriverPos] = useState(null);
  const [verifyMethod, setVerifyMethod] = useState(null); // 'otp' | 'photo'
  const [otpVal, setOtpVal] = useState('');
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const trackRef = useRef(null);
  const fileRef = useRef(null);

  const handleSearch = (query, field) => {
    if (!query) { setSuggestions([]); return; }
    const results = CHENNAI_LOCATIONS.filter(l => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    setSuggestions(results);
    setActiveField(field);
  };

  const selectLoc = (loc, field) => {
    if (field === 'pickup') { setPickup(loc.name); setPickupCoords({ lat: loc.lat, lng: loc.lng }); }
    else { setDropoff(loc.name); setDropCoords({ lat: loc.lat, lng: loc.lng }); }
    setSuggestions([]); setActiveField(null);
  };

  const dist = dropCoords ? Math.sqrt(Math.pow((dropCoords.lat - pickupCoords.lat) * 111, 2) + Math.pow((dropCoords.lng - pickupCoords.lng) * 111, 2)).toFixed(1) : 0;

  const startTracking = (driver) => {
    setRevealedDriver(driver);
    setDriverPos({ ...driver.pos });
    setTracking({ status: 'arriving', eta: 4 });
    trackRef.current = setInterval(() => {
      setTracking(prev => {
        const newEta = Math.max(0, (prev.eta || 4) - 1);
        if (newEta === 0) { clearInterval(trackRef.current); return { status: 'delivered', eta: 0 }; }
        return { ...prev, eta: newEta };
      });
      setDriverPos(prev => ({
        lat: prev.lat + ((dropCoords?.lat || pickupCoords.lat) - prev.lat) * 0.15,
        lng: prev.lng + ((dropCoords?.lng || pickupCoords.lng) - prev.lng) * 0.15,
      }));
    }, 2500);
  };
  useEffect(() => () => clearInterval(trackRef.current), []);

  // ── FORM ──
  if (step === 'form') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>←</button>
        <span className="top-bar-title">Send a Parcel</span>
      </div>

      {/* Map preview */}
      <div style={{ height: 200, flexShrink: 0 }}>
        <MapContainer center={[13.0827, 80.2707]} zoom={12} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {bikeDrivers.map(d => (
            <Marker key={d.id} position={[d.pos.lat, d.pos.lng]} icon={BIKE_ICON}>
              <Popup>⭐ {d.rating} · ₹{d.rate}/km</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 100, position: 'relative', border: '1.5px solid rgba(0,166,81,0.3)', boxShadow: 'var(--shadow-md)', flexShrink: 0 }}>
          <img src={parcelBannerImg} alt="Express Parcel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.0625rem', color: '#fff' }}>Express Parcel Courier</div>
            <div style={{ fontSize: '0.75rem', color: '#00A651', fontWeight: 600, marginTop: 2 }}>⚡ Bike delivery only · OTP Protected</div>
          </div>
        </div>

        <div className="section-title">Parcel Details</div>

        {/* Locations */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#2563EB', border: '2px solid #fff' }} />
          <input id="parcel-pickup" className="input-field" style={{ paddingLeft: 36 }} placeholder="Pickup address" value={pickup}
            onChange={e => { setPickup(e.target.value); handleSearch(e.target.value, 'pickup'); }}
            onFocus={() => setActiveField('pickup')} />
          {activeField === 'pickup' && suggestions.length > 0 && <Suggestions list={suggestions} onSelect={l => selectLoc(l, 'pickup')} />}
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 10, height: 10, borderRadius: '50%', background: '#EF4444', border: '2px solid #fff' }} />
          <input id="parcel-dropoff" className="input-field" style={{ paddingLeft: 36 }} placeholder="Delivery address" value={dropoff}
            onChange={e => { setDropoff(e.target.value); handleSearch(e.target.value, 'dropoff'); }}
            onFocus={() => setActiveField('dropoff')} />
          {activeField === 'dropoff' && suggestions.length > 0 && <Suggestions list={suggestions} onSelect={l => selectLoc(l, 'dropoff')} />}
        </div>

        <div className="section-title" style={{ marginBottom: 4 }}>Recipient</div>
        <input id="recipient-name" className="input-field" placeholder="Recipient's full name" value={recipientName} onChange={e => setRecipientName(e.target.value)} />
        <input id="recipient-phone" className="input-field" placeholder="Recipient's phone number" type="tel" value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} />
        <input id="parcel-desc" className="input-field" placeholder="Parcel description (optional)" value={parcelDesc} onChange={e => setParcelDesc(e.target.value)} />

        <button
          id="find-parcel-driver-btn"
          className="btn btn-primary"
          disabled={!pickup || !dropoff || !recipientName || !recipientPhone}
          onClick={() => setStep('drivers')}
        >
          Find Bike Riders →
        </button>
      </div>
    </div>
  );

  // ── DRIVERS ──
  if (step === 'drivers') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <button className="back-btn" onClick={() => setStep('form')}>←</button>
        <span className="top-bar-title">Available Riders</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ padding: '10px 14px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          <span style={{ color: '#2563EB', fontWeight: 600 }}>📍</span> {pickup} → <span style={{ color: '#EF4444', fontWeight: 600 }}>📍</span> {dropoff}
          {dist > 0 && <span style={{ float: 'right', color: 'var(--brand-green)', fontWeight: 600 }}>{dist} km</span>}
        </div>

        <div className="section-title">Select a rider ({bikeDrivers.length} available)</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: -8 }}>Rider identity revealed after confirmation</p>

        {bikeDrivers.map(d => {
          const fare = dist > 0 ? Math.round(Number(dist) * d.rate + 15) : null;
          return (
            <div
              key={d.id}
              id={`parcel-driver-${d.id}`}
              className={`driver-card ${selectedDriver?.id === d.id ? 'selected' : ''}`}
              onClick={() => setSelectedDriver(d)}
            >
              <div className="driver-vehicle-icon">🏍️</div>
              <div className="driver-info">
                <div className="driver-vehicle-type">{d.vehicleModel}</div>
                <div className="driver-vehicle-model">{d.color} · {d.vehicleNo}</div>
                <div className="driver-meta">
                  <span className="rating-badge">⭐ {d.rating}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>· {d.trips} deliveries</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div className="driver-rate">₹{d.rate}/km</div>
                {fare && <div style={{ fontSize: '0.75rem', color: 'var(--brand-green)', fontWeight: 600 }}>~₹{fare}</div>}
              </div>
              {selectedDriver?.id === d.id && <div style={{ position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: '50%', background: 'var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' }}>✓</div>}
            </div>
          );
        })}

        <button id="confirm-parcel-btn" className="btn btn-primary" disabled={!selectedDriver} onClick={() => setStep('confirm')}>
          Confirm Rider →
        </button>
      </div>
    </div>
  );

  // ── CONFIRM ──
  if (step === 'confirm') {
    const fare = dist > 0 && selectedDriver ? Math.round(Number(dist) * selectedDriver.rate + 15) : 80;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div className="top-bar">
          <button className="back-btn" onClick={() => setStep('drivers')}>←</button>
          <span className="top-bar-title">Confirm Delivery</span>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Anonymous rider */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)', padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏍️</div>
            <div style={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 700 }}>Rider assigned</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 4 }}>Identity revealed after confirmation</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
              <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rating</div><div style={{ fontWeight: 700, color: 'var(--gold)' }}>⭐ {selectedDriver?.rating}</div></div>
              <div style={{ width: 1, background: 'var(--border)' }} />
              <div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rate</div><div style={{ fontWeight: 700, color: 'var(--brand-green)' }}>₹{selectedDriver?.rate}/km</div></div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>DELIVERY DETAILS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>From</span><span style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: '60%', textAlign: 'right' }}>{pickup}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>To</span><span style={{ fontWeight: 600, fontSize: '0.875rem', maxWidth: '60%', textAlign: 'right' }}>{dropoff}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Recipient</span><span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{recipientName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Verification</span><span style={{ color: 'var(--brand-green)', fontWeight: 600, fontSize: '0.875rem' }}>OTP or Photo</span></div>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Fare</span>
              <span style={{ fontFamily: 'Poppins', fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-green)' }}>₹{fare}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.8125rem', color: 'rgba(255,215,0,0.9)' }}>
            📱 OTP will be sent to {recipientPhone} for delivery verification
          </div>

          <button id="book-parcel-btn" className="btn btn-gold" onClick={() => { setStep('tracking'); startTracking(selectedDriver); }}>
            📦 Book Delivery — ₹{fare}
          </button>
        </div>
      </div>
    );
  }

  // ── TRACKING ──
  if (step === 'tracking') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <span className="top-bar-title">Parcel Tracking</span>
      </div>
      <div style={{ height: 260, flexShrink: 0, position: 'relative' }}>
        <MapContainer center={[pickupCoords.lat, pickupCoords.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={PICKUP_ICON} />
          {dropCoords && <Marker position={[dropCoords.lat, dropCoords.lng]} icon={DROP_ICON} />}
          {driverPos && <Marker position={[driverPos.lat, driverPos.lng]} icon={BIKE_ICON} />}
        </MapContainer>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(15,17,23,0.95))', padding: '24px 16px 12px', zIndex: 1000 }}>
          <div style={{ fontWeight: 700, color: '#fff' }}>
            {tracking.status === 'delivered' ? '✅ Parcel Delivered!' : `🏍️ Rider on the way · ${tracking.eta} min`}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {revealedDriver && (
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--brand-green)', borderRadius: 'var(--radius-xl)', padding: 16, display: 'flex', gap: 14 }}>
            <div style={{ width: 50, height: 50, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: '2px solid var(--brand-green)' }}>🏍️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>{revealedDriver.name}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: 2 }}>{revealedDriver.vehicleModel} · {revealedDriver.vehicleNo}</div>
              <div style={{ marginTop: 6 }}><span className="rating-badge">⭐ {revealedDriver.rating}</span></div>
            </div>
          </div>
        )}

        {/* Delivery steps */}
        <div className="card">
          {[
            { icon: '✅', label: 'Order Placed', done: true },
            { icon: tracking.status !== 'arrived' && tracking.status !== 'delivered' ? '🔄' : '✅', label: 'Rider Picked Up Parcel', done: true },
            { icon: tracking.status === 'delivered' ? '✅' : '🏍️', label: 'In Transit', done: tracking.status === 'delivered' },
            { icon: tracking.status === 'delivered' ? '✅' : '⏳', label: 'Delivered to ' + (recipientName || 'Recipient'), done: tracking.status === 'delivered' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: '1.125rem', width: 28, textAlign: 'center' }}>{s.icon}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: s.done ? 600 : 400, color: s.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {tracking.status === 'delivered' && (
          <button id="verify-delivery-btn" className="btn btn-primary" onClick={() => setStep('verify')}>
            🔐 Verify Delivery
          </button>
        )}
        {tracking.status !== 'delivered' && (
          <button id="cancel-parcel-btn" onClick={() => { clearInterval(trackRef.current); navigate('/'); }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 12, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}>
            Cancel Delivery
          </button>
        )}
      </div>
    </div>
  );

  // ── VERIFY ──
  if (step === 'verify') return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <span className="top-bar-title">Delivery Verification</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔐</div>
          <div style={{ fontFamily: 'Poppins', fontSize: '1.125rem', fontWeight: 700 }}>Verify Delivery</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 6 }}>Confirm receipt with OTP or photo proof</div>
        </div>

        {!verifyMethod && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button id="otp-verify-btn" className="btn btn-primary" onClick={() => setVerifyMethod('otp')}>
              📱 Verify with OTP (SMS to recipient)
            </button>
            <button id="photo-verify-btn" className="btn btn-outline-green" onClick={() => setVerifyMethod('photo')}>
              📸 Verify with Photo Proof
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              If OTP fails to arrive, use photo proof as fallback
            </p>
          </div>
        )}

        {verifyMethod === 'otp' && (
          <div style={{ animation: 'slideUp 0.25s ease', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 8 }}>OTP sent to {recipientPhone}</div>
              <div style={{ fontWeight: 700, color: 'var(--brand-green)' }}>Enter the code given by recipient</div>
            </div>
            <input id="delivery-otp-input" className="input-field" style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontWeight: 700 }} placeholder="• • • • • •" maxLength={6} value={otpVal} onChange={e => setOtpVal(e.target.value.replace(/\D/g, '').slice(0, 6))} />
            <button id="confirm-otp-btn" className="btn btn-primary" disabled={otpVal.length < 6} onClick={() => navigate('/')}>
              ✅ Confirm Delivery
            </button>
            <button onClick={() => setVerifyMethod('photo')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8125rem', cursor: 'pointer', textAlign: 'center' }}>
              OTP not received? Use photo proof instead
            </button>
          </div>
        )}

        {verifyMethod === 'photo' && (
          <div style={{ animation: 'slideUp 0.25s ease', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 20, textAlign: 'center', border: '2px dashed var(--border)', cursor: 'pointer' }}
              onClick={() => fileRef.current?.click()}>
              {photoUploaded ? (
                <div><div style={{ fontSize: '2.5rem' }}>✅</div><div style={{ fontWeight: 600, color: 'var(--brand-green)', marginTop: 8 }}>Photo uploaded!</div></div>
              ) : (
                <div><div style={{ fontSize: '2.5rem' }}>📸</div><div style={{ fontWeight: 600, marginTop: 8 }}>Tap to upload photo</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>Take a photo of recipient with parcel</div></div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={() => setPhotoUploaded(true)} />
            <button id="confirm-photo-btn" className="btn btn-primary" disabled={!photoUploaded} onClick={() => navigate('/')}>
              ✅ Confirm Delivery
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return null;
}
