import React, { useState } from 'react';
import { useAuth, useLanguage } from '../App';
import { ShieldCheck, User, Phone, Lock, Mail, Globe, ArrowRight, UserPlus, LogIn } from 'lucide-react';

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'தமிழ் (Tamil)', label: 'தமிழ் (Tamil)' },
  { id: 'हिन्दी (Hindi)', label: 'हिन्दी (Hindi)' },
  { id: 'తెలుగు (Telugu)', label: 'తెలుగు (Telugu)' },
  { id: 'Malayalam', label: 'Malayalam' },
];

export default function LoginPage() {
  const { login, registerAccount } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(loginPhone, loginPassword);
    }, 600);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (regPhone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      registerAccount({
        name: regName,
        phone: regPhone,
        email: regEmail,
        password: regPassword,
        language: language,
      });
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      backgroundColor: 'var(--bg-page)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-flat)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Language selector on top right */}
        <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-green-text)', letterSpacing: '0.02em' }}>
            GetGo
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe size={15} color="var(--text-secondary)" />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              {LANGUAGES.map(l => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 2-Tab Navigation: Login vs Create Account */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '14px 16px',
              fontSize: 15,
              fontWeight: 700,
              backgroundColor: activeTab === 'login' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'login' ? 'var(--brand-green-text)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'login' ? '3px solid var(--brand-green)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '14px 16px',
              fontSize: 15,
              fontWeight: 700,
              backgroundColor: activeTab === 'register' ? 'var(--bg-surface)' : 'transparent',
              color: activeTab === 'register' ? 'var(--brand-green-text)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'register' ? '3px solid var(--brand-green)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer'
            }}
          >
            <UserPlus size={18} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && (
            <div style={{ padding: 12, borderRadius: 'var(--radius-sm)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444', fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Mobile Number
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ height: 48, padding: '0 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="98765 43210"
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ height: 48, fontSize: 16, fontWeight: 700, marginTop: 8 }}
              >
                {loading ? 'Authenticating…' : 'Login to GetGo'}
              </button>

              <p className="text-caption" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                Quick login: Enter any 10-digit number to proceed
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Arjun Krishnamurthy"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Mobile Number
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ height: 44, padding: '0 12px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="98765 43210"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="arjun@gmail.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Create Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="At least 4 characters"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ height: 48, fontSize: 16, fontWeight: 700, marginTop: 8 }}
              >
                {loading ? 'Creating Account…' : 'Create Account & Login'}
              </button>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="var(--brand-green-text)" />
            <span>100% Encrypted & Safe Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
