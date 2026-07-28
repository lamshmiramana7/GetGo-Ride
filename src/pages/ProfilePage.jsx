import React, { useState } from 'react';
import { useAuth, useTheme, useLanguage } from '../App';
import { User, ShieldCheck, Sun, Moon, Globe, MapPin, CreditCard, LogOut, ChevronRight, Gift, HelpCircle, FileText, Check, Plus, Trash2, X, Settings } from 'lucide-react';
import { MOCK_USER, SAVED_ADDRESSES, PAYMENT_METHODS } from '../data/mockData';

const LANGUAGES = ['English', 'தமிழ் (Tamil)', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)', 'Malayalam'];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeModal, setActiveModal] = useState(null); // 'settings' | 'saved' | 'payment' | 'language'
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const userName = user?.name || MOCK_USER.name;
  const userPhone = user?.phone || MOCK_USER.phone;
  const userEmail = user?.email || MOCK_USER.email;

  const handleAddAddress = () => {
    if (newLabel && newAddress) {
      setAddresses(prev => [...prev, { id: `addr_${Date.now()}`, label: newLabel, icon: '📍', address: newAddress, lat: 13.0827, lng: 80.2707 }]);
      setNewLabel('');
      setNewAddress('');
    }
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 24 }}>
      {/* Header / User Card */}
      <div className="flat-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--brand-green)',
          color: '#FFFFFF',
          fontSize: 24,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          {userName[0]}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="text-subtitle" style={{ color: 'var(--text-primary)', fontSize: 20 }}>
            {userName}
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
            +91 {userPhone} · {userEmail}
          </p>
          <div className="badge-flat-green" style={{ marginTop: 8 }}>
            GetGo Gold Member (4.8 ★)
          </div>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="flat-card" style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>GetGo Wallet Balance</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-green-text)', marginTop: 2 }}>
            ₹{user?.wallet ? user.wallet.toFixed(2) : '500.00'}
          </div>
        </div>
        <button className="btn-primary" onClick={() => alert('Added ₹500 to GetGo Wallet!')}>
          + Add Money
        </button>
      </div>

      {/* Menu Sections */}
      <div className="flat-card" style={{ padding: '8px 0', display: 'flex', flexDirection: 'column' }}>
        {/* Profile Settings (Exclusive Dark Mode location per prompt) */}
        <div
          onClick={() => setActiveModal('settings')}
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Settings size={20} color="var(--brand-green-text)" />
            <div>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>App Settings & Theme</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Toggle Dark Mode & Preferences</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Saved Addresses */}
        <div
          onClick={() => setActiveModal('saved')}
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <MapPin size={20} color="var(--brand-green-text)" />
            <div>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Saved Addresses</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Home, Office, Frequent Stops</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Payment Methods */}
        <div
          onClick={() => setActiveModal('payment')}
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <CreditCard size={20} color="var(--brand-green-text)" />
            <div>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Payment Methods</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>UPI, Cards, Cash & Wallet</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Language Selection */}
        <div
          onClick={() => setActiveModal('language')}
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Globe size={20} color="var(--brand-green-text)" />
            <div>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>App Language</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Currently: {language}</div>
            </div>
          </div>
          <ChevronRight size={18} color="var(--text-muted)" />
        </div>

        {/* Sign Out */}
        <div
          onClick={logout}
          style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <LogOut size={20} color="#EF4444" />
            <div>
              <div className="text-body-medium" style={{ color: '#EF4444', fontWeight: 600 }}>Sign Out</div>
              <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Log out from this device</div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal (EXCLUSIVE location for Dark Mode Toggle per prompt) */}
      {activeModal === 'settings' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Profile Settings</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Dark Theme Mode</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Default theme is Light Mode</div>
              </div>
              <button
                className="btn-primary"
                onClick={toggleTheme}
                style={{ padding: '8px 14px', fontSize: 13, gap: 6 }}
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses Modal */}
      {activeModal === 'saved' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Saved Addresses</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {addresses.map(a => (
                <div key={a.id} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{a.icon} {a.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.address}</div>
                  </div>
                  <button onClick={() => handleDeleteAddress(a.id)} className="btn-secondary" style={{ width: 32, height: 32, padding: 0, color: '#EF4444' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input className="input-field" placeholder="Label (e.g. Gym, Parents)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
              <input className="input-field" placeholder="Full address" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
              <button className="btn-primary" onClick={handleAddAddress}>+ Add Saved Address</button>
            </div>
          </div>
        </div>
      )}

      {/* Language Modal */}
      {activeModal === 'language' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Select Language</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => { setLanguage(lang); setActiveModal(null); }}
                  className={language === lang ? 'badge-flat-green' : 'badge-flat'}
                  style={{ padding: 12, textAlign: 'left', fontSize: 14, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{lang}</span>
                  {language === lang && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
