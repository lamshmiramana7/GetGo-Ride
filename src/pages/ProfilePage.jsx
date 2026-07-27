import React, { useState } from 'react';
import { useAuth, useTheme, useLanguage } from '../App';
import { MOCK_USER, SAVED_ADDRESSES, PAYMENT_METHODS } from '../data/mockData';

const LANGUAGES = ['English', 'தமிழ் (Tamil)', 'हिन्दी (Hindi)', 'తెలుగు (Telugu)', 'ಕನ್ನಡ (Kannada)', 'Malayalam'];

// ── Payment type configs (includes COD) ─────────────────────
const PAYMENT_TYPES = [
  {
    id: 'upi', icon: '📱', label: 'UPI',
    desc: 'Google Pay, PhonePe, Paytm UPI',
    fields: [{ id: 'upi_id', label: 'UPI ID', placeholder: 'yourname@upi', type: 'text' }],
  },
  {
    id: 'card', icon: '💳', label: 'Credit / Debit Card',
    desc: 'Visa, Mastercard, RuPay',
    fields: [
      { id: 'card_num',    label: 'Card Number',     placeholder: '•••• •••• •••• ••••', type: 'tel'      },
      { id: 'card_name',   label: 'Cardholder Name', placeholder: 'Name on card',        type: 'text'     },
      { id: 'card_expiry', label: 'Expiry (MM/YY)',  placeholder: 'MM/YY',               type: 'text'     },
      { id: 'card_cvv',    label: 'CVV',             placeholder: '•••',                 type: 'password' },
    ],
  },
  {
    id: 'wallet', icon: '👛', label: 'Digital Wallet',
    desc: 'Paytm, PhonePe, Amazon Pay',
    fields: [
      { id: 'wallet_type',  label: 'Wallet Provider', placeholder: 'e.g. Paytm, PhonePe', type: 'text' },
      { id: 'wallet_phone', label: 'Linked Mobile',   placeholder: '10-digit number',      type: 'tel'  },
    ],
  },
  {
    id: 'netbanking', icon: '🏦', label: 'Net Banking',
    desc: 'NEFT / RTGS from any bank',
    fields: [
      { id: 'bank_name', label: 'Bank Name',       placeholder: 'e.g. SBI, HDFC',  type: 'text' },
      { id: 'bank_acc',  label: 'Account Number',  placeholder: 'Account number',  type: 'tel'  },
    ],
  },
  {
    id: 'cod', icon: '💵', label: 'Cash on Delivery',
    desc: 'Pay the driver directly in cash',
    fields: [], // No extra fields needed
  },
];

// ── Settings modal content ───────────────────────────────────
const SETTINGS_CONTENT = {
  offers: {
    title: '🎁 Offers & Rewards',
    items: [
      { icon: '🏷️', title: 'GETGO50 — 50% OFF', desc: 'Valid on all rides till 31 July', badge: 'Active', color: '#00A651' },
      { icon: '📦', title: 'FIRSTPARCEL — Free Delivery', desc: 'First parcel delivery free for new users', badge: 'Active', color: '#2563EB' },
      { icon: '🚌', title: 'TRAVEL200 — Save ₹200', desc: 'On bus ticket bookings above ₹500', badge: 'Active', color: '#7C3AED' },
    ],
  },
  safety: {
    title: '🛡️ Safety Settings',
    items: [
      { icon: '🆘', title: 'SOS Emergency Button', desc: 'Enabled on all active trips' },
      { icon: '📞', title: 'Masked Calling', desc: 'Your number is never shared with drivers' },
      { icon: '👁️', title: 'Trip Sharing', desc: 'Share your live location with trusted contacts' },
      { icon: '🔔', title: 'Safety Alerts', desc: 'Get notified of unusual trip delays' },
    ],
  },
  help: {
    title: '❓ Help & Support',
    items: [
      { icon: '💬', title: 'Live Chat Support', desc: 'Available 9 AM – 9 PM, 7 days', action: true },
      { icon: '📞', title: 'Call Support', desc: '1800-GetGo (toll-free)', action: true },
      { icon: '📧', title: 'Email Support', desc: 'support@getgoride.in', action: true },
      { icon: '📖', title: 'FAQs', desc: 'Common questions answered', action: true },
    ],
  },
  rate: {
    title: '⭐ Rate the App',
  },
  terms: {
    title: '📜 Terms & Privacy',
    sections: [
      { heading: 'Terms of Service', body: 'By using GetGo Ride, you agree to our community guidelines and usage policies. GetGo acts as a platform connecting passengers with independent driver-partners.' },
      { heading: 'Privacy Policy', body: 'We collect only necessary data (phone number, location during trips) and never sell your personal information. All phone numbers are stored hashed and masked.' },
      { heading: 'Data Usage', body: 'Trip data is retained for 90 days for dispute resolution. You can request data deletion at any time via Help & Support.' },
    ],
  },
};

// ════════════════════════════════════════════════════════════════
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState(null);
  const [name, setName] = useState(user?.name || MOCK_USER.name);
  const [isEditingName, setIsEditingName] = useState(false);

  // Address state & modal
  const [addresses, setAddresses] = useState(SAVED_ADDRESSES);
  const [editingAddr, setEditingAddr] = useState(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);

  // Payment Methods state
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'offers'|'safety'|'help'|'rate'|'terms'
  const [starRating, setStarRating] = useState(0);
  const [ratingDone, setRatingDone] = useState(false);

  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleSaveAddress = (addrData) => {
    setAddresses(prev => {
      const idx = prev.findIndex(a => a.id === addrData.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = addrData;
        return next;
      }
      return [...prev, addrData];
    });
    setShowAddressSheet(false);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
  };

  const handleSetDefault = (id) =>
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, default: pm.id === id })));

  const handleRemovePayment = (id) =>
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));

  const handleAddPayment = (newPm) => {
    setPaymentMethods(prev => [...prev, newPm]);
    setShowAddPayment(false);
  };

  const toggleSection = (key) =>
    setActiveSection(s => (s === key ? null : key));

  return (
    <>
      {/* ── Main Page ── */}
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Top bar */}
        <div className="top-bar">
          <span className="top-bar-title">{t('myProfile')}</span>
          <button
            id="theme-toggle-btn"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100, scrollBehavior: 'smooth' }}>
          {/* ── Profile Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, var(--brand-green-dark), var(--brand-green))',
            padding: '24px 20px',
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', bottom: -30, right: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
            <div style={{ position: 'absolute', top: -20, right: 60, width: 70, height: 70, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ width: 72, height: 72, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.75rem', color: '#fff', border: '3px solid rgba(255,255,255,0.3)', flexShrink: 0, position: 'relative', zIndex: 1 }}>
              {initials}
            </div>
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              {isEditingName ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    id="edit-profile-name-input"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 8, padding: '4px 8px', color: '#fff', fontSize: '0.9375rem', fontWeight: 700, outline: 'none', width: '140px' }}
                    autoFocus
                  />
                  <button onClick={() => setIsEditingName(false)} style={{ background: '#fff', color: 'var(--brand-green)', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>✓ Save</button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '1.125rem', color: '#fff' }}>{name}</div>
                  <button onClick={() => setIsEditingName(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', width: 24, height: 24, fontSize: '0.6875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit Name">✏️</button>
                </div>
              )}
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>{user?.phone || MOCK_USER.phone}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <Chip label={`⭐ ${MOCK_USER.rating}`} />
                <Chip label={`🚗 ${MOCK_USER.totalRides} Rides`} />
                <Chip label={`👛 ₹${MOCK_USER.wallet}`} gold />
              </div>
            </div>
          </div>

          {/* ── Dark / Light Mode Row ── */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '1.25rem', width: 28, textAlign: 'center' }}>
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 1 }}>
                  Switch to {theme === 'dark' ? 'light' : 'dark'} mode
                </div>
              </div>
            </div>
            <label className="toggle">
              <input id="theme-toggle-switch" type="checkbox" checked={theme === 'light'} onChange={toggleTheme} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 8 }}>

            {/* ── Saved Addresses ── */}
            <SectionHeader
              label={`📍 ${t('savedAddresses')}`}
              expanded={activeSection === 'addresses'}
              onToggle={() => toggleSection('addresses')}
              right={<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{addresses.length} {t('saved')}</span>}
            />
            {activeSection === 'addresses' && (
              <div style={{ padding: '0 16px 12px', animation: 'slideDown 0.25s ease', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {addresses.map(addr => (
                  <div key={addr.id} id={`addr-${addr.id}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '12px 14px', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{addr.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{addr.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.5 }}>{addr.address}</div>
                    </div>
                    <button
                      id={`edit-addr-${addr.id}`}
                      onClick={() => { setEditingAddr(addr); setShowAddressSheet(true); }}
                      style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', fontSize: '0.75rem', color: 'var(--brand-green)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                ))}
                <button
                  id="add-address-btn"
                  onClick={() => { setEditingAddr(null); setShowAddressSheet(true); }}
                  style={{ padding: '10px 14px', background: 'rgba(0,166,81,0.08)', border: '1.5px dashed rgba(0,166,81,0.3)', borderRadius: 'var(--radius-lg)', color: 'var(--brand-green)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {t('addAddress')}
                </button>
              </div>
            )}

            <Divider />

            {/* ── Payment Methods ── */}
            <SectionHeader
              label={`💳 ${t('paymentMethods')}`}
              expanded={activeSection === 'payments'}
              onToggle={() => toggleSection('payments')}
              right={<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{paymentMethods.length} {t('saved')}</span>}
            />
            {activeSection === 'payments' && (
              <div style={{ padding: '0 16px 12px', animation: 'slideDown 0.25s ease', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paymentMethods.map(pm => (
                  <div
                    key={pm.id}
                    id={`pm-${pm.id}`}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '12px 14px',
                      border: `1.5px solid ${pm.default ? 'var(--brand-green)' : 'var(--border)'}`,
                      boxShadow: pm.default ? 'var(--shadow-green)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{pm.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {pm.label}
                        {pm.default && <span className="badge badge-green">Default</span>}
                        {pm.type === 'cod' && <span className="badge badge-gold">Cash</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{pm.detail}</div>
                    </div>
                    {!pm.default && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
                        <button
                          id={`set-default-${pm.id}`}
                          onClick={() => handleSetDefault(pm.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--brand-green)', fontSize: '0.6875rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', padding: '2px 0' }}
                        >
                          Set Default
                        </button>
                        <button
                          id={`remove-pm-${pm.id}`}
                          onClick={() => handleRemovePayment(pm.id)}
                          style={{ background: 'none', border: 'none', color: '#F87171', fontSize: '0.6875rem', fontWeight: 600, cursor: 'pointer', padding: '2px 0' }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  id="add-payment-btn"
                  onClick={() => setShowAddPayment(true)}
                  style={{
                    padding: '12px 14px',
                    background: 'rgba(0,166,81,0.08)',
                    border: '1.5px dashed rgba(0,166,81,0.3)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--brand-green)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'var(--transition)',
                    width: '100%',
                  }}
                >
                  {t('addPayment')}
                </button>
              </div>
            )}

            <Divider />

            {/* ── Language ── */}
            <SectionHeader
              label={`🌐 ${t('language')}`}
              expanded={activeSection === 'language'}
              onToggle={() => toggleSection('language')}
              right={<span style={{ fontSize: '0.8125rem', color: 'var(--brand-green)', fontWeight: 600 }}>{language}</span>}
            />
            {activeSection === 'language' && (
              <div style={{ padding: '0 16px 12px', animation: 'slideDown 0.25s ease', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {LANGUAGES.map(lang => (
                  <div
                    key={lang}
                    id={`lang-${lang}`}
                    onClick={() => setLanguage(lang)}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 14px',
                      background: language === lang ? 'rgba(0,166,81,0.08)' : 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${language === lang ? 'var(--brand-green)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                    }}
                  >
                    <span style={{ fontWeight: language === lang ? 600 : 400, color: language === lang ? 'var(--brand-green)' : 'var(--text-primary)' }}>{lang}</span>
                    {language === lang && <span style={{ color: 'var(--brand-green)', fontWeight: 700 }}>✓</span>}
                  </div>
                ))}
              </div>
            )}

            <Divider />

            {/* ── Settings Items (all functional) ── */}
            {[
              { id: 'offers',  icon: '🎁', label: t('offers'), badge: '3 active', modal: 'offers' },
              { id: 'safety',  icon: '🛡️', label: t('safetySettings'),  badge: null,       modal: 'safety' },
              { id: 'help',    icon: '❓', label: t('helpSupport'),    badge: null,       modal: 'help'   },
              { id: 'rate',    icon: '⭐', label: t('rateApp'),      badge: null,       modal: 'rate'   },
              { id: 'terms',   icon: '📜', label: t('termsPrivacy'),   badge: null,       modal: 'terms'  },
            ].map(item => (
              <div
                key={item.id}
                id={`profile-${item.id}`}
                onClick={() => setActiveModal(item.modal)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,166,81,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '1.25rem', width: 28, textAlign: 'center' }}>{item.icon}</span>
                <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9375rem' }}>{item.label}</span>
                {item.badge && <span className="badge badge-gold">{item.badge}</span>}
                <span style={{ color: 'var(--text-muted)' }}>›</span>
              </div>
            ))}

            <Divider />

            {/* Logout */}
            <div
              id="logout-btn"
              onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', cursor: 'pointer', color: '#F87171', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: '1.25rem', width: 28, textAlign: 'center' }}>🚪</span>
              <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t('logout')}</span>
            </div>

            <div style={{ padding: '8px 20px 60px', fontSize: '0.6875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              GetGo Ride v1.0.0 · Member since {MOCK_USER.memberSince}<br />Tamil Nadu Pilot · 🇮🇳
            </div>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Address Sheet ── */}
      {showAddressSheet && (
        <AddressSheet
          initialData={editingAddr}
          onSave={handleSaveAddress}
          onDelete={handleDeleteAddress}
          onClose={() => setShowAddressSheet(false)}
        />
      )}

      {/* ── Add Payment Bottom Sheet (rendered as portal-style overlay) ── */}
      {showAddPayment && (
        <AddPaymentSheet onAdd={handleAddPayment} onClose={() => setShowAddPayment(false)} />
      )}

      {/* ── Settings Modals ── */}
      {activeModal === 'offers'  && <OffersModal  onClose={() => setActiveModal(null)} />}
      {activeModal === 'safety'  && <SafetyModal  onClose={() => setActiveModal(null)} />}
      {activeModal === 'help'    && <HelpModal    onClose={() => setActiveModal(null)} />}
      {activeModal === 'terms'   && <TermsModal   onClose={() => setActiveModal(null)} />}
      {activeModal === 'rate'    && (
        <RateModal
          rating={starRating}
          done={ratingDone}
          onStar={setStarRating}
          onSubmit={() => setRatingDone(true)}
          onClose={() => { setActiveModal(null); }}
        />
      )}
    </>
  );
}

// ── Small helpers ────────────────────────────────────────────
function Chip({ label, gold }) {
  return (
    <div style={{ background: gold ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '4px 10px', fontSize: '0.6875rem', color: gold ? '#FFD700' : '#fff', fontWeight: gold ? 700 : 400 }}>
      {label}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '4px 16px' }} />;
}

function SectionHeader({ label, expanded, onToggle, right }) {
  return (
    <div
      onClick={onToggle}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', transition: 'var(--transition)' }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,166,81,0.04)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {right}
        <span style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', display: 'inline-block', transform: expanded ? 'rotate(90deg)' : 'none' }}>›</span>
      </div>
    </div>
  );
}

// ── BaseSheet — reusable bottom sheet wrapper ────────────────
function BaseSheet({ onClose, children, maxH = '85vh' }) {
  return (
    <div
      className="bottom-sheet-overlay"
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, maxWidth: 'var(--mobile-max)', margin: '0 auto' }}
    >
      <div
        className="bottom-sheet"
        onClick={e => e.stopPropagation()}
        style={{ maxHeight: maxH }}
      >
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// ADD / EDIT ADDRESS SHEET
// ════════════════════════════════════════════════════════════════
function AddressSheet({ initialData, onSave, onDelete, onClose }) {
  const [label, setLabel] = useState(initialData?.label || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [icon, setIcon] = useState(initialData?.icon || '🏠');
  const [error, setError] = useState('');

  const icons = ['🏠', '🏢', '📍', '🏋️', '🎓', '💖', '🛍️', '🏖️'];

  const handleSave = () => {
    if (!label.trim()) { setError('Label is required (e.g., Home, Office)'); return; }
    if (!address.trim()) { setError('Full address detail is required'); return; }
    onSave({
      id: initialData?.id || `addr_${Date.now()}`,
      label: label.trim(),
      address: address.trim(),
      icon,
    });
  };

  return (
    <BaseSheet onClose={onClose}>
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Poppins', fontSize: '1.0625rem', fontWeight: 700 }}>
            {initialData ? 'Edit Saved Address' : 'Add New Address'}
          </div>
          <button onClick={onClose} style={{ background: 'var(--bg-input)', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Icon Selector */}
        <div>
          <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Choose Icon Badge</label>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {icons.map(ic => (
              <button
                key={ic}
                onClick={() => setIcon(ic)}
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: icon === ic ? 'rgba(0,166,81,0.15)' : 'var(--bg-input)',
                  border: `1.5px solid ${icon === ic ? 'var(--brand-green)' : 'var(--border)'}`,
                  fontSize: '1.25rem', cursor: 'pointer', flexShrink: 0,
                  transition: 'var(--transition)',
                }}
              >
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Label input */}
        <div className="input-group">
          <label className="input-label" htmlFor="addr-label-input">Address Name / Label</label>
          <input
            id="addr-label-input"
            className="input-field"
            placeholder="e.g. Home, Office, Gym, Mom's House"
            value={label}
            onChange={e => { setLabel(e.target.value); setError(''); }}
          />
        </div>

        {/* Address input */}
        <div className="input-group">
          <label className="input-label" htmlFor="addr-text-input">Full Address Details</label>
          <textarea
            id="addr-text-input"
            className="input-field"
            placeholder="Door No, Street Name, Area, City, Pincode"
            value={address}
            onChange={e => { setAddress(e.target.value); setError(''); }}
            style={{ minHeight: 80, resize: 'none' }}
          />
        </div>

        {error && <div style={{ color: '#F87171', fontSize: '0.75rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          {initialData && (
            <button
              id="delete-address-btn"
              onClick={() => { onDelete(initialData.id); onClose(); }}
              style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: '#F87171', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
            >
              🗑️ Delete
            </button>
          )}
          <button
            id="save-address-btn"
            className="btn btn-primary"
            onClick={handleSave}
            style={{ flex: 1 }}
          >
            💾 {initialData ? 'Update Address' : 'Save Address'}
          </button>
        </div>
      </div>
    </BaseSheet>
  );
}

// ════════════════════════════════════════════════════════════════
// ADD PAYMENT METHOD SHEET
// ════════════════════════════════════════════════════════════════
function AddPaymentSheet({ onAdd, onClose }) {
  const [selectedType, setSelectedType] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const typeConfig = PAYMENT_TYPES.find(t => t.id === selectedType);

  const handleChange = (fieldId, val) => {
    setFormValues(p => ({ ...p, [fieldId]: val }));
    setErrors(p => ({ ...p, [fieldId]: '' }));
  };

  const validate = () => {
    if (!typeConfig) return false;
    const errs = {};
    typeConfig.fields.forEach(f => {
      if (!formValues[f.id]?.trim()) errs[f.id] = `${f.label} is required`;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    // COD has no fields — skip validation
    if (typeConfig.fields.length > 0 && !validate()) return;
    setSaving(true);
    setTimeout(() => {
      const firstFieldVal = typeConfig.fields.length > 0 ? formValues[typeConfig.fields[0].id] || '' : '';
      const detail = selectedType === 'card'
        ? `•••• •••• •••• ${firstFieldVal.replace(/\D/g, '').slice(-4) || '••••'}`
        : selectedType === 'cod'
        ? 'Pay driver in cash'
        : firstFieldVal;

      onAdd({
        id: `pm_${Date.now()}`,
        type: selectedType,
        label: typeConfig.label,
        detail,
        icon: typeConfig.icon,
        default: false,
      });
      setSaving(false);
      setSaved(true);
    }, 1000);
  };

  return (
    <BaseSheet onClose={onClose} maxH="92vh">
      {saved ? (
        <div style={{ padding: '32px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', animation: 'slideUp 0.3s ease' }}>
          <div style={{ width: 72, height: 72, background: 'rgba(0,166,81,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>✅</div>
          <div style={{ fontFamily: 'Poppins', fontSize: '1.25rem', fontWeight: 800 }}>Payment Method Added!</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{typeConfig?.label} saved successfully.</div>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>Done</button>
        </div>
      ) : (
        <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: 'Poppins', fontSize: '1.0625rem', fontWeight: 700 }}>
              {selectedType ? `Add ${typeConfig?.label}` : 'Add Payment Method'}
            </div>
            {selectedType
              ? <button onClick={() => { setSelectedType(null); setFormValues({}); setErrors({}); }} style={{ background: 'var(--bg-input)', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>← Back</button>
              : <button onClick={onClose} style={{ background: 'var(--bg-input)', border: 'none', borderRadius: 8, padding: '4px 12px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕ Close</button>
            }
          </div>

          {/* Step 1 — Pick type */}
          {!selectedType && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Choose a payment method type:</p>
              {PAYMENT_TYPES.map(pt => (
                <button
                  key={pt.id}
                  id={`add-pm-type-${pt.id}`}
                  onClick={() => {
                    setSelectedType(pt.id);
                    // COD needs no form — save immediately if clicked
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand-green)'; e.currentTarget.style.background = 'rgba(0,166,81,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{pt.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>{pt.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{pt.desc}</div>
                  </div>
                  <span style={{ color: 'var(--text-muted)' }}>›</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — Fill form (or COD confirmation) */}
          {selectedType && typeConfig && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'slideUp 0.25s ease' }}>
              {/* Type badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(0,166,81,0.08)', border: '1px solid rgba(0,166,81,0.2)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '1.5rem' }}>{typeConfig.icon}</span>
                <span style={{ fontWeight: 600, color: 'var(--brand-green)' }}>{typeConfig.label}</span>
              </div>

              {/* COD has no fields */}
              {typeConfig.fields.length === 0 && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 10 }}>💵</div>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Pay the driver in cash</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    No card or UPI needed. Pay the exact fare shown in the app directly to your driver after the trip.
                  </div>
                </div>
              )}

              {/* Form fields */}
              {typeConfig.fields.map(field => (
                <div key={field.id} className="input-group">
                  <label className="input-label" htmlFor={`pm-field-${field.id}`}>{field.label}</label>
                  <input
                    id={`pm-field-${field.id}`}
                    className="input-field"
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formValues[field.id] || ''}
                    onChange={e => handleChange(field.id, e.target.value)}
                    style={{ borderColor: errors[field.id] ? '#F87171' : undefined }}
                    autoComplete="off"
                  />
                  {errors[field.id] && <span style={{ fontSize: '0.75rem', color: '#F87171' }}>{errors[field.id]}</span>}
                </div>
              ))}

              {/* Security note (not for COD) */}
              {selectedType !== 'cod' && (
                <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <span>🔒</span>
                  <span>Your payment info is encrypted. GetGo never stores raw card numbers.</span>
                </div>
              )}

              <button
                id="save-payment-btn"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving
                  ? <span className="loading-dots"><span /><span /><span /></span>
                  : `💾 Save ${typeConfig.label}`}
              </button>
            </div>
          )}
        </div>
      )}
    </BaseSheet>
  );
}

// ════════════════════════════════════════════════════════════════
// SETTINGS MODALS
// ════════════════════════════════════════════════════════════════
function OffersModal({ onClose }) {
  const { items } = SETTINGS_CONTENT.offers;
  return (
    <BaseSheet onClose={onClose}>
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SheetTitle title={SETTINGS_CONTENT.offers.title} onClose={onClose} />
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Your active coupon codes and rewards:</p>
        {items.map((item, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', border: `1.5px solid ${item.color}40`, borderRadius: 'var(--radius-lg)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 42, height: 42, background: `${item.color}20`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.375rem', flexShrink: 0 }}>{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: item.color }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>{item.desc}</div>
            </div>
            <span className="badge badge-green">{item.badge}</span>
          </div>
        ))}
        <div style={{ background: 'var(--bg-card)', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '14px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>🏷️</span>
          <input className="input-field" placeholder="Enter promo code" style={{ flex: 1, border: 'none', background: 'transparent', padding: '0 8px' }} />
          <button className="btn btn-primary btn-sm" style={{ width: 'auto', flexShrink: 0 }}>Apply</button>
        </div>
      </div>
    </BaseSheet>
  );
}

function SafetyModal({ onClose }) {
  const [sos, setSos] = useState(true);
  const [masked, setMasked] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [alerts, setAlerts] = useState(true);
  const toggles = [
    { label: 'SOS Emergency Button', desc: 'Enabled on all active trips', val: sos, set: setSos },
    { label: 'Masked Calling', desc: 'Your number is never shared with drivers', val: masked, set: setMasked },
    { label: 'Trip Sharing', desc: 'Share live location with trusted contacts', val: sharing, set: setSharing },
    { label: 'Safety Alerts', desc: 'Notified of unusual trip delays', val: alerts, set: setAlerts },
  ];
  const icons = ['🆘', '📞', '👁️', '🔔'];
  return (
    <BaseSheet onClose={onClose}>
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SheetTitle title={SETTINGS_CONTENT.safety.title} onClose={onClose} />
        {toggles.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '1.375rem', width: 32, textAlign: 'center' }}>{icons[i]}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.label}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{t.desc}</div>
            </div>
            <label className="toggle"><input type="checkbox" checked={t.val} onChange={e => t.set(e.target.checked)} /><span className="toggle-slider" /></label>
          </div>
        ))}
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-lg)', padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: '1.375rem' }}>📞</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#F87171' }}>Emergency Contact</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Not set — add a trusted contact</div>
          </div>
          <button className="btn btn-sm" style={{ background: 'rgba(239,68,68,0.15)', color: '#F87171', border: 'none', borderRadius: 8, width: 'auto', padding: '6px 14px' }}>Add</button>
        </div>
      </div>
    </BaseSheet>
  );
}

function HelpModal({ onClose }) {
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    { q: 'How do I cancel a ride?', a: 'You can cancel a ride before the driver arrives from the tracking screen. A cancellation fee may apply if the driver is already on the way.' },
    { q: 'Why is my OTP not arriving?', a: 'Check your SMS inbox and ensure your number is correct. You can retry after 30 seconds or use the photo-proof fallback for delivery verification.' },
    { q: 'How is the fare calculated?', a: 'Fares are calculated based on distance × driver\'s per-km rate + a small base fare. All amounts shown are all-in — no hidden platform fees to passengers.' },
    { q: 'Is my phone number shared with drivers?', a: 'No. GetGo uses masked calls and in-app chat. Your real number is never exposed to drivers or any third party.' },
  ];
  const contacts = [
    { icon: '💬', label: 'Live Chat', detail: '9 AM – 9 PM daily', color: '#00A651' },
    { icon: '📞', label: '1800-GetGo', detail: 'Toll-free · 24/7', color: '#2563EB' },
    { icon: '📧', label: 'support@getgoride.in', detail: 'Response within 4 hours', color: '#7C3AED' },
  ];
  return (
    <BaseSheet onClose={onClose} maxH="90vh">
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SheetTitle title={SETTINGS_CONTENT.help.title} onClose={onClose} />
        {/* Contact options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {contacts.map(c => (
            <div key={c.label} style={{ background: 'var(--bg-card)', border: `1.5px solid ${c.color}30`, borderRadius: 'var(--radius-lg)', padding: '12px 8px', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = c.color}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${c.color}30`}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '0.6875rem', color: c.color }}>{c.label}</div>
              <div style={{ fontSize: '0.5625rem', color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{c.detail}</div>
            </div>
          ))}
        </div>
        {/* FAQs */}
        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>Frequently Asked Questions</div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div onClick={() => setActiveFaq(activeFaq === i ? null : i)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>
              <span style={{ flex: 1, paddingRight: 8 }}>{faq.q}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem', transform: activeFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>›</span>
            </div>
            {activeFaq === i && (
              <div style={{ padding: '0 14px 12px', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--border)' }}>
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </BaseSheet>
  );
}

function RateModal({ rating, done, onStar, onSubmit, onClose }) {
  const [review, setReview] = useState('');
  return (
    <BaseSheet onClose={onClose}>
      <div style={{ padding: '16px 24px 36px', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', textAlign: 'center' }}>
        <SheetTitle title={SETTINGS_CONTENT.rate.title} onClose={onClose} centered />
        {done ? (
          <>
            <div style={{ fontSize: '3.5rem', animation: 'bounce 0.6s ease' }}>🎉</div>
            <div style={{ fontFamily: 'Poppins', fontSize: '1.125rem', fontWeight: 800 }}>Thanks for your feedback!</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Your {'⭐'.repeat(rating)} rating helps us improve GetGo Ride.</div>
            <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>Done</button>
          </>
        ) : (
          <>
            <img src="/logo.png" alt="GetGo Ride" style={{ width: 80, height: 80, borderRadius: 16, objectFit: 'contain', marginBottom: 4 }} />
            <div style={{ fontFamily: 'Poppins', fontSize: '1.125rem', fontWeight: 700 }}>Enjoying GetGo Ride?</div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 260 }}>
              Your rating helps us keep improving for all riders across Tamil Nadu.
            </div>
            {/* Stars */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  id={`star-${s}`}
                  onClick={() => onStar(s)}
                  style={{ background: 'none', border: 'none', fontSize: '2.5rem', cursor: 'pointer', filter: s <= rating ? 'none' : 'grayscale(1) opacity(0.4)', transition: 'transform 0.15s, filter 0.15s', transform: s <= rating ? 'scale(1.15)' : 'scale(1)' }}
                >⭐</button>
              ))}
            </div>
            {rating > 0 && (
              <div style={{ fontSize: '0.8125rem', color: rating >= 4 ? 'var(--brand-green)' : 'var(--text-muted)', fontWeight: 600 }}>
                {['', 'Needs improvement', 'Could be better', 'It\'s okay', 'Pretty good!', 'Excellent! 🎉'][rating]}
              </div>
            )}
            {/* Optional review */}
            {rating > 0 && (
              <textarea
                placeholder="Tell us more (optional)…"
                value={review}
                onChange={e => setReview(e.target.value)}
                style={{ width: '100%', background: 'var(--bg-input)', border: '1.5px solid var(--border)', borderRadius: 12, padding: '12px 14px', color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'none', minHeight: 80, fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--brand-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            )}
            <button
              id="submit-rating-btn"
              className="btn btn-primary"
              disabled={rating === 0}
              onClick={onSubmit}
              style={{ width: '100%', opacity: rating === 0 ? 0.5 : 1 }}
            >
              {rating === 0 ? 'Tap a star to rate' : 'Submit Rating →'}
            </button>
          </>
        )}
      </div>
    </BaseSheet>
  );
}

function TermsModal({ onClose }) {
  const { sections } = SETTINGS_CONTENT.terms;
  return (
    <BaseSheet onClose={onClose} maxH="90vh">
      <div style={{ padding: '16px 20px 32px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <SheetTitle title={SETTINGS_CONTENT.terms.title} onClose={onClose} />
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Last updated: July 2026 · GetGo Ride, Tamil Nadu Pilot</p>
        {sections.map((sec, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '14px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', marginBottom: 8, color: 'var(--brand-green)' }}>{sec.heading}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{sec.body}</div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline-green btn-sm" style={{ flex: 1 }}>Privacy Policy PDF</button>
          <button className="btn btn-outline-green btn-sm" style={{ flex: 1 }}>Terms PDF</button>
        </div>
      </div>
    </BaseSheet>
  );
}

function SheetTitle({ title, onClose, centered }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: centered ? 'center' : 'space-between', gap: 10, marginBottom: 4 }}>
      <div style={{ fontFamily: 'Poppins', fontSize: '1.0625rem', fontWeight: 700, textAlign: centered ? 'center' : 'left' }}>{title}</div>
      {!centered && (
        <button onClick={onClose} style={{ background: 'var(--bg-input)', border: 'none', borderRadius: 8, padding: '4px 10px', fontSize: '0.8125rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
      )}
    </div>
  );
}
