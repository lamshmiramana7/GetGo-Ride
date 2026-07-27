import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Plane, Compass, ArrowLeft, Search, Calendar, MapPin, ExternalLink, Check, ChevronRight } from 'lucide-react';
import { BUS_ROUTES } from '../data/mockData';

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
            Intercity Travel
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
            Bus tickets, flight bookings & train partner links
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, backgroundColor: 'var(--bg-surface)', padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
        {[
          { id: 'bus', label: 'Bus Tickets', icon: Bus },
          { id: 'flights', label: 'Flights', icon: Plane },
          { id: 'trains', label: 'Trains', icon: Compass },
        ].map(t => {
          const Icon = t.icon;
          const isAct = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setStep('search'); }}
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
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── BUS TAB CONTENT ── */}
      {tab === 'bus' && (
        <>
          {step === 'search' && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Search Intercity Buses</h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Express AC & Sleeper buses across Tamil Nadu</p>
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
                Search Available Buses
              </button>
            </div>
          )}

          {step === 'results' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="flat-card" style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{searchFrom} → {searchTo}</div>
                  <div className="text-caption" style={{ color: 'var(--text-secondary)' }}>{travelDate}</div>
                </div>
                <button className="btn-secondary" onClick={() => setStep('search')} style={{ width: 'auto', height: 36, padding: '0 12px', fontSize: 13 }}>
                  Modify Search
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {BUS_ROUTES[0].departures.map(b => (
                  <div key={b.id} className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{b.operator}</div>
                        <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{b.type} · {b.seatsLeft} seats left</div>
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--brand-green-text)' }}>₹{b.fare}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--text-secondary)' }}>
                      <span>Departure: {b.time}</span>
                      <span>Arrival: {b.arrival}</span>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={() => { setSelectedTicket(b); setStep('confirmed'); }}
                    >
                      Book Ticket — ₹{b.fare}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'confirmed' && selectedTicket && (
            <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <span className="badge-flat-green"><Check size={14} /> Bus Booking Confirmed</span>
                <h2 className="text-section" style={{ color: 'var(--text-primary)', marginTop: 8 }}>E-Ticket Reserved</h2>
              </div>

              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Operator</span>
                  <span style={{ fontWeight: 600 }}>{selectedTicket.operator}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Route</span>
                  <span style={{ fontWeight: 600 }}>{searchFrom} → {searchTo}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Departure</span>
                  <span style={{ fontWeight: 600 }}>{selectedTicket.time} ({travelDate})</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Fare Paid</span>
                  <span style={{ color: 'var(--brand-green-text)' }}>₹{selectedTicket.fare}</span>
                </div>
              </div>

              <button className="btn-primary" onClick={() => navigate('/')}>
                Return to Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {/* ── FLIGHTS PARTNER TAB ── */}
      {tab === 'flights' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Flight Booking Partner</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Book domestic & international flights via IndiGo</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>IndiGo Flight Partner Redirect</div>
            <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Search best airfares across Indian destinations with GetGo partner integration.</div>
          </div>

          <a
            href="https://www.goindigo.in/?utm_source=google&utm_medium=cpc&utm_campaign=Brand_Search_Core_Exact&gad_source=1"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'inline-flex', textDecoration: 'none' }}
          >
            <span>Proceed to IndiGo Flight Partner</span>
            <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* ── TRAINS PARTNER TAB ── */}
      {tab === 'trains' && (
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>IRCTC Train Partner</h2>
            <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>Book train tickets & check PNR status via ConfirmTkt</p>
          </div>

          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>ConfirmTkt IRCTC Partner Redirect</div>
            <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Check live seat availability, Tatkal booking, and PNR status.</div>
          </div>

          <a
            href="https://www.confirmtkt.com/rbooking/?utm_source=Google&utm_medium=Search_CPC&utm_campaign=Brand_Confirmtkt&gclid=CjwKCAiAy2C9BhA4EiwAY2Z41E9G2p1y"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ display: 'inline-flex', textDecoration: 'none' }}
          >
            <span>Proceed to ConfirmTkt Train Partner</span>
            <ExternalLink size={16} />
          </a>
        </div>
      )}
    </div>
  );
}
