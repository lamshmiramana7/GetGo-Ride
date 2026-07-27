import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useLanguage } from '../App';
import SideMenu from './SideMenu';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { path: '/',        icon: '🏠', labelKey: 'home' },
    { path: '/history', icon: '🕐', labelKey: 'trips' },
    { path: '/travel',  icon: '🚌', labelKey: 'travel' },
    { path: '/profile', icon: '👤', labelKey: 'profile' },
  ];

  return (
    <div className="screen">
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
      <div className="screen-content">
        <Outlet context={{ openMenu: () => setMenuOpen(true) }} />
      </div>
      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          const label = t(item.labelKey);
          return (
            <button
              key={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={label}
            >
              <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
              <span>{label}</span>
              <div className="nav-dot" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
