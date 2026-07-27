import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [tab, setTab] = useState('bus'); // bus | flights | trains
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <span className="top-bar-title">Travel</span>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '0 16px' }}>
        {[
          { id: 'bus', label: '🚌 Bus', desc: 'Native' },
          { id: 'flights', label: '✈️ Flights', desc: 'Partner' },
          { id: 'trains', label: '🚂 Trains', desc: 'Partner' },
        ].map(t => (
          <button key={t.id} id={`tab-${t.id}`} onClick={() => setTab(t.id)}
            style={{ flex: 1, padding: '12px 4px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? 'var(--brand-green)' : 'var(--text-muted)', borderBottom: tab === t.id ? '2px solid var(--brand-green)' : '2px solid transparent', transition: 'var(--transition)' }}>
            {t.label}
            <span style={{ display: 'block', fontSize: '0.625rem', color: tab === t.id ? 'rgba(0,166,81,0.7)' : 'var(--text-muted)' }}>{t.desc}</span>
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {tab === 'bus' && <BusTab />}
        {tab === 'flights' && <AffiliateTab type="flights" />}
        {tab === 'trains' && <AffiliateTab type="trains" />}
      </div>
    </div>
  );
}

function BusTab() {
  const [searchFrom, setSearchFrom] = useState('Chennai');
  const [searchTo, setSearchTo] = useState('');
  const [travelDate, setTravelDate] = useState(new Date().toISOString().split('T')[0]);
  const [results, setResults] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedDep, setSelectedDep] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [booked, setBooked] = useState(false);
  const [step, setStep] = useState('search'); // search | results | seats | payment | confirmed

  const handleSearch = () => {
    const route = BUS_ROUTES.find(r =>
      r.from.toLowerCase() === searchFrom.toLowerCase() &&
      r.to.toLowerCase() === searchTo.toLowerCase()
    );
    if (route) {
      setSelectedRoute(route);
      setResults(route.departures);
      setStep('results');
    } else {
      // Show all routes as fallback
      setSelectedRoute(null);
      setResults(BUS_ROUTES.flatMap(r => r.departures.map(d => ({ ...d, routeLabel: `${r.from} → ${r.to}` }))));
      setStep('results');
    }
  };

  if (step === 'search') return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', height: 100, position: 'relative', border: '1.5px solid rgba(124,58,237,0.3)', boxShadow: 'var(--shadow-md)', flexShrink: 0 }}>
        <img src="assets/travel_banner.png" alt="Intercity Travel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.3) 100%)', padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.0625rem', color: '#fff' }}>Intercity Travel Booking</div>
          <div style={{ fontSize: '0.75rem', color: '#A78BFA', fontWeight: 600, marginTop: 2 }}>🚍 Volvo Buses · ✈️ Flights · 🚆 IRCTC Trains</div>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(135deg,rgba(0,166,81,0.15),rgba(0,100,50,0.1))', border: '1px solid rgba(0,166,81,0.2)', borderRadius: 'var(--radius-xl)', padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="section-title" style={{ marginBottom: 0 }}>Search Bus Tickets</div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#2563EB' }} />
          <input id="bus-from" className="input-field" style={{ paddingLeft: 32 }} placeholder="From (e.g. Chennai)" value={searchFrom} onChange={e => setSearchFrom(e.target.value)} />
        </div>

        <button onClick={() => { const t = searchFrom; setSearchFrom(searchTo); setSearchTo(t); }}
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '50%', width: 36, height: 36, alignSelf: 'center', cursor: 'pointer', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          ⇅
        </button>

        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 8, height: 8, borderRadius: '50%', background: '#EF4444' }} />
          <input id="bus-to" className="input-field" style={{ paddingLeft: 32 }} placeholder="To (e.g. Madurai)" value={searchTo} onChange={e => setSearchTo(e.target.value)} />
        </div>

        <input id="travel-date" type="date" className="input-field" value={travelDate} onChange={e => setTravelDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />

        <button id="search-bus-btn" className="btn btn-primary" onClick={handleSearch} disabled={!searchFrom || !searchTo}>
          🚌 Search Buses →
        </button>
      </div>

      <div className="section-title">Popular Routes</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {POPULAR_ROUTES.map(r => (
          <div key={r.to} id={`route-${r.to}`} onClick={() => { setSearchFrom(r.from); setSearchTo(r.to); }}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 14px', cursor: 'pointer', transition: 'var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,166,81,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.from}</div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, marginTop: 2 }}>→ {r.to}</div>
            <div style={{ fontSize: '0.6875rem', color: 'var(--brand-green)', marginTop: 4 }}>
              from ₹{BUS_ROUTES.find(br => br.to === r.to)?.departures.reduce((min, d) => Math.min(min, d.fare), Infinity) || '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (step === 'results') return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button className="back-btn" onClick={() => setStep('search')}>←</button>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{searchFrom} → {searchTo || 'All Routes'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(travelDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · {(results || []).length} buses</div>
        </div>
      </div>

      {(results || []).map(dep => (
        <div key={dep.id} id={`bus-dep-${dep.id}`} className="card" style={{ cursor: 'pointer' }}
          onClick={() => { setSelectedDep(dep); setStep('seats'); }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,166,81,0.3)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          {dep.routeLabel && <div style={{ fontSize: '0.6875rem', color: 'var(--brand-green)', marginBottom: 8, fontWeight: 600 }}>{dep.routeLabel}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.0625rem' }}>{dep.operator}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{dep.type}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.25rem', color: 'var(--brand-green)' }}>₹{dep.fare}</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>per seat</div>
            </div>
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{dep.time}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Departs</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                <div style={{ height: 1, width: 24, background: 'var(--border)' }} />
                <span style={{ fontSize: '0.6875rem' }}>{selectedRoute?.duration || '~8h'}</span>
                <div style={{ height: 1, width: 24, background: 'var(--border)' }} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{dep.arrival}</div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Arrives</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <span className="rating-badge">⭐ {dep.rating}</span>
              <span style={{ fontSize: '0.6875rem', color: dep.seatsLeft <= 5 ? '#F87171' : 'var(--brand-green)', fontWeight: 600 }}>{dep.seatsLeft} seats left</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (step === 'seats') {
    const allSeats = Array.from({ length: 40 }, (_, i) => ({ no: `${String.fromCharCode(65 + Math.floor(i / 4))}${(i % 4) + 1}`, booked: Math.random() < 0.45 }));
    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="back-btn" onClick={() => setStep('results')}>←</button>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Select Seat</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedDep?.operator} · {selectedDep?.type}</div>
          </div>
        </div>

        {/* Seat legend */}
        <div style={{ display: 'flex', gap: 16, fontSize: '0.75rem' }}>
          {[['var(--bg-card)', 'Available'], ['var(--brand-green)', 'Selected'], ['var(--bg-input)', 'Booked']].map(([bg, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 14, height: 14, background: bg, borderRadius: 3, border: '1px solid var(--border)' }} />
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Bus schematic */}
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 12 }}>🚌 Front</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {allSeats.map((seat, i) => (
              <div key={seat.no} id={`seat-${seat.no}`}
                className={`seat ${seat.booked ? 'booked' : selectedSeat === seat.no ? 'selected' : 'available'}`}
                onClick={() => !seat.booked && setSelectedSeat(seat.no)}
                style={{ fontSize: '0.5625rem' }}
              >
                {seat.no}
              </div>
            ))}
          </div>
        </div>

        {selectedSeat && (
          <div style={{ background: 'rgba(0,166,81,0.1)', border: '1px solid rgba(0,166,81,0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>Seat {selectedSeat}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{selectedDep?.type}</div>
            </div>
            <div style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'var(--brand-green)', fontSize: '1.25rem' }}>₹{selectedDep?.fare}</div>
          </div>
        )}

        <button id="book-seat-btn" className="btn btn-primary" disabled={!selectedSeat} onClick={() => setStep('confirmed')}>
          Book Seat {selectedSeat || ''} — ₹{selectedDep?.fare}
        </button>
      </div>
    );
  }

  if (step === 'confirmed') return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20, animation: 'slideUp 0.4s ease' }}>
      <div style={{ width: 80, height: 80, background: 'rgba(0,166,81,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>🎉</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Poppins', fontSize: '1.375rem', fontWeight: 800 }}>Booking Confirmed!</div>
        <div style={{ color: 'var(--text-muted)', marginTop: 6 }}>{selectedDep?.operator} · Seat {selectedSeat}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{searchFrom} → {searchTo || 'Destination'} · {selectedDep?.time}</div>
      </div>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', padding: '20px 28px', textAlign: 'center', border: '1.5px solid var(--brand-green)', width: '100%' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Booking ID</div>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.25rem', marginTop: 4 }}>GG{Math.random().toString(36).slice(2,8).toUpperCase()}</div>
        <div className="divider" />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Paid</span>
          <span style={{ fontWeight: 700, color: 'var(--brand-green)' }}>₹{selectedDep?.fare}</span>
        </div>
      </div>
      <button id="done-booking-btn" className="btn btn-primary" onClick={() => setStep('search')}>Done</button>
    </div>
  );

  return null;
}

function AffiliateTab({ type }) {
  const config = {
    flights: {
      icon: '✈️',
      title: 'Book Flights',
      sub: 'Best fares from IndiGo Airlines',
      partner: 'IndiGo Airlines',
      partnerIcon: '🛫',
      color: '#2563EB',
      url: 'https://www.goindigo.in/?utm_source=google&utm_medium=Conversion_CPC&utm_campaign=BAU|Google|Search_brand_domestic|17Januray2026&cid=Search|Brand|P|Google_BAU|Domestic|Maximizeclicks|IndigoWebAddress|LowFares|21April2026&s_kwcid=AL!12293!3!806280615791!b!!g!!www%20indigo%20seat%20booking&gad_source=1&gad_campaignid=23776134671&gbraid=0AAAAAD-UqxbG8FMHsIUxFCBCyYYng-c6i&gclid=Cj0KCQjwg5zTBhCLARIsAP2AFU7QirXYZAlTEtlSrOcRVCVOCs0VLa95HpStCuinjYCa5VRfAhlKQHEaAj6fEALw_wcB',
      features: ['Real-time fares', 'Instant e-tickets', 'Easy cancellation', '500+ routes'],
    },
    trains: {
      icon: '🚂',
      title: 'Book Trains',
      sub: 'ConfirmTkt IRCTC Train Booking',
      partner: 'ConfirmTkt IRCTC Partner',
      partnerIcon: '🛤️',
      color: '#7C3AED',
      url: 'https://www.confirmtkt.com/rbooking/?utm_source=Google&utm_medium=paid_search_google_trains&utm_campaign=train_search_mweb&gad_source=1&gad_campaignid=23829969989&gbraid=0AAAAADgp7p1iIAuW1EcEStlmorYc6RoJ_&gclid=Cj0KCQjwg5zTBhCLARIsAP2AFU51LsquEHO14lsZwWTe5Lk8Eo4TZ-AS348rDHNPzaEV1ANIWRKlpSgaAntkEALw_wcB',
      features: ['All IRCTC trains', 'Tatkal booking', 'PNR tracking', '100% seat confirmation'],
    },
  }[type];

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="affiliate-card" style={{ borderColor: `${config.color}50`, background: `linear-gradient(135deg,${config.color}1A,${config.color}08)` }}>
        <div style={{ fontSize: '4rem' }}>{config.icon}</div>
        <div>
          <div style={{ fontFamily: 'Poppins', fontSize: '1.375rem', fontWeight: 800 }}>{config.title}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>{config.sub}</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%' }}>
          {config.features.map(f => (
            <div key={f} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: config.color }}>✓</span> {f}
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ fontSize: '1.75rem' }}>{config.partnerIcon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Powered by</div>
          <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{config.partner}</div>
        </div>
        <span className="badge badge-blue">Partner</span>
      </div>

      <button id={`redirect-${type}-btn`} className="btn btn-primary"
        style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}CC)`, boxShadow: `0 4px 20px ${config.color}40` }}
        onClick={() => window.open(config.url, '_blank')}
      >
        {config.icon} Continue to {config.partner} →
      </button>

      <div style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.75rem', color: 'rgba(255,215,0,0.8)', display: 'flex', gap: 8 }}>
        <span>⚠️</span>
        <span><strong>Prototype note:</strong> This is an affiliate redirect. The button links to {config.partner}'s live website as the designated partner. No GetGo data is shared in the redirect.</span>
      </div>
    </div>
  );
}
