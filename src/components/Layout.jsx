import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, Compass, User, Sun, Moon, LogOut } from 'lucide-react';
import { useAuth, useTheme, useLanguage } from '../App';
import GetGoLogo from './GetGoLogo';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const NAV_ITEMS = [
    { path: '/', label: t('home') || 'Home', icon: Home },
    { path: '/history', label: t('trips') || 'Trips', icon: Clock },
    { path: '/travel', label: t('travel') || 'Travel', icon: Compass },
    { path: '/profile', label: t('profile') || 'Profile', icon: User },
  ];

  return (
    <div className="app-layout">
      {/* ── DESKTOP LEFT SIDEBAR (>768px) ── */}
      <aside className="desktop-sidebar">
        <div style={{ marginBottom: 32, paddingLeft: 4 }}>
          <GetGoLogo size={36} showText={true} />
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

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
          <button
            className="nav-item"
            onClick={toggleTheme}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {user && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--brand-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name || 'User'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user.phone || ''}</div>
                </div>
              </div>
              <button onClick={logout} title="Sign Out" style={{ color: 'var(--text-muted)', padding: 4 }}>
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── MOBILE BOTTOM TAB BAR (<=768px) ── */}
      <nav className="mobile-nav-bar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

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
    </div>
  );
}
