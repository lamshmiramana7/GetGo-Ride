import React, { useState } from 'react';
import { useAuth, useLanguage } from '../App';
import { ShieldCheck, Globe, UserPlus, LogIn } from 'lucide-react';

const LANGUAGES = [
  { id: 'English', label: 'English' },
  { id: 'தமிழ் (Tamil)', label: 'தமிழ் (Tamil)' },
  { id: 'हिन्दी (Hindi)', label: 'हिन्दी (Hindi)' },
  { id: 'తెలుగు (Telugu)', label: 'తెలుగు (Telugu)' },
  { id: 'Malayalam', label: 'Malayalam' },
];

export default function LoginPage() {
  const { login, registerAccount } = useAuth();
  const { language, setLanguage } = useLanguage();
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
      backgroundColor: '#F8FAFC',
      color: '#0F172A'
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top Header Bar */}
        <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#1B5E20', letterSpacing: '0.02em' }}>
            GetGo
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Globe size={15} color="#64748B" />
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
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
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '14px 16px',
              fontSize: 15,
              fontWeight: 700,
              backgroundColor: activeTab === 'login' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'login' ? '#1B5E20' : '#64748B',
              borderBottom: activeTab === 'login' ? '3px solid #1B5E20' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              borderLeft: 'none', borderRight: 'none', borderTop: 'none'
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
              backgroundColor: activeTab === 'register' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'register' ? '#1B5E20' : '#64748B',
              borderBottom: activeTab === 'register' ? '3px solid #1B5E20' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
              borderLeft: 'none', borderRight: 'none', borderTop: 'none'
            }}
          >
            <UserPlus size={18} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: '#FFFFFF' }}>
          {error && (
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>
                  MOBILE NUMBER
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ height: 48, padding: '0 12px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, color: '#0F172A' }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    style={{ height: 48, flex: 1, padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 15, fontWeight: 600, outline: 'none' }}
                    placeholder="98765 43210"
                    value={loginPhone}
                    onChange={e => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>
                  PASSWORD
                </label>
                <input
                  type="password"
                  style={{ height: 48, width: '100%', padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 15, outline: 'none' }}
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ height: 48, fontSize: 16, fontWeight: 700, marginTop: 8, backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              >
                {loading ? 'Authenticating…' : 'Login to GetGo'}
              </button>

              <p style={{ color: '#64748B', textAlign: 'center', fontSize: 12 }}>
                Quick login: Enter any 10-digit number to proceed
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 4 }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  style={{ height: 44, width: '100%', padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 14, outline: 'none' }}
                  placeholder="e.g. Arjun Krishnamurthy"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 4 }}>
                  MOBILE NUMBER
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ height: 44, padding: '0 12px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, color: '#0F172A' }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    style={{ height: 44, flex: 1, padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 14, fontWeight: 600, outline: 'none' }}
                    placeholder="98765 43210"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 4 }}>
                  EMAIL ADDRESS (OPTIONAL)
                </label>
                <input
                  type="email"
                  style={{ height: 44, width: '100%', padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 14, outline: 'none' }}
                  placeholder="arjun@gmail.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                />
              </div>

              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 4 }}>
                  CREATE PASSWORD
                </label>
                <input
                  type="password"
                  style={{ height: 44, width: '100%', padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 14, outline: 'none' }}
                  placeholder="At least 4 characters"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ height: 48, fontSize: 16, fontWeight: 700, marginTop: 8, backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              >
                {loading ? 'Creating Account…' : 'Create Account & Login'}
              </button>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
            <ShieldCheck size={16} color="#1B5E20" />
            <span>100% Encrypted & Safe Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
