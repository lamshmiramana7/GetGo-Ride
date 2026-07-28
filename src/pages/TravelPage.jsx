import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Plane, Compass, ArrowLeft, Search, Calendar, MapPin, ExternalLink, Check, Users, ShieldCheck, Ticket } from 'lucide-react';
import { BUS_ROUTES, PRIVATE_BUS_CHARTERS, INDIAN_GEOGRAPHY } from '../data/mockData';
import { useLanguage } from '../App';

const POPULAR_ROUTES = [
  { from: 'Chennai', to: 'Madurai' },
  { from: 'Chennai', to: 'Coimbatore' },
  { from: 'Chennai', to: 'Trichy' },
  { from: 'Chennai', to: 'Bangalore' },
  { from: 'Chennai', to: 'Hyderabad' },
  { from: 'Chennai', to: 'Pondicherry' },
];

export default function TravelPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [tab, setTab] = useState('bus'); // 'bus' | 'charter' | 'flights' | 'trains'
  const [searchFrom, setSearchFrom] = useState('Chennai');
  const [searchTo, setSearchTo] = useState('Madurai');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [step, setStep] = useState('search'); // 'search' | 'results' | 'confirmed'
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Group Charter State
  const [groupSize, setGroupSize] = useState(30);
  const [charterDays, setCharterDays] = useState(2);
  const [selectedCharterBus, setSelectedCharterBus] = useState(PRIVATE_BUS_CHARTERS[1]);

  // Flight Search State
  const [flightFrom, setFlightFrom] = useState('Chennai (MAA)');
  const [flightTo, setFlightTo] = useState('Delhi (DEL)');

  // Train Search State
  const [trainFrom, setTrainFrom] = useState('Chennai Central (MAS)');
  const [trainTo, setTrainTo] = useState('Bangalore City (SBC)');

  const handleSearch = () => {
    setStep('results');
  };

  const handleIndiGoRedirect = () => {
    const url = `https://www.goindigo.in/?origin=${encodeURIComponent(flightFrom.slice(0, 3))}&destination=${encodeURIComponent(flightTo.slice(0, 3))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleConfirmTktRedirect = () => {
    const url = `https://www.confirmtkt.com/r列車-search/${encodeURIComponent(trainFrom.split(' ')[0])}-to-${encodeURIComponent(trainTo.split(' ')[0])}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          className="btn-secondary"
          onClick={() => {
            if (step === 'search') navigate('/');
            else setStep('search');
          }}
          style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
            {t('travel') || 'Intercity Travel & Group Bus Charter'}
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Scheduled Buses, 50-Passenger Group Charters, IndiGo Flights & ConfirmTkt Trains
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, backgroundColor: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        {[
          { id: 'bus', label: 'Intercity Bus', icon: Bus },
          { id: 'charter', label: 'Group Bus Charter (50 Pax)', icon: Users },
          { id: 'flights', label: 'IndiGo Flights', icon: Plane },
          { id: 'trains', label: 'ConfirmTkt Trains', icon: Compass },
        ].map(tObj => {
          const Icon = tObj.icon;
          const isAct = tab === tObj.id;
          return (
            <button
              key={tObj.id}
              onClick={() => { setTab(tObj.id); setStep('search'); }}
              style={{
                flex: 1,
                minWidth: 140,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isAct ? 'var(--brand-green)' : 'transparent',
                color: isAct ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                transition: 'background-color 0.15s ease',
              }}
            >
              <Icon size={16} />
              <span>{tObj.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 1. INTERCITY BUS TAB ── */}
      {tab === 'bus' && (
        <>
          {step === 'search' && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Search Intercity Volvo & AC Buses</h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Express AC Sleeper & Seater buses across Tamil Nadu & India</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="input-field"
                  placeholder="From (Origin city)"
                  value={searchFrom}
                  onChange={e => setSearchFrom(e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="To (Destination city)"
                  value={searchTo}
                  onChange={e => setSearchTo(e.target.value)}
                />
                <input
                  className="input-field"
                  type="date"
                  value={travelDate}
                  onChange={e => setTravelDate(e.target.value)}
                />
              </div>

              {/* Popular Routes */}
              <div>
                <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Popular Intercity Routes</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {POPULAR_ROUTES.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => { setSearchFrom(r.from); setSearchTo(r.to); }}
                      className="badge-flat"
                      style={{ cursor: 'pointer' }}
                    >
                      {r.from} → {r.to}
                    </button>
                  ))}
                </div>
              </div>

              <button className="btn-primary" onClick={handleSearch}>
                Search Buses →
              </button>
            </div>
          )}

          {step === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flat-card" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{searchFrom} → {searchTo}</span>
                <span style={{ color: 'var(--text-muted)' }}>{travelDate}</span>
              </div>

              <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Available Scheduled Buses ({BUS_ROUTES.length})</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BUS_ROUTES.map(b => (
                  <div key={b.id} className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="text-body-medium" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{b.operator}</div>
                        <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{b.busType}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-green-text)' }}>₹{b.fare}</div>
                        <div className="badge-flat-green" style={{ fontSize: 11 }}>{b.seatsLeft} seats left</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', padding: 10, borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                      <div>
                        <strong>{b.departureTime}</strong><br />
                        <span style={{ color: 'var(--text-muted)' }}>{searchFrom}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.duration}</div>
                      <div style={{ textAlign: 'right' }}>
                        <strong>{b.arrivalTime}</strong><br />
                        <span style={{ color: 'var(--text-muted)' }}>{searchTo}</span>
                      </div>
                    </div>

                    <button className="btn-primary" onClick={() => { setSelectedTicket(b); setStep('confirmed'); }}>
                      Book Seat — ₹{b.fare}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'confirmed' && selectedTicket && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <span className="badge-flat-green"><Check size={14} /> Ticket Confirmed</span>
                <h2 className="text-section" style={{ color: 'var(--text-primary)', marginTop: 8 }}>{selectedTicket.operator}</h2>
                <p className="text-caption" style={{ color: 'var(--text-muted)' }}>PNR: #GG-BUS-{Date.now().toString().slice(-6)}</p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Route</span>
                  <span style={{ fontWeight: 600 }}>{searchFrom} → {searchTo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Date & Time</span>
                  <span style={{ fontWeight: 600 }}>{travelDate} at {selectedTicket.departureTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Seat No</span>
                  <span style={{ fontWeight: 600 }}>A12 (Window)</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total Paid</span>
                  <span style={{ color: 'var(--brand-green-text)' }}>₹{selectedTicket.fare}</span>
                </div>
              </div>

              <button className="btn-primary" onClick={() => { setStep('search'); navigate('/'); }}>
                Return to Home Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {/* ── 2. PRIVATE GROUP BUS CHARTER (50-Pax Group Travel) ── */}
      {tab === 'charter' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Private Group Bus Charter & Rental</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
              Hire private buses for group trips, tours, weddings & corporate events (12 to 50 Passengers)
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Number of Passengers / Group Size
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[12, 30, 50].map(sz => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setGroupSize(sz);
                      const matching = PRIVATE_BUS_CHARTERS.find(c => c.capacity === sz);
                      if (matching) setSelectedCharterBus(matching);
                    }}
                    className={groupSize === sz ? 'badge-flat-green' : 'badge-flat'}
                    style={{ flex: 1, padding: 10, cursor: 'pointer', fontSize: 13, textAlign: 'center' }}
                  >
                    {sz} Passengers
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Trip Starting Date
                </label>
                <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
              </div>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Trip Duration (Days)
                </label>
                <input className="input-field" type="number" min="1" max="15" value={charterDays} onChange={e => setCharterDays(Number(e.target.value))} />
              </div>
            </div>
          </div>

          {/* Selected Bus Charter Vehicle Option Card */}
          {selectedCharterBus && (
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 18, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="text-subtitle" style={{ color: 'var(--text-primary)', fontSize: 16 }}>{selectedCharterBus.name}</div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 2 }}>{selectedCharterBus.type} · Max Capacity: {selectedCharterBus.capacity} Passengers</div>
                </div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--brand-green-text)' }}>
                  ₹{selectedCharterBus.perKmRate}/km
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedCharterBus.amenities.map((am, i) => (
                  <span key={i} className="badge-flat" style={{ fontSize: 11 }}>
                    <Check size={12} color="var(--brand-green-text)" /> {am}
                  </span>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
                <span>Estimated Daily Rental ({charterDays} Days min {selectedCharterBus.minKmPerDay * charterDays} km)</span>
                <span style={{ color: 'var(--brand-green-text)' }}>
                  ₹{selectedCharterBus.minKmPerDay * selectedCharterBus.perKmRate * charterDays + (selectedCharterBus.driverAllowancePerDay * charterDays)}
                </span>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={() => alert(`Group Charter Booking Requested for ${groupSize} passengers! Our travel executive will contact you shortly.`)}>
            Request Group Bus Booking →
          </button>
        </div>
      )}

      {/* ── 3. INDIGO FLIGHTS TAB ── */}
      {tab === 'flights' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>IndiGo Flight Search & Fares</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
              Search domestic flights with IndiGo pre-filled search integration & zero convenience fee
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="From Airport (e.g. Chennai MAA)" value={flightFrom} onChange={e => setFlightFrom(e.target.value)} />
            <input className="input-field" placeholder="To Airport (e.g. Delhi DEL)" value={flightTo} onChange={e => setFlightTo(e.target.value)} />
            <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={handleIndiGoRedirect} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>Search Flights on IndiGo Portal</span>
            <ExternalLink size={16} />
          </button>
        </div>
      )}

      {/* ── 4. CONFIRMTKT TRAINS TAB ── */}
      {tab === 'trains' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>ConfirmTkt / IRCTC Train Search & PNR</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
              Check IRCTC train availability, seat booking & live PNR status with ConfirmTkt integration
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="input-field" placeholder="From Station (e.g. Chennai Central MAS)" value={trainFrom} onChange={e => setTrainFrom(e.target.value)} />
            <input className="input-field" placeholder="To Station (e.g. Bangalore SBC)" value={trainTo} onChange={e => setTrainTo(e.target.value)} />
            <input className="input-field" type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} />
          </div>

          <button className="btn-primary" onClick={handleConfirmTktRedirect} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span>Search Trains on ConfirmTkt IRCTC Portal</span>
            <ExternalLink size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
