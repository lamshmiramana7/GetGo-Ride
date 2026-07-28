import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Plane, ArrowLeft, ExternalLink, Check, Users, X, Plus, Minus, Trash2, ChevronRight, User as UserIcon, Phone, Shield } from 'lucide-react';
import { PRIVATE_BUS_CHARTERS } from '../data/mockData';
import { useLanguage } from '../App';

// ─── EXPANDED BUS CATALOGUE ─────────────────────────────────────────
const INTERCITY_BUSES = [
  // AC SLEEPER
  { id: 'ib_001', operator: 'TNSTC Volvo A/C Sleeper', model: 'Volvo 9400 Multi-Axle', type: 'AC Sleeper', category: 'ac', seats: 36, fare: 950, amenities: ['AC', 'Pushback Seats', 'USB Charging', 'Blanket'], departureTime: '20:00', arrivalTime: '04:30', duration: '8h 30m', rating: 4.6, available: 14 },
  { id: 'ib_002', operator: 'KPN Travels A/C Sleeper', model: 'Scania Metrolink HD', type: 'AC Sleeper 2+1', category: 'ac', seats: 27, fare: 1050, amenities: ['AC', '2+1 Berth', 'Reading Light', 'Pillow & Blanket', 'CCTV'], departureTime: '21:30', arrivalTime: '06:00', duration: '8h 30m', rating: 4.8, available: 9 },
  { id: 'ib_003', operator: 'SRS Travels Platinum', model: 'Volvo B11R Multi-Axle', type: 'AC Luxury Sleeper', category: 'ac', seats: 30, fare: 1150, amenities: ['AC', 'Recliner Seats', 'Charging Port', 'Entertainment Screen', 'Washroom'], departureTime: '22:00', arrivalTime: '06:15', duration: '8h 15m', rating: 4.9, available: 6 },
  { id: 'ib_004', operator: 'Parveen Express Gold', model: 'Ashok Leyland Viking', type: 'AC Sleeper 2+2', category: 'ac', seats: 40, fare: 820, amenities: ['AC', 'Reclining Seat', 'USB Charger'], departureTime: '22:45', arrivalTime: '07:00', duration: '8h 15m', rating: 4.5, available: 18 },
  { id: 'ib_005', operator: 'Orange Travels Express', model: 'Mercedes-Benz OC500', type: 'AC Semi-Sleeper', category: 'ac', seats: 45, fare: 780, amenities: ['AC', 'Semi-Sleeper Seat', 'Mobile Charger', 'Water Bottle'], departureTime: '23:00', arrivalTime: '07:15', duration: '8h 15m', rating: 4.4, available: 21 },
  { id: 'ib_006', operator: 'VRL Travels Executive', model: 'Tata Starbus Ultra', type: 'AC Seater', category: 'ac', seats: 50, fare: 650, amenities: ['AC', 'Pushback Seat', 'Charging Port'], departureTime: '06:00', arrivalTime: '14:00', duration: '8h 00m', rating: 4.3, available: 30 },
  // NON-AC SLEEPER
  { id: 'ib_007', operator: 'TNSTC Express Super', model: 'Tata LP 1613 CNG', type: 'Non-AC Ordinary', category: 'nonac', seats: 55, fare: 320, amenities: ['Fan', 'Cushioned Seat'], departureTime: '06:30', arrivalTime: '15:00', duration: '8h 30m', rating: 4.0, available: 40 },
  { id: 'ib_008', operator: 'Prasanna Purple Tours', model: 'Ashok Leyland Eagle', type: 'Non-AC Sleeper', category: 'nonac', seats: 36, fare: 480, amenities: ['Fan', 'Sleeper Berth', 'Mobile Charging'], departureTime: '21:00', arrivalTime: '05:30', duration: '8h 30m', rating: 4.1, available: 22 },
  { id: 'ib_009', operator: 'Raj National Express', model: 'Leyland Titan Euro4', type: 'Non-AC Seater', category: 'nonac', seats: 48, fare: 380, amenities: ['Fan', 'Push-back Seat', 'Luggage Rack'], departureTime: '07:00', arrivalTime: '15:30', duration: '8h 30m', rating: 3.9, available: 35 },
  { id: 'ib_010', operator: 'Chartered Speed Lines', model: 'TATA Marcopolo Non-AC', type: 'Non-AC Semi-Sleeper', category: 'nonac', seats: 42, fare: 420, amenities: ['Fan', 'Reclining Seat', 'Curtains'], departureTime: '20:30', arrivalTime: '05:00', duration: '8h 30m', rating: 4.0, available: 28 },
  { id: 'ib_011', operator: 'Green Line Travels', model: 'Ashok Leyland Viking LP', type: 'Non-AC Economy', category: 'nonac', seats: 54, fare: 290, amenities: ['Fan', 'Basic Seat'], departureTime: '05:30', arrivalTime: '14:00', duration: '8h 30m', rating: 3.7, available: 50 },
  { id: 'ib_012', operator: 'Tamil Nadu SETC Ultra', model: 'Volvo B7R Non-AC Express', type: 'Non-AC Express', category: 'nonac', seats: 48, fare: 350, amenities: ['Fan', 'Seat Cover', 'Luggage Space'], departureTime: '08:00', arrivalTime: '16:30', duration: '8h 30m', rating: 4.2, available: 32 },
];

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

  // Main Tab State
  const [tab, setTab] = useState('bus'); // 'bus' | 'charter' | 'flights' | 'trains'
  const [step, setStep] = useState('search'); // 'search' | 'results' | 'seat' | 'passengers' | 'confirmed'

  // Bus Search State
  const [searchFrom, setSearchFrom] = useState('Chennai');
  const [searchTo, setSearchTo] = useState('Madurai');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [busFilter, setBusFilter] = useState('all'); // 'all' | 'ac' | 'nonac'
  const [selectedBus, setSelectedBus] = useState(null);

  // Passenger State
  const [passengers, setPassengers] = useState([{ id: 1, name: '', age: '', gender: 'Male', seat: '' }]);
  const [bookingRef, setBookingRef] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Group Charter State
  const [charterFrom, setCharterFrom] = useState('Chennai, Tamil Nadu');
  const [charterTo, setCharterTo] = useState('Ooty / Kodaikanal, Tamil Nadu');
  const [groupSize, setGroupSize] = useState(50);
  const [charterDays, setCharterDays] = useState(2);
  const [selectedCharterBus, setSelectedCharterBus] = useState(PRIVATE_BUS_CHARTERS[2]);
  const [showCharterConfirmModal, setShowCharterConfirmModal] = useState(false);
  const [charterBookingRef, setCharterBookingRef] = useState('');

  // Flight & Train State
  const [flightFrom, setFlightFrom] = useState('Chennai (MAA)');
  const [flightTo, setFlightTo] = useState('Delhi (DEL)');
  const [trainFrom, setTrainFrom] = useState('Chennai Central (MAS)');
  const [trainTo, setTrainTo] = useState('Bangalore City (SBC)');

  // ─── Passenger Helpers ──────────────────────────────────────
  const addPassenger = () => {
    if (passengers.length >= (selectedBus?.seats || 10)) return;
    setPassengers(prev => [...prev, { id: Date.now(), name: '', age: '', gender: 'Male', seat: '' }]);
    // Auto-assign next available seat number
  };

  const removePassenger = (id) => {
    if (passengers.length <= 1) return;
    setPassengers(prev => prev.filter(p => p.id !== id));
  };

  const updatePassenger = (id, field, value) => {
    setPassengers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // ─── Bus Filter ──────────────────────────────────────────────
  const filteredBuses = busFilter === 'all'
    ? INTERCITY_BUSES
    : INTERCITY_BUSES.filter(b => b.category === busFilter);

  // ─── Confirm Booking ─────────────────────────────────────────
  const handleConfirmBooking = () => {
    const missing = passengers.some(p => !p.name.trim() || !p.age);
    if (missing) {
      alert('Please fill in Name and Age for all passengers.');
      return;
    }
    const ref = `GG-BUS-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingRef(ref);
    setStep('confirmed');
  };

  const handleCharterRequest = () => {
    const ref = `GG-CHARTER-${Math.floor(100000 + Math.random() * 900000)}`;
    setCharterBookingRef(ref);
    setShowCharterConfirmModal(true);
  };

  const calculatedCharterTotal = selectedCharterBus
    ? (selectedCharterBus.minKmPerDay * selectedCharterBus.perKmRate * charterDays) + (selectedCharterBus.driverAllowancePerDay * charterDays)
    : 15600;

  const totalFare = selectedBus ? selectedBus.fare * passengers.length : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn-secondary"
          onClick={() => {
            if (step !== 'search') setStep(step === 'passengers' ? 'results' : step === 'seat' ? 'results' : 'search');
            else navigate('/');
          }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)', flexShrink: 0 }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
            Intercity Travel & Group Bus Charter
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            AC / Non-AC Buses · 50-Pax Charter · IndiGo Flights · IRCTC Trains
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, backgroundColor: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        {[
          { id: 'bus', label: 'Bus', icon: Bus },
          { id: 'charter', label: 'Group Charter', icon: Users },
          { id: 'flights', label: 'Flights', icon: Plane },
          { id: 'trains', label: 'Trains', icon: ArrowLeft },
        ].map(tObj => {
          const Icon = tObj.icon;
          const isAct = tab === tObj.id;
          return (
            <button
              key={tObj.id}
              onClick={() => { setTab(tObj.id); setStep('search'); setSelectedBus(null); setPassengers([{ id: 1, name: '', age: '', gender: 'Male', seat: '' }]); }}
              style={{
                height: 44,
                borderRadius: 8,
                backgroundColor: isAct ? 'var(--brand-green)' : 'transparent',
                color: isAct ? '#FFFFFF' : 'var(--text-secondary)',
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
              <Icon size={14} />
              <span>{tObj.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════
          1. INTERCITY BUS TAB
         ══════════════════════════════════════════════════════ */}
      {tab === 'bus' && (
        <>
          {/* STEP: SEARCH */}
          {step === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Search Intercity Buses</h2>
                  <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>AC Sleeper, Non-AC, Volvo & Express buses across India</p>
                </div>

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

                <button className="btn-primary" onClick={() => setStep('results')}>
                  Search Buses →
                </button>

                {/* TNSTC Official Portal Link */}
                <button
                  onClick={() => window.open('https://www.tnstc.in/OTRSOnline/', '_blank', 'noopener,noreferrer')}
                  style={{ width: '100%', padding: '10px 14px', backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}
                >
                  <Bus size={16} />
                  <span>Book via Official TNSTC Portal</span>
                  <ExternalLink size={14} />
                </button>
              </div>

              {/* Popular Routes */}
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Popular Routes from Chennai</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {POPULAR_ROUTES.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => { setSearchFrom(r.from); setSearchTo(r.to); }}
                      className="badge-flat"
                      style={{ cursor: 'pointer', fontSize: 12, padding: '6px 10px' }}
                    >
                      {r.from} → {r.to}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP: RESULTS */}
          {step === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Route Summary Bar */}
              <div className="flat-card" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{searchFrom}</span>
                  <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>
                  <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{searchTo}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>{travelDate}</span>
                </div>
                <button onClick={() => setStep('search')} className="btn-secondary" style={{ height: 34, padding: '0 12px', fontSize: 12 }}>Change</button>
              </div>

              {/* AC / Non-AC Filter Tabs */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { id: 'all', label: `All Buses (${INTERCITY_BUSES.length})` },
                  { id: 'ac', label: `AC Buses (${INTERCITY_BUSES.filter(b => b.category === 'ac').length})` },
                  { id: 'nonac', label: `Non-AC Buses (${INTERCITY_BUSES.filter(b => b.category === 'nonac').length})` },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setBusFilter(f.id)}
                    style={{
                      flex: 1,
                      height: 38,
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 700,
                      backgroundColor: busFilter === f.id ? 'var(--brand-green)' : 'var(--bg-surface)',
                      color: busFilter === f.id ? '#FFFFFF' : 'var(--text-secondary)',
                      border: `1px solid ${busFilter === f.id ? 'var(--brand-green)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Bus Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filteredBuses.map(bus => (
                  <div
                    key={bus.id}
                    className="flat-card"
                    style={{
                      padding: 16,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                      border: selectedBus?.id === bus.id ? '2px solid var(--brand-green)' : '1px solid var(--border)',
                      cursor: 'pointer',
                      backgroundColor: selectedBus?.id === bus.id ? 'var(--brand-green-tint)' : 'var(--bg-surface)',
                    }}
                    onClick={() => setSelectedBus(bus)}
                  >
                    {/* Top Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)' }}>{bus.operator}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bus.model}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: 4,
                              fontSize: 10,
                              fontWeight: 700,
                              backgroundColor: bus.category === 'ac' ? '#DBEAFE' : '#FEF9C3',
                              color: bus.category === 'ac' ? '#1D4ED8' : '#854D0E',
                            }}
                          >
                            {bus.category === 'ac' ? '❄️ AC' : '💨 Non-AC'}
                          </span>
                          <span className="badge-flat" style={{ fontSize: 10, padding: '2px 6px' }}>{bus.type}</span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>⭐ {bus.rating}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--brand-green-text)' }}>₹{bus.fare}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per passenger</div>
                        <div style={{ fontSize: 11, color: bus.available <= 10 ? '#EF4444' : 'var(--text-muted)', fontWeight: 600, marginTop: 2 }}>
                          {bus.available} seats left
                        </div>
                      </div>
                    </div>

                    {/* Time Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{bus.departureTime}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{searchFrom}</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bus.duration}</div>
                        <div style={{ height: 1, width: 60, backgroundColor: 'var(--border)', margin: '4px auto' }} />
                        <Bus size={12} color="var(--text-muted)" />
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{bus.arrivalTime}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{searchTo}</div>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {bus.amenities.map((am, i) => (
                        <span key={i} style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                          {am}
                        </span>
                      ))}
                    </div>

                    {/* Select Button */}
                    <button
                      className={selectedBus?.id === bus.id ? 'btn-primary' : 'btn-secondary'}
                      style={{ height: 40, fontSize: 14 }}
                      onClick={e => { e.stopPropagation(); setSelectedBus(bus); }}
                    >
                      {selectedBus?.id === bus.id ? '✓ Selected' : 'Select This Bus'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Proceed Button */}
              {selectedBus && (
                <div style={{ position: 'sticky', bottom: 8, backgroundColor: 'var(--bg-page)', paddingTop: 8 }}>
                  <div className="flat-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '2px solid var(--brand-green)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{selectedBus.operator}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹{selectedBus.fare}/pax · {selectedBus.type}</div>
                    </div>
                    <button className="btn-primary" style={{ width: 'auto', padding: '0 20px', height: 42 }} onClick={() => setStep('passengers')}>
                      Add Passengers →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP: PASSENGERS */}
          {step === 'passengers' && selectedBus && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Selected Bus Summary */}
              <div className="flat-card" style={{ padding: '14px 16px', backgroundColor: 'var(--brand-green-tint)', border: '1px solid var(--brand-green)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--brand-green-text)', fontSize: 14 }}>{selectedBus.operator}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{searchFrom} → {searchTo} · {travelDate}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selectedBus.departureTime} – {selectedBus.arrivalTime} · {selectedBus.type}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--brand-green-text)' }}>₹{selectedBus.fare}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>per passenger</div>
                  </div>
                </div>
              </div>

              {/* Passenger List Section */}
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 className="text-section" style={{ color: 'var(--text-primary)', fontSize: 16 }}>Passenger Details</h2>
                    <p className="text-caption" style={{ color: 'var(--text-muted)' }}>{passengers.length} passenger{passengers.length > 1 ? 's' : ''} · Total: ₹{totalFare}</p>
                  </div>
                  <button
                    onClick={addPassenger}
                    disabled={passengers.length >= selectedBus.available}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: passengers.length >= selectedBus.available ? 'var(--bg-secondary)' : 'var(--brand-green)',
                      color: passengers.length >= selectedBus.available ? 'var(--text-muted)' : '#FFFFFF',
                      border: 'none',
                      cursor: passengers.length >= selectedBus.available ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 22,
                      fontWeight: 700,
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(27, 94, 32, 0.3)',
                    }}
                    title="Add Passenger"
                  >
                    <Plus size={22} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {passengers.map((p, idx) => (
                    <div
                      key={p.id}
                      style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 10, backgroundColor: 'var(--bg-secondary)' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'var(--brand-green)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                            {idx + 1}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Passenger {idx + 1}</span>
                        </div>
                        {passengers.length > 1 && (
                          <button
                            onClick={() => removePassenger(p.id)}
                            style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#FEE2E2', color: '#EF4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 8 }}>
                        <input
                          className="input-field"
                          placeholder="Full Name *"
                          value={p.name}
                          onChange={e => updatePassenger(p.id, 'name', e.target.value)}
                          style={{ height: 40, fontSize: 13 }}
                        />
                        <input
                          className="input-field"
                          placeholder="Age *"
                          type="number"
                          min="1"
                          max="110"
                          value={p.age}
                          onChange={e => updatePassenger(p.id, 'age', e.target.value)}
                          style={{ height: 40, fontSize: 13 }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <select
                          value={p.gender}
                          onChange={e => updatePassenger(p.id, 'gender', e.target.value)}
                          style={{ height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: 13 }}
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        <input
                          className="input-field"
                          placeholder="Seat Preference (opt.)"
                          value={p.seat}
                          onChange={e => updatePassenger(p.id, 'seat', e.target.value)}
                          style={{ height: 40, fontSize: 13 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Passenger Button (bottom) */}
                <button
                  onClick={addPassenger}
                  disabled={passengers.length >= selectedBus.available}
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 8,
                    border: '2px dashed var(--border)',
                    backgroundColor: 'transparent',
                    color: 'var(--brand-green-text)',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Plus size={18} />
                  Add Another Passenger
                </button>
              </div>

              {/* Fare Summary */}
              <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div className="text-caption" style={{ fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fare Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bus Fare</span>
                  <span style={{ fontWeight: 600 }}>₹{selectedBus.fare} × {passengers.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GetGo Service Fee</span>
                  <span style={{ fontWeight: 600, color: '#16A34A' }}>₹0 (Free)</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total Amount</span>
                  <span style={{ color: 'var(--brand-green-text)' }}>₹{totalFare}</span>
                </div>
              </div>

              <button className="btn-primary" style={{ height: 50, fontSize: 15 }} onClick={handleConfirmBooking}>
                Confirm Booking & Pay ₹{totalFare}
              </button>
            </div>
          )}

          {/* STEP: CONFIRMED */}
          {step === 'confirmed' && selectedBus && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Success Badge */}
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'var(--brand-green-tint)', border: '2px solid var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Check size={32} color="var(--brand-green-text)" />
                </div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Booking Confirmed!</h2>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Booking Ref: <strong style={{ color: 'var(--brand-green-text)' }}>#{bookingRef}</strong></div>
              </div>

              {/* Booking Details */}
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Operator</span>
                  <span style={{ fontWeight: 700 }}>{selectedBus.operator}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bus Model</span>
                  <span style={{ fontWeight: 600 }}>{selectedBus.model}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Route</span>
                  <span style={{ fontWeight: 600 }}>{searchFrom} → {searchTo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Departure</span>
                  <span style={{ fontWeight: 600 }}>{travelDate} at {selectedBus.departureTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Bus Type</span>
                  <span className={`badge-flat${selectedBus.category === 'ac' ? '-green' : ''}`} style={{ fontSize: 12 }}>
                    {selectedBus.category === 'ac' ? '❄️ AC' : '💨 Non-AC'} · {selectedBus.type}
                  </span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>Passengers ({passengers.length})</div>
                  {passengers.map((p, i) => (
                    <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Pax {i + 1}: {p.name || 'Unnamed'}</span>
                      <span style={{ fontWeight: 600 }}>Age {p.age} · {p.gender}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 16 }}>
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--brand-green-text)' }}>₹{totalFare}</span>
                </div>
              </div>

              <button className="btn-primary" onClick={() => { setStep('search'); setSelectedBus(null); setPassengers([{ id: 1, name: '', age: '', gender: 'Male', seat: '' }]); navigate('/'); }}>
                Return to Home Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          2. PRIVATE GROUP BUS CHARTER
         ══════════════════════════════════════════════════════ */}
      {tab === 'charter' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Private Group Bus Charter & Rental</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Hire private buses for group trips, tours, weddings & corporate events (12 to 50 Passengers)</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Starting Pickup City</label>
                <input className="input-field" placeholder="e.g. Chennai, Tamil Nadu" value={charterFrom} onChange={e => setCharterFrom(e.target.value)} />
              </div>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Destination Tour City</label>
                <input className="input-field" placeholder="e.g. Ooty, Tamil Nadu" value={charterTo} onChange={e => setCharterTo(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 6 }}>Number of Passengers / Group Size</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[12, 30, 50].map(sz => (
                  <button
                    key={sz}
                    onClick={() => {
                      setGroupSize(sz);
                      const matching = PRIVATE_BUS_CHARTERS.find(c => c.capacity === sz);
                      if (matching) setSelectedCharterBus(matching);
                    }}
                    className={groupSize === sz ? 'badge-flat-green' : 'badge-flat'}
                    style={{ flex: 1, padding: 12, cursor: 'pointer', fontSize: 13, textAlign: 'center', fontWeight: 700, height: 44 }}
                  >
                    {sz} Pax
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Trip Starting Date</label>
                <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
              </div>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-muted)', fontWeight: 700, display: 'block', marginBottom: 4 }}>Trip Duration (Days)</label>
                <input className="input-field" type="number" min="1" max="15" value={charterDays} onChange={e => setCharterDays(Math.max(1, Number(e.target.value)))} />
              </div>
            </div>
          </div>

          {selectedCharterBus && (
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 18, borderRadius: 12, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)' }}>{selectedCharterBus.name}</div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{selectedCharterBus.type} · Max {selectedCharterBus.capacity} Passengers</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-green-text)' }}>₹{selectedCharterBus.perKmRate}/km</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedCharterBus.amenities.map((am, i) => (
                  <span key={i} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
                    <Check size={10} color="var(--brand-green-text)" /> {am}
                  </span>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 800 }}>
                <span style={{ fontSize: 13 }}>Est. Total ({charterDays} days × {selectedCharterBus.minKmPerDay} km/day min)</span>
                <span style={{ color: 'var(--brand-green-text)', fontSize: 20 }}>₹{calculatedCharterTotal}</span>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={handleCharterRequest} style={{ height: 50, fontSize: 15 }}>
            Request Group Bus Booking →
          </button>

          {/* Charter Confirmation Modal */}
          {showCharterConfirmModal && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
              <div className="flat-card" style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: 'var(--brand-green-tint)', border: '2px solid var(--brand-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Check size={28} color="var(--brand-green-text)" />
                  </div>
                  <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Charter Booking Requested!</h2>
                  <p className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>Ref: <strong>#{charterBookingRef}</strong></p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Route</span><span style={{ fontWeight: 700 }}>{charterFrom} → {charterTo}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Group Size</span><span style={{ fontWeight: 700 }}>{groupSize} Passengers</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>Duration</span><span style={{ fontWeight: 700 }}>{travelDate} · {charterDays} Days</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 8, fontWeight: 800, fontSize: 15 }}>
                    <span>Est. Rental Total</span><span style={{ color: 'var(--brand-green-text)' }}>₹{calculatedCharterTotal}</span>
                  </div>
                </div>
                <p className="text-caption" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Our GetGo Travel Executive will contact you shortly to confirm driver details & itinerary.</p>
                <button className="btn-primary" onClick={() => setShowCharterConfirmModal(false)}>Close & Done</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          3. INDIGO FLIGHTS
         ══════════════════════════════════════════════════════ */}
      {tab === 'flights' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>IndiGo Flight Search & Booking</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Search domestic & international flights with IndiGo pre-filled origin/destination</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="From Airport (e.g. Chennai MAA)" value={flightFrom} onChange={e => setFlightFrom(e.target.value)} />
            <input className="input-field" placeholder="To Airport (e.g. Delhi DEL)" value={flightTo} onChange={e => setFlightTo(e.target.value)} />
            <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => window.open(`https://www.goindigo.in/?origin=${flightFrom.slice(0,3)}&destination=${flightTo.slice(0,3)}`, '_blank', 'noopener,noreferrer')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>Search & Book on IndiGo Portal</span>
            <ExternalLink size={16} />
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          4. CONFIRMTKT TRAINS
         ══════════════════════════════════════════════════════ */}
      {tab === 'trains' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>ConfirmTkt / IRCTC Train Search & PNR</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Check IRCTC train availability, live PNR status & Tatkal booking with ConfirmTkt</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="From Station (e.g. Chennai Central MAS)" value={trainFrom} onChange={e => setTrainFrom(e.target.value)} />
            <input className="input-field" placeholder="To Station (e.g. Bangalore SBC)" value={trainTo} onChange={e => setTrainTo(e.target.value)} />
            <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={() => window.open('https://www.confirmtkt.com/rbooking/', '_blank', 'noopener,noreferrer')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>Search Trains on ConfirmTkt IRCTC Portal</span>
            <ExternalLink size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
