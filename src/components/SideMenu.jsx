import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { SAVED_ADDRESSES, MOCK_USER } from '../data/mockData';

const MENU_ITEMS = [
  { icon: '👤', label: 'My Profile', path: '/profile' },
  { icon: '📍', label: 'Saved Addresses', path: '/profile' },
  { icon: '💳', label: 'Payment Methods', path: '/profile' },
  { icon: '🕐', label: 'Trip History', path: '/history' },
  { icon: '🎁', label: 'Offers & Rewards', path: null, badge: 'NEW' },
  { icon: '🌐', label: 'Language', path: null, detail: 'English' },
  { icon: '⭐', label: 'Rate the App', path: null },
  { icon: '🛡️', label: 'Safety', path: null },
  { icon: '❓', label: 'Help & Support', path: null },
  { icon: '📜', label: 'Terms & Privacy', path: null },
];

export default function SideMenu({ onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleItem = (item) => {
    if (item.path) { navigate(item.path); onClose(); }
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AK';

  return (
    <div className="side-menu-overlay" onClick={onClose}>
      <div className="side-menu" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="side-menu-header">
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: '50%', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close menu"
          >✕</button>
          <div className="side-menu-avatar">{initials}</div>
          <div className="side-menu-name">{user?.name || MOCK_USER.name}</div>
          <div className="side-menu-phone">{user?.phone || MOCK_USER.phone}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', color: '#fff' }}>
              ⭐ {MOCK_USER.rating} Rating
            </div>
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', color: '#fff' }}>
              🚗 {MOCK_USER.totalRides} Rides
            </div>
            <div style={{ background: 'rgba(255,215,0,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: '0.75rem', color: '#FFD700', fontWeight: 700 }}>
              👛 ₹{MOCK_USER.wallet}
            </div>
          </div>
        </div>

        {/* Menu Body */}
        <div className="side-menu-body">
          {MENU_ITEMS.map((item) => (
            <div key={item.label} className="menu-item" onClick={() => handleItem(item)}>
              <span className="menu-item-icon">{item.icon}</span>
              <span className="menu-item-label flex-1">{item.label}</span>
              {item.badge && <span className="badge badge-green">{item.badge}</span>}
              {item.detail && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.detail}</span>}
              {item.path && <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>›</span>}
            </div>
          ))}

          <div className="divider" style={{ margin: '8px 20px' }} />

          <div className="menu-item danger" onClick={handleLogout}>
            <span className="menu-item-icon">🚪</span>
            <span className="menu-item-label">Logout</span>
          </div>

          <div style={{ padding: '16px 20px', color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
            GetGo Ride v1.0.0 · Tamil Nadu Pilot
          </div>
        </div>
      </div>
    </div>
  );
}
