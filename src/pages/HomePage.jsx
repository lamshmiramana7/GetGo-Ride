import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useAuth, useTheme, useLanguage } from '../App';
import { MOCK_USER, MOCK_TRIPS, PROMO_BANNERS, SAVED_ADDRESSES, NOTIFICATIONS } from '../data/mockData';
import NotificationPanel from '../components/NotificationPanel';
import GetGoLogo from '../components/GetGoLogo';

export default function HomePage() {
  const navigate = useNavigate();
  const { openMenu } = useOutletContext();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [promoBanner, setPromoBanner] = useState(0);
  const [greetingKey, setGreetingKey] = useState('goodMorning');
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATIONS.filter(n => !n.read).length);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreetingKey('goodMorning');
    else if (hour < 17) setGreetingKey('goodAfternoon');
    else setGreetingKey('goodEvening');
    const interval = setInterval(() => {
      setPromoBanner(b => (b + 1) % PROMO_BANNERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const firstName = (user?.name || MOCK_USER.name).split(' ')[0];
  const recentTrips = MOCK_TRIPS.slice(0, 3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

      {/* ── Header ── */}
      <div className="home-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
          <button id="menu-btn" onClick={openMenu} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 38, height: 38, borderRadius: 10, fontSize: '1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ☰
          </button>
          <img src="logo.png" alt="GetGo Ride" style={{ height: 38, objectFit: 'contain', borderRadius: 8 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              id="theme-toggle-home-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 38, height: 38, borderRadius: 10, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              id="notification-btn"
              onClick={() => setShowNotifs(true)}
              style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 38, height: 38, borderRadius: 10, fontSize: '1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}
            >
              🔔
              {unreadCount > 0 && (
                <div style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, background: '#EF4444', borderRadius: '50%', border: '1.5px solid transparent' }} />
              )}
            </button>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 2, marginTop: 16 }}>
          <p className="home-greeting">{t(greetingKey)},</p>
          <p className="home-name">{firstName} 👋</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.75)' }}>📍</span>
            <span style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Chennai, Tamil Nadu</span>
          </div>
        </div>
      </div>

      {/* ── Service Cards ── */}
      <div className="service-cards animate-slideUp">
        <div id="book-ride-card" className="service-card" onClick={() => navigate('/ride')}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(0,166,81,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, border: '1px solid rgba(0,166,81,0.25)', overflow: 'hidden' }}>
            <img src="assets/bike.png" alt="Ride" style={{ width: 42, height: 42, objectFit: 'contain' }} />
          </div>
          <div className="service-card-label">{t('bookRide')}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Bike · Auto · Car · Van</div>
        </div>
        <div id="send-parcel-card" className="service-card" onClick={() => navigate('/parcel')}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(37,99,235,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, border: '1px solid rgba(37,99,235,0.25)', overflow: 'hidden' }}>
            <img src="assets/parcel.png" alt="Parcel" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 12 }} />
          </div>
          <div className="service-card-label">{t('sendParcel')}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Bike delivery</div>
        </div>
        <div id="travel-card" className="service-card" onClick={() => navigate('/travel')}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(124,58,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, border: '1px solid rgba(124,58,237,0.25)', overflow: 'hidden' }}>
            <img src="assets/bus.png" alt="Travel" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 12 }} />
          </div>
          <div className="service-card-label">{t('travel')}</div>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>Bus · Flights · Train</div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Promo Banner */}
        <div
          id="promo-banner"
          className="promo-banner animate-fadeIn"
          style={{ background: PROMO_BANNERS[promoBanner].color, cursor: 'pointer' }}
          key={promoBanner}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>
              🎉 Special Offer
            </div>
            <div style={{ fontSize: '1.0625rem', fontWeight: 800, color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
              {PROMO_BANNERS[promoBanner].title}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
              {PROMO_BANNERS[promoBanner].subtitle}
            </div>
          </div>
          {/* Banner dots */}
          <div style={{ position: 'absolute', bottom: 12, right: 16, display: 'flex', gap: 5, zIndex: 1 }}>
            {PROMO_BANNERS.map((_, i) => (
              <div key={i} style={{ width: i === promoBanner ? 16 : 5, height: 5, borderRadius: 3, background: i === promoBanner ? '#fff' : 'rgba(255,255,255,0.4)', transition: '0.3s' }} />
            ))}
          </div>
        </div>

        {/* Saved Addresses quick-launch */}
        <div>
          <div className="section-title">📍 {t('quickDestinations')}</div>
          <div className="scroll-row" style={{ position: 'relative' }}>
            {SAVED_ADDRESSES.map(addr => (
              <div
                key={addr.id}
                id={`quick-${addr.id}`}
                onClick={() => navigate('/ride')}
                style={{
                  flexShrink: 0,
                  background: 'var(--bg-card)',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  minWidth: 130,
                  transition: 'var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,166,81,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontSize: '1.25rem', marginBottom: 4 }}>{addr.icon}</div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{addr.label}</div>
                <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 110 }}>
                  {addr.address.split(',')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Trips */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="section-title" style={{ marginBottom: 0 }}>🕐 {t('recentTrips')}</div>
            <button
              onClick={() => navigate('/history')}
              style={{ fontSize: '0.8125rem', color: 'var(--brand-green)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {t('viewAll')}
            </button>
          </div>
          <div className="scroll-list">
            {recentTrips.map(trip => (
              <TripMini key={trip.id} trip={trip} onClick={() => navigate('/history')} />
            ))}
          </div>
        </div>

        {/* Safety Banner */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: '2rem' }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t('safetyBanner')}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{t('safetySub')}</div>
          </div>
          <span style={{ color: 'var(--brand-green)', fontSize: '1.125rem' }}>›</span>
        </div>

      </div>
      {/* Notification Panel */}
      {showNotifs && (
        <NotificationPanel
          onClose={() => setShowNotifs(false)}
          onUnreadChange={setUnreadCount}
        />
      )}
    </div>
  );
}

function TripMini({ trip, onClick }) {
  const icons = { bike: '🏍️', auto: '🛺', car: '🚗', van: '🚐', bus: '🚌' };
  const date = new Date(trip.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  return (
    <div className="trip-card" onClick={onClick} id={`trip-mini-${trip.id}`}>
      <div style={{ width: 42, height: 42, background: 'var(--bg-input)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0 }}>
        {icons[trip.vehicle]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>
            {trip.dropoff}
          </div>
          <div style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--brand-green)', fontSize: '0.9375rem', flexShrink: 0 }}>₹{trip.fare}</div>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>{date}</span>
          <span>·</span>
          <span>{trip.distance} km</span>
          <span>·</span>
          <span>{trip.paymentMethod}</span>
        </div>
      </div>
    </div>
  );
}
