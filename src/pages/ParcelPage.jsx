import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, MapPin, User, Phone, ArrowLeft, ShieldCheck, Check, Truck, ChevronRight, FileText } from 'lucide-react';
import { MOCK_DRIVERS, SAVED_ADDRESSES, CHENNAI_LOCATIONS } from '../data/mockData';
import { PARCEL_BANNER_BASE64 } from '../assets/mediaBase64';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PICKUP_ICON = L.divIcon({ className: '', html: `<div style="background:#2563EB;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });
const DROP_ICON = L.divIcon({ className: '', html: `<div style="background:#DC2626;width:14px;height:14px;border-radius:50%;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`, iconSize: [14, 14], iconAnchor: [7, 7] });

export default function ParcelPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState('form'); // 'form' | 'confirm' | 'tracking'
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState({ lat: 13.0827, lng: 80.2707 });
  const [dropCoords, setDropCoords] = useState(null);
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [parcelDesc, setParcelDesc] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(MOCK_DRIVERS[0]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [isDispatching, setIsDispatching] = useState(false);
  const [trackingState, setTrackingState] = useState('arriving');

  const handleSearch = (query, field) => {
    if (!query) { setSearchSuggestions([]); return; }
    const results = CHENNAI_LOCATIONS.filter(l => l.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    setSearchSuggestions(results);
    setActiveField(field);
  };

  const selectLoc = (loc, field) => {
    if (field === 'pickup') { setPickup(loc.name); setPickupCoords({ lat: loc.lat, lng: loc.lng }); }
    else { setDropoff(loc.name); setDropCoords({ lat: loc.lat, lng: loc.lng }); }
    setSearchSuggestions([]); setActiveField(null);
  };

  const fare = dropCoords ? 75 : 65;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn-secondary"
          onClick={() => {
            if (step === 'form') navigate('/');
            else setStep('form');
          }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
            Send a Parcel
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Doorstep pickup & express bike delivery
          </p>
        </div>
      </div>

      {/* ── STEP 1: PARCEL DETAILS FORM ── */}
      {step === 'form' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Professional Parcel Banner Picture */}
          <div style={{ height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
            <img src={PARCEL_BANNER_BASE64} alt="Express Parcel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>Express Parcel Delivery</div>
              <div style={{ fontSize: 12, color: 'var(--brand-green-text)', marginTop: 2 }}>Doorstep Pickup & Sealed Package Delivery</div>
            </div>
          </div>

          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Pickup & Delivery Details</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Enter location & recipient information</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ position: 'relative' }}>
              <input
                className="input-field"
                placeholder="Pickup location..."
                value={pickup}
                onChange={e => { setPickup(e.target.value); handleSearch(e.target.value, 'pickup'); }}
                onFocus={() => setActiveField('pickup')}
              />
              {activeField === 'pickup' && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 100, marginTop: 4 }}>
                  {searchSuggestions.map((s, i) => (
                    <div key={i} onClick={() => selectLoc(s, 'pickup')} style={{ padding: '12px 16px', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                      <MapPin size={14} style={{ marginRight: 8, color: 'var(--brand-green-text)' }} /> {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <input
                className="input-field"
                placeholder="Delivery address..."
                value={dropoff}
                onChange={e => { setDropoff(e.target.value); handleSearch(e.target.value, 'dropoff'); }}
                onFocus={() => setActiveField('dropoff')}
              />
              {activeField === 'dropoff' && searchSuggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', zIndex: 100, marginTop: 4 }}>
                  {searchSuggestions.map((s, i) => (
                    <div key={i} onClick={() => selectLoc(s, 'dropoff')} style={{ padding: '12px 16px', fontSize: 14, cursor: 'pointer', borderBottom: '1px solid var(--border)' }}>
                      <MapPin size={14} style={{ marginRight: 8, color: 'var(--brand-green-text)' }} /> {s.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 className="text-body-medium" style={{ color: 'var(--text-primary)' }}>Recipient Information</h3>
            <input
              className="input-field"
              placeholder="Recipient name"
              value={recipientName}
              onChange={e => setRecipientName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Recipient mobile number (+91)"
              type="tel"
              value={recipientPhone}
              onChange={e => setRecipientPhone(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Parcel contents (e.g. Documents, Keys, Clothes)"
              value={parcelDesc}
              onChange={e => setParcelDesc(e.target.value)}
            />
          </div>

          <button
            className="btn-primary"
            disabled={!pickup || !dropoff || !recipientName || !recipientPhone}
            onClick={() => setStep('confirm')}
          >
            Review Order & Pricing (₹{fare})
          </button>
        </div>
      )}

      {/* ── STEP 2: CONFIRM PARCEL BOOKING ── */}
      {step === 'confirm' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Confirm Express Parcel</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Assigning nearest GetGo Delivery Partner</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Pickup</span>
              <span style={{ fontWeight: 600 }}>{pickup}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Recipient</span>
              <span style={{ fontWeight: 600 }}>{recipientName} ({recipientPhone})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
              <span style={{ fontWeight: 700, color: 'var(--brand-green-text)' }}>₹{fare}</span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={() => {
              setIsDispatching(true);
              setTimeout(() => {
                setIsDispatching(false);
                setStep('tracking');
              }, 1200);
            }}
            disabled={isDispatching}
          >
            {isDispatching ? 'Assigning Courier…' : `Confirm Parcel Delivery — ₹${fare}`}
          </button>
        </div>
      )}

      {/* ── STEP 3: TRACKING ── */}
      {step === 'tracking' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <span className="badge-flat-green">
              <Check size={14} /> Courier Dispatched
            </span>
            <h2 className="text-section" style={{ color: 'var(--text-primary)', marginTop: 8 }}>
              {trackingState === 'arriving' ? 'Delivery Partner en route for pickup' : 'Parcel Picked Up & In Transit'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: 'var(--brand-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
              {selectedDriver.name[0]}
            </div>
            <div style={{ flex: 1 }}>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{selectedDriver.name}</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Express Bike Delivery Partner</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {trackingState === 'arriving' && (
              <button className="btn-primary" onClick={() => setTrackingState('inTransit')}>
                Mark Parcel Picked Up
              </button>
            )}
            <button className="btn-secondary" onClick={() => navigate('/')}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
