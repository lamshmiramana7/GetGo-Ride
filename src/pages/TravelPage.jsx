import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Plane, Compass, ArrowLeft, Search, Calendar, MapPin, ExternalLink, Check, ChevronRight } from 'lucide-react';
import { BUS_ROUTES } from '../data/mockData';
import { TRAVEL_BANNER_BASE64, BUS_IMG_BASE64 } from '../assets/mediaBase64';
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
  const [tab, setTab] = useState('bus'); // 'bus' | 'flights' | 'trains'
  const [searchFrom, setSearchFrom] = useState('Chennai');
  const [searchTo, setSearchTo] = useState('Madurai');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [step, setStep] = useState('search'); // 'search' | 'results' | 'confirmed'
  const [selectedTicket, setSelectedTicket] = useState(null);

  const handleSearch = () => {
    setStep('results');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            {t('travel') || 'Intercity Travel'}
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Bus, Flight & Train ticket booking across India
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, backgroundColor: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        {[
          { id: 'bus', label: 'Bus Tickets', icon: Bus },
          { id: 'flights', label: 'Flights', icon: Plane },
          { id: 'trains', label: 'Trains', icon: Compass },
        ].map(tObj => {
          const Icon = tObj.icon;
          const isAct = tab === tObj.id;
          return (
            <button
              key={tObj.id}
              onClick={() => { setTab(tObj.id); setStep('search'); }}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 'var(--radius-sm)',
                backgroundColor: isAct ? 'var(--brand-green)' : 'transparent',
                color: isAct ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: 14,
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

      {/* ── BUS TAB CONTENT ── */}
      {tab === 'bus' && (
        <>
          {step === 'search' && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Professional Travel Banner Picture */}
              <div style={{ height: 100, borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                <img src={TRAVEL_BANNER_BASE64} alt="Intercity Bus Travel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{t('travel') || 'Intercity Volvo Bus & Travel'}</div>
                  <div style={{ fontSize: 12, color: 'var(--brand-green-text)', marginTop: 2 }}>AC Sleeper & Seater · Verified Operators</div>
                </div>
              </div>
              <div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Search Intercity Buses</h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Express AC & Sleeper buses across Tamil Nadu & India</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  className="input-field"
                  placeholder={t('pickupPlaceholder') || 'From (Origin city)'}
                  value={searchFrom}
                  onChange={e => setSearchFrom(e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder={t('dropoffPlaceholder') || 'To (Destination city)'}
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
                <div className="text-caption" style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{t('quickDestinations') || 'Popular Intercity Routes'}</div>
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
                {t('continueBtn') || 'Search Buses'}
              </button>
            </div>
          )}

          {step === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flat-card" style={{ padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14 }}>
                <span style={{ fontWeight: 600 }}>{searchFrom} → {searchTo}</span>
                <span style={{ color: 'var(--text-muted)' }}>{travelDate}</span>
              </div>

              <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Available Buses ({BUS_ROUTES.length})</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BUS_ROUTES.map(b => (
                  <div key={b.id} className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{b.operator}</div>
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
                      {t('confirmBooking') || 'Book Seat'} — ₹{b.fare}
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
                {t('home') || 'Return to Home Dashboard'}
              </button>
            </div>
          )}
        </>
      )}

      {/* ── FLIGHTS / TRAINS PLACEHOLDER ── */}
      {tab !== 'bus' && (
        <div className="flat-card" style={{ textAlign: 'center', padding: 36, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <Compass size={40} color="var(--brand-green-text)" />
          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>{tab === 'flights' ? 'Intercity Flight Search' : 'IRCTC Train Booking'}</h2>
          <p className="text-caption" style={{ color: 'var(--text-secondary)', maxWidth: 320 }}>
            Compare lowest fares across major airlines & IRCTC train routes with GetGo 0% booking convenience fee.
          </p>
          <button className="btn-primary" onClick={() => setTab('bus')}>
            Switch to Intercity Bus Search
          </button>
        </div>
      )}
    </div>
  );
}
