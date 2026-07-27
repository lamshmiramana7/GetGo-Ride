import React, { useState } from 'react';
import { useAuth, useTheme, useLanguage } from '../App';
import { User, ShieldCheck, Sun, Moon, Globe, MapPin, CreditCard, LogOut, ChevronRight, Gift, HelpCircle, FileText, Check, Plus, Trash2, X } from 'lucide-react';
import { MOCK_USER, SAVED_ADDRESSES, PAYMENT_METHODS } from '../data/mockData';

const LANGUAGES = ['English', 'தமிழ் (Tamil)', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)', 'Malayalam'];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeModal, setActiveModal] = useState(null); // 'saved' | 'payment' | 'language' | 'safety' | 'help'
  const [selectedPaymentId, setSelectedPaymentId] = useState('pm001');
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const userName = user?.name || MOCK_USER.name;
  const userPhone = user?.phone || MOCK_USER.phone;

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
          <h1 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>
            {userName}
          </h1>
          <p className="text-body" style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
            {userPhone}
          </p>
          <div className="badge-flat-green" style={{ marginTop: 8 }}>
            <ShieldCheck size={14} /> {t('myProfile') || 'Verified Profile'}
          </div>
        </div>
      </div>

      {/* User Stats Pills */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <div className="flat-card" style={{ padding: 12, textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{t('trips') || 'Total Rides'}</div>
          <div className="text-subtitle" style={{ color: 'var(--text-primary)', marginTop: 2 }}>47</div>
        </div>
        <div className="flat-card" style={{ padding: 12, textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Rating</div>
          <div className="text-subtitle" style={{ color: 'var(--text-primary)', marginTop: 2 }}>4.8 ★</div>
        </div>
        <div className="flat-card" style={{ padding: 12, textAlign: 'center' }}>
          <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Wallet</div>
          <div className="text-subtitle" style={{ color: 'var(--brand-green-text)', marginTop: 2 }}>₹450</div>
        </div>
      </div>

      {/* Settings Options List */}
      <div className="flat-card" style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { id: 'theme', label: `${theme === 'dark' ? (t('lightMode') || 'Light Mode') : (t('darkMode') || 'Dark Mode')}`, icon: theme === 'dark' ? Sun : Moon, action: toggleTheme },
          { id: 'language', label: `${t('language') || 'Language'} (${language})`, icon: Globe, action: () => setActiveModal('language') },
          { id: 'saved', label: t('savedAddresses') || 'Saved Addresses', icon: MapPin, action: () => setActiveModal('saved') },
          { id: 'payment', label: t('paymentMethods') || 'Payment Methods', icon: CreditCard, action: () => setActiveModal('payment') },
          { id: 'safety', label: t('safetySettings') || 'Safety & Security', icon: ShieldCheck, action: () => setActiveModal('safety') },
          { id: 'help', label: t('helpSupport') || 'Help & Support', icon: HelpCircle, action: () => setActiveModal('help') },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ color: 'var(--brand-green-text)' }}>
                  <Icon size={20} />
                </div>
                <span className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <button
        className="btn-secondary"
        onClick={logout}
        style={{ color: '#EF4444', borderColor: 'var(--border-strong)' }}
      >
        <LogOut size={18} />
        <span>{t('logout') || 'Sign Out Account'}</span>
      </button>

      {/* ── MODALS ── */}
      {activeModal === 'saved' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Saved Addresses</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {addresses.map(a => (
                <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{a.label}</div>
                    <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{a.address}</div>
                  </div>
                  <button onClick={() => handleDeleteAddress(a.id)} style={{ color: '#EF4444', padding: 4 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>Add New Location</div>
              <input className="input-field" placeholder="Label (e.g. Gym, Friend's Place)" value={newLabel} onChange={e => setNewLabel(e.target.value)} />
              <input className="input-field" placeholder="Full Address" value={newAddress} onChange={e => setNewAddress(e.target.value)} />
              <button className="btn-primary" onClick={handleAddAddress} disabled={!newLabel || !newAddress}>
                <Plus size={16} /> Add Address
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'language' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Select Language</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {LANGUAGES.map(lang => (
                <div
                  key={lang}
                  onClick={() => { setLanguage(lang); setActiveModal(null); }}
                  style={{
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: language === lang ? 'var(--brand-green-tint)' : 'var(--bg-secondary)',
                    color: language === lang ? 'var(--brand-green-text)' : 'var(--text-primary)',
                    fontWeight: language === lang ? 600 : 400,
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{lang}</span>
                  {language === lang && <Check size={18} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'payment' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>{t('paymentMethods') || 'Payment Options'}</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PAYMENT_METHODS.map(pm => {
                const isSel = selectedPaymentId === pm.id;
                return (
                  <div
                    key={pm.id}
                    onClick={() => setSelectedPaymentId(pm.id)}
                    className={isSel ? 'flat-card-selected' : 'flat-card-interactive'}
                    style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                  >
                    <CreditCard size={20} color={isSel ? 'var(--brand-green-text)' : 'var(--text-secondary)'} />
                    <div style={{ flex: 1 }}>
                      <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>{pm.label}</div>
                      <div className="text-caption" style={{ color: 'var(--text-muted)' }}>{pm.detail}</div>
                    </div>
                    {isSel ? (
                      <span className="badge-flat-green" style={{ fontSize: 11 }}>
                        <Check size={12} /> Default
                      </span>
                    ) : (
                      <button className="btn-text" style={{ fontSize: 12, padding: 0 }}>Set Default</button>
                    )}
                  </div>
                );
              })}
            </div>

            <button className="btn-primary" onClick={() => setActiveModal(null)}>
              Save Payment Preference
            </button>
          </div>
        </div>
      )}

      {activeModal === 'safety' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Safety Features</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12 }}>
                <ShieldCheck size={20} color="var(--brand-green-text)" />
                <div>
                  <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>Masked Calling Protection</div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Your phone number is anonymized when contacting drivers.</div>
                </div>
              </div>
              <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', gap: 12 }}>
                <ShieldCheck size={20} color="var(--brand-green-text)" />
                <div>
                  <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>24/7 Safety Helpline</div>
                  <div className="text-caption" style={{ color: 'var(--text-muted)' }}>Dedicated support team monitoring active trips.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'help' && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div className="flat-card" style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="text-subtitle" style={{ color: 'var(--text-primary)' }}>Help & Support</h2>
              <button onClick={() => setActiveModal(null)} className="btn-secondary" style={{ width: 36, height: 36, padding: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>Customer Support Helpline</div>
                <div className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 2 }}>Toll Free: 1800-425-9898 (24/7)</div>
              </div>
              <div style={{ padding: 14, backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                <div className="text-body-medium" style={{ color: 'var(--text-primary)' }}>Email Support</div>
                <div className="text-caption" style={{ color: 'var(--text-muted)', marginTop: 2 }}>support@getgoride.in</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
