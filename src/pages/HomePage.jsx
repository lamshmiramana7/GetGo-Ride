import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Package, Compass, MapPin, Search, ChevronRight, Home as HomeIcon, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth, useLanguage, useLocation } from '../App';
import { MOCK_USER, MOCK_TRIPS, SAVED_ADDRESSES } from '../data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { userLocation } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = (user?.name || MOCK_USER.name).split(' ')[0];
  const recentTrips = MOCK_TRIPS.slice(0, 3);

  const SERVICES = [
    {
      id: 'ride',
      title: t('bookRide') || 'Book a Ride',
      subtitle: 'Bike · Auto · Sedan · XL Van',
      icon: Car,
      color: 'var(--brand-green)',
      path: '/ride',
    },
    {
      id: 'parcel',
      title: t('sendParcel') || 'Send Parcel',
      subtitle: 'Doorstep pickup & express delivery',
      icon: Package,
      color: '#2563EB',
      path: '/parcel',
    },
    {
      id: 'travel',
      title: t('travel') || 'Intercity Travel',
      subtitle: 'Bus · Flight · Train tickets',
      icon: Compass,
      color: '#7C3AED',
      path: '/travel',
    },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/ride?destination=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/ride');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 24 }}>
      {/* ── HERO / GREETING & SEARCH ── */}
      <div className="flat-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 className="text-display" style={{ color: 'var(--text-primary)', fontSize: 24 }}>
            {t('welcomeGreeting') || 'Good day'}, {firstName}! 👋
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            Where would you like to go today from <strong style={{ color: 'var(--brand-green-text)' }}>{userLocation}</strong>?
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: 14, color: 'var(--text-muted)' }} />
            <input
              className="input-field"
              placeholder={t('whereToPlaceholder') || 'Where to? Enter destination…'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 42, height: 48, fontSize: 15 }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: '0 20px', height: 48 }}>
            Search
          </button>
        </form>
      </div>

      {/* ── CLEAN SERVICE CARDS (No Illustrations per Image 2) ── */}
      <div>
        <h2 className="text-section" style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
          {t('servicesTitle') || 'GetGo Services'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {SERVICES.map(srv => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="flat-card-interactive"
                onClick={() => navigate(srv.path)}
                style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: srv.color,
                  flexShrink: 0
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-subtitle" style={{ color: 'var(--text-primary)', fontSize: 16 }}>{srv.title}</div>
                  <div className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{srv.subtitle}</div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SAVED QUICK ADDRESSES ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>Saved Locations</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {SAVED_ADDRESSES.slice(0, 2).map(addr => (
            <div
              key={addr.id}
              className="flat-card-interactive"
              onClick={() => navigate(`/ride?destination=${encodeURIComponent(addr.address)}`)}
              style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            >
              <div style={{ fontSize: 20 }}>{addr.icon}</div>
              <div style={{ minWidth: 0 }}>
                <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{addr.label}</div>
                <div className="text-caption" style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {addr.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RECENT RECENT TRIPS ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>{t('recentTrips') || 'Recent Activity'}</h2>
          <button className="btn-text" onClick={() => navigate('/history')}>
            View All →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {recentTrips.map(trip => (
            <div
              key={trip.id}
              className="flat-card-interactive"
              onClick={() => navigate('/history')}
              style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {trip.type === 'parcel' ? <Package size={18} color="var(--brand-green-text)" /> : <Car size={18} color="var(--brand-green-text)" />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div className="text-body-medium" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {trip.dropoff}
                  </div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)' }}>
                    GetGo {trip.vehicle ? trip.vehicle.toUpperCase() : 'RIDE'} · {trip.distance} km
                  </div>
                </div>
              </div>
              <div style={{ fontWeight: 700, color: 'var(--brand-green-text)' }}>₹{trip.fare}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
