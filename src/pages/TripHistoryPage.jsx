import React, { useState } from 'react';
import { Car, Package, Compass, Calendar, MapPin, Check, Star, X } from 'lucide-react';
import { MOCK_TRIPS } from '../data/mockData';
import { VEHICLE_BASE64 } from '../assets/vehicleBase64';
import { useLanguage } from '../App';

const VEHICLE_IMAGES = VEHICLE_BASE64;

export default function TripHistoryPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const FILTERS = [
    { id: 'All', label: 'All' },
    { id: 'Rides', label: t('trips') || 'Rides' },
    { id: 'Parcels', label: t('sendParcel') || 'Parcels' },
    { id: 'Travel', label: t('travel') || 'Travel' },
  ];

  const filtered = MOCK_TRIPS.filter(tr => {
    if (filter === 'Rides') return tr.type === 'ride';
    if (filter === 'Parcels') return tr.type === 'parcel';
    if (filter === 'Travel') return tr.type === 'travel';
    return true;
  });

  const totalSpent = MOCK_TRIPS.reduce((s, tr) => s + tr.fare, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div>
        <h1 className="text-section" style={{ color: 'var(--text-primary)' }}>
          {t('recentTrips') || 'Trip History'}
        </h1>
        <p className="text-caption" style={{ color: 'var(--text-secondary)' }}>
          Your past rides, parcel deliveries & intercity travel receipts
        </p>
      </div>

      {/* Stats Bar (Flat Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="flat-card" style={{ padding: 12, textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Total Trips</div>
          <div className="text-subtitle" style={{ color: 'var(--text-primary)', marginTop: 2 }}>{MOCK_TRIPS.length}</div>
        </div>
        <div className="flat-card" style={{ padding: 12, textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Total Spent</div>
          <div className="text-subtitle" style={{ color: 'var(--brand-green-text)', marginTop: 2 }}>₹{totalSpent}</div>
        </div>
        <div className="flat-card" style={{ padding: 12, textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Avg Rating</div>
          <div className="text-subtitle" style={{ color: 'var(--text-primary)', marginTop: 2 }}>4.8 ★</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
        {FILTERS.map(f => {
          const isAct = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={isAct ? 'badge-flat-green' : 'badge-flat'}
              style={{ padding: '8px 16px', cursor: 'pointer', fontSize: 14 }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Trip List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="flat-card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
            No trips found for {filter.toLowerCase()}.
          </div>
        ) : (
          filtered.map(trip => {
            const Icon = trip.type === 'parcel' ? Package : trip.type === 'travel' ? Compass : Car;
            const date = new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

            return (
              <div
                key={trip.id}
                className="flat-card-interactive"
                onClick={() => setSelected(trip)}
                style={{ display: 'flex', alignItems: 'center', gap: 16 }}
              >
                {/* Vehicle Photo Container with GetGo Sticker Overlay */}
                <div style={{
                  width: 60,
                  height: 44,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid var(--border)',
                  padding: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img src={VEHICLE_IMAGES[trip.vehicle] || carImg} alt={trip.vehicle || trip.type} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 1,
                    backgroundColor: '#1B5E20',
                    color: '#FFFFFF',
                    fontSize: 7,
                    fontWeight: 800,
                    padding: '1px 3px',
                    borderRadius: 3,
                    letterSpacing: '0.05em'
                  }}>
                    GetGo
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div className="text-body-medium" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>
                      {trip.dropoff}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--brand-green-text)', flexShrink: 0 }}>
                      ₹{trip.fare}
                    </div>
                  </div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                    GetGo {trip.vehicle ? trip.vehicle.toUpperCase() : 'RIDE'} · {date} · {trip.distance} km
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Trip Detail Receipt Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Trip Receipt</h2>
                <div className="text-caption" style={{ color: 'var(--text-muted)' }}>
                  {new Date(selected.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Pickup</span>
                <span style={{ fontWeight: 600 }}>{selected.pickup}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Destination</span>
                <span style={{ fontWeight: 600 }}>{selected.dropoff}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Distance</span>
                <span style={{ fontWeight: 600 }}>{selected.distance} km</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Payment Method</span>
                <span style={{ fontWeight: 600 }}>{selected.paymentMethod}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Total Amount Paid</span>
                <span style={{ color: 'var(--brand-green-text)', fontSize: 18 }}>₹{selected.fare}</span>
              </div>
            </div>

            <button className="btn-primary" onClick={() => setSelected(null)}>
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
