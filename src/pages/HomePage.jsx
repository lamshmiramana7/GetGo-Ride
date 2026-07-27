import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Package, Compass, MapPin, Search, Sun, Moon, ChevronRight, Home as HomeIcon, Briefcase, ShieldCheck } from 'lucide-react';
import { useAuth, useTheme, useLanguage } from '../App';
import { MOCK_USER, MOCK_TRIPS, SAVED_ADDRESSES } from '../data/mockData';
import GetGoLogo from '../components/GetGoLogo';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const firstName = (user?.name || MOCK_USER.name).split(' ')[0];
  const recentTrips = MOCK_TRIPS.slice(0, 3);

  const SERVICES = [
    {
      id: 'ride',
      title: t('bookRide') || 'Book a Ride',
      subtitle: 'Bike · Auto · Car · Van',
      icon: Car,
      path: '/ride',
    },
    {
      id: 'parcel',
      title: t('sendParcel') || 'Send Parcel',
      subtitle: 'Doorstep pickup & express delivery',
      icon: Package,
      path: '/parcel',
    },
    {
      id: 'travel',
      title: t('travel') || 'Intercity Travel',
      subtitle: 'Bus · Flight · Train tickets',
      icon: Compass,
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
      {/* ── TOP BAR (Mobile Header) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <GetGoLogo size={32} showText={true} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ width: 40, height: 40, padding: 0, borderRadius: 'var(--radius-md)' }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* ── HERO / GREETING & SEARCH ── */}
      <div className="flat-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>
            {t('goodMorning') || 'Welcome back'}, {firstName} 👋
          </h1>
          <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
            {t('dropoffPlaceholder') || 'Where would you like to go today?'}
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <MapPin size={18} color="var(--brand-green-text)" style={{ position: 'absolute', left: 14, top: 15 }} />
            <input
              type="text"
              className="input-field"
              placeholder={t('dropoffPlaceholder') || 'Search pickup or destination...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 42 }}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0 20px' }}>
            <Search size={18} />
          </button>
        </form>

        {/* Quick Saved Addresses */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingTop: 4 }}>
          {SAVED_ADDRESSES.map(addr => (
            <button
              key={addr.id}
              onClick={() => navigate(`/ride?destination=${encodeURIComponent(addr.address)}`)}
              className="badge-flat"
              style={{ flexShrink: 0, padding: '8px 12px', cursor: 'pointer' }}
            >
              {addr.label === 'Home' ? <HomeIcon size={14} /> : addr.label === 'Work' ? <Briefcase size={14} /> : <MapPin size={14} />}
              <span>{addr.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── SERVICES GRID ── */}
      <div>
        <h2 className="text-section" style={{ marginBottom: 12, color: 'var(--text-primary)' }}>
          {t('bookRide') || 'Services'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {SERVICES.map(svc => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.id}
                id={`service-${svc.id}`}
                className="flat-card-interactive"
                onClick={() => navigate(svc.path)}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20 }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-green-tint)',
                  color: 'var(--brand-green-text)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>
                    {svc.title}
                  </div>
                  <div className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                    {svc.subtitle}
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── LOWER RESPONSIVE GRID ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Recent Activity */}
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="text-section" style={{ color: 'var(--text-primary)' }}>
              {t('recentTrips') || 'Recent Trips'}
            </h3>
            <button className="btn-text" onClick={() => navigate('/history')} style={{ fontSize: 13, padding: 0 }}>
              {t('viewAll') || 'View All →'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentTrips.map(trip => {
              const Icon = trip.type === 'parcel' ? Package : trip.type === 'travel' ? Compass : Car;
              const date = new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

              return (
                <div
                  key={trip.id}
                  onClick={() => navigate('/history')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-green-text)',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="text-body-medium" style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {trip.dropoff}
                    </div>
                    <div className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 2 }}>
                      {date} · {trip.distance} km · {trip.paymentMethod}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--brand-green-text)', fontSize: 15 }}>
                    ₹{trip.fare}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Banner */}
        <div className="flat-card" style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--brand-green-tint)',
              color: 'var(--brand-green-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>
                {t('safetyBanner') || 'GetGo Safety Standard'}
              </div>
              <div className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                {t('safetySub') || '100% verified drivers, live trip tracking, & 24/7 emergency support.'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
