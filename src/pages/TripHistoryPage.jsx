import React, { useState } from 'react';
import { MOCK_TRIPS } from '../data/mockData';

const TYPE_ICONS = { ride: { bike: '🏍️', auto: '🛺', car: '🚗', van: '🚐' }, parcel: { bike: '📦' }, travel: { bus: '🚌', flight: '✈️' } };
const FILTERS = ['All', 'Rides', 'Parcels', 'Travel'];

export default function TripHistoryPage() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_TRIPS.filter(t => {
    if (filter === 'Rides') return t.type === 'ride';
    if (filter === 'Parcels') return t.type === 'parcel';
    if (filter === 'Travel') return t.type === 'travel';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="top-bar">
        <span className="top-bar-title">Trip History</span>
      </div>

      {/* Filters */}
      <div style={{ padding: '10px 16px', display: 'flex', gap: 8, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {FILTERS.map(f => (
          <button key={f} id={`filter-${f}`} onClick={() => setFilter(f)}
            style={{ flexShrink: 0, padding: '6px 16px', borderRadius: 'var(--radius-full)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', border: filter === f ? 'none' : '1px solid var(--border)', background: filter === f ? 'var(--brand-green)' : 'var(--bg-card)', color: filter === f ? '#fff' : 'var(--text-muted)', transition: 'var(--transition)' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[
          { label: 'Total Trips', value: MOCK_TRIPS.length },
          { label: 'Total Spent', value: `₹${MOCK_TRIPS.reduce((s, t) => s + t.fare, 0)}` },
          { label: 'Avg Rating', value: '⭐ ' + (MOCK_TRIPS.reduce((s, t) => s + (t.rating || 4), 0) / MOCK_TRIPS.length).toFixed(1) },
        ].map(stat => (
          <div key={stat.label} style={{ background: 'var(--bg-secondary)', padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1rem' }}>{stat.value}</div>
            <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗺️</div>
            <div className="empty-title">No trips found</div>
            <div className="empty-sub">Your {filter.toLowerCase()} will appear here</div>
          </div>
        ) : filtered.map(trip => (
          <TripCard key={trip.id} trip={trip} onOpen={() => setSelected(trip)} />
        ))}
      </div>

      {selected && <TripDetail trip={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function TripCard({ trip, onOpen }) {
  const images = { bike: '/assets/bike.png', auto: '/assets/auto.png', car: '/assets/car.png', van: '/assets/van.png' };
  const icons = { bus: '🚌', flight: '✈️' };
  const date = new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const typeLabel = { ride: 'Ride', parcel: 'Parcel', travel: 'Travel' }[trip.type];
  const typeBadge = { ride: 'badge-blue', parcel: 'badge-gold', travel: 'badge-green' }[trip.type];

  return (
    <div id={`history-trip-${trip.id}`} className="trip-card" onClick={onOpen}>
      <div style={{ width: 48, height: 48, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 4, overflow: 'hidden' }}>
        {images[trip.vehicle] ? (
          <img src={images[trip.vehicle]} alt={trip.vehicle} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: '1.375rem' }}>{icons[trip.vehicle] || '🚗'}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{date}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }}>
              {trip.dropoff}
            </div>
          </div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 800, color: 'var(--brand-green)', fontSize: '1.0625rem', flexShrink: 0 }}>₹{trip.fare}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
          <span className={`badge ${typeBadge}`}>{typeLabel}</span>
          {trip.driver && <span className="rating-badge">⭐ {trip.rating}</span>}
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{trip.distance} km · {trip.paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}

function TripDetail({ trip, onClose }) {
  const icons = { bike: '🏍️', auto: '🛺', car: '🚗', van: '🚐', bus: '🚌' };
  const date = new Date(trip.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bottom-sheet-overlay" onClick={onClose}>
      <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
        <div className="bottom-sheet-handle" />
        <div style={{ padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontFamily: 'Poppins', fontSize: '1.125rem', fontWeight: 700 }}>Trip Receipt</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{date}</div>
            </div>
            <span className="status-pill status-completed"><span className="status-dot" />Completed</span>
          </div>

          {/* Route */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#2563EB', flexShrink: 0, marginTop: 2 }} />
                <div><div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pickup</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{trip.pickup}</div></div>
              </div>
              <div style={{ borderLeft: '2px dashed var(--border)', marginLeft: 7, height: 10 }} />
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#EF4444', flexShrink: 0, marginTop: 2 }} />
                <div><div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Drop-off</div><div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{trip.dropoff}</div></div>
              </div>
            </div>
          </div>

          {/* Driver */}
          {trip.driver && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '12px 14px', border: '1px solid var(--border)' }}>
              <div style={{ width: 44, height: 44, background: 'var(--bg-input)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', flexShrink: 0 }}>{icons[trip.vehicle]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{trip.driver.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{trip.driver.vehicleModel} · {trip.driver.vehicleNo}</div>
              </div>
              <span className="rating-badge">⭐ {trip.driver.rating}</span>
            </div>
          )}

          {/* Fare */}
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Fare Breakdown</div>
            {[
              { label: 'Base fare', val: Math.round(trip.fare * 0.7) },
              { label: `Distance (${trip.distance} km)`, val: Math.round(trip.fare * 0.25) },
              { label: 'Taxes & fees', val: Math.round(trip.fare * 0.05) },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                <span>₹{row.val}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.25rem', color: 'var(--brand-green)' }}>₹{trip.fare}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paid via {trip.paymentMethod}</div>
          </div>

          {/* Rating your trip */}
          {trip.rating && (
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '12px 14px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Your rating</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700 }}>{'⭐'.repeat(trip.rating)} ({trip.rating}/5)</span>
            </div>
          )}

          <button id="close-receipt-btn" className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
