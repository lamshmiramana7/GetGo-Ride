import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation as useRouteLocation } from 'react-router-dom';
import { Home, Clock, Compass, User, MapPin, LogOut, ChevronDown, Check, X, Navigation } from 'lucide-react';
import { useAuth, useLanguage, useLocation } from '../App';
import { INDIAN_GEOGRAPHY } from '../data/mockData';

export default function Layout() {
  const navigate = useNavigate();
  const routeLocation = useRouteLocation();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { userLocation, setUserLocation, requestLocationPermission } = useLocation();

  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedState, setSelectedState] = useState('Tamil Nadu');

  const NAV_ITEMS = [
    { path: '/', label: t('home') || 'Home', icon: Home },
    { path: '/history', label: t('trips') || 'Trips', icon: Clock },
    { path: '/travel', label: t('travel') || 'Travel', icon: Compass },
    { path: '/profile', label: t('profile') || 'Profile', icon: User },
  ];

  const currentGeography = INDIAN_GEOGRAPHY.find(g => g.state === selectedState) || INDIAN_GEOGRAPHY[0];

  return (
    <div className="app-layout">
      {/* ── DESKTOP LEFT SIDEBAR (>768px) ── */}
      <aside className="desktop-sidebar">
        <div style={{ marginBottom: 24, paddingLeft: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', backgroundColor: 'var(--brand-green)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
            G
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
            GetGo
          </span>
        </div>

        {/* Location selector pill inside desktop sidebar */}
        <button
          onClick={() => setShowLocationModal(true)}
          style={{
            padding: '10px 12px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          <MapPin size={16} color="var(--brand-green-text)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Current Location</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userLocation}
            </div>
          </div>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? routeLocation.pathname === '/'
              : routeLocation.pathname.startsWith(item.path);

            return (
              <button
                key={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer controls inside sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name || 'Rider'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.phone || ''}</div>
                </div>
              </div>
              <button onClick={logout} title="Sign Out" style={{ color: 'var(--text-muted)', padding: 4, cursor: 'pointer' }}>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MOBILE TOP HEADER ── */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--brand-green)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15 }}>
            G
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>GetGo</span>
        </div>

        {/* Location selector pill on mobile header */}
        <button
          onClick={() => setShowLocationModal(true)}
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            maxWidth: 180,
            cursor: 'pointer'
          }}
        >
          <MapPin size={14} color="var(--brand-green-text)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {userLocation}
          </span>
          <ChevronDown size={12} color="var(--text-muted)" />
        </button>
      </header>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── MOBILE BOTTOM NAVIGATION BAR (<=768px) ── */}
      <nav className="mobile-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/'
            ? routeLocation.pathname === '/'
            : routeLocation.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ── MANUAL LOCATION SELECTOR MODAL ── */}
      {showLocationModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 16, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={18} color="var(--brand-green-text)" />
                <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Select Location</h2>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            {/* Auto Detect Button */}
            <button
              className="btn-primary"
              onClick={() => { requestLocationPermission(); setShowLocationModal(false); }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, height: 42, fontSize: 13 }}
            >
              <Navigation size={16} />
              <span>Auto Detect My Current Location (GPS)</span>
            </button>

            {/* Indian State Picker */}
            <div>
              <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Select Indian State / Territory
              </label>
              <select
                className="input-field"
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
              >
                {INDIAN_GEOGRAPHY.map(g => (
                  <option key={g.state} value={g.state}>{g.state}</option>
                ))}
              </select>
            </div>

            {/* Cities in selected state */}
            <div>
              <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Cities & Districts in {selectedState}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentGeography.cities.map(c => {
                  const fullLoc = `${c}, ${selectedState}`;
                  const isSel = userLocation.includes(c);
                  return (
                    <button
                      key={c}
                      onClick={() => { setUserLocation(fullLoc); localStorage.setItem('gg-user-loc', fullLoc); setShowLocationModal(false); }}
                      className={isSel ? 'badge-flat-green' : 'badge-flat'}
                      style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
