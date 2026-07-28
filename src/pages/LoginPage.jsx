import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useLanguage } from '../App';
import { ShieldCheck, Globe, UserPlus, LogIn, ArrowLeft, ChevronRight } from 'lucide-react';

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
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'

  // Phone & Registration State
  const [phone, setPhone] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // 6-Digit OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSendOTP = (e) => {
    if (e) e.preventDefault();
    if (activeTab === 'register' && !regName.trim()) {
      setError(t('fullName') ? 'Please enter your full name.' : 'Please enter your full name.');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError(t('invalidPhoneError') || 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 600);
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (next.every(d => d !== '')) handleVerifyOTP(next);
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerifyOTP = (otpArr = otp) => {
    const code = otpArr.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (activeTab === 'register') {
        registerAccount({
          name: regName,
          phone: phone,
          email: regEmail,
          language: language,
        });
      } else {
        login(phone);
      }
    }, 600);
  };

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
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
        {/* Header Bar with Language Selector */}
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
                padding: '6px 10px',
                borderRadius: 6,
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                fontSize: 13,
                fontWeight: 600,
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
        {step === 'phone' && (
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
              <span>{t('loginTab') || 'Login'}</span>
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
              <span>{t('createAccountTab') || 'Create Account'}</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: '#FFFFFF' }}>
          {error && (
            <div style={{ padding: 12, borderRadius: 8, backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activeTab === 'register' && (
                <div>
                  <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 4 }}>
                    {t('fullName') || 'FULL NAME'}
                  </label>
                  <input
                    type="text"
                    style={{ height: 46, width: '100%', padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 14, outline: 'none' }}
                    placeholder="e.g. Arjun Krishnamurthy"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 6 }}>
                  {t('mobileNumber') || 'MOBILE NUMBER'}
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ height: 48, padding: '0 12px', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: 8, display: 'flex', alignItems: 'center', fontWeight: 700, color: '#0F172A' }}>
                    🇮🇳 +91
                  </div>
                  <input
                    type="tel"
                    style={{ height: 48, flex: 1, padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 15, fontWeight: 600, outline: 'none' }}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    maxLength={10}
                  />
                </div>
              </div>

              {activeTab === 'register' && (
                <div>
                  <label style={{ color: '#475569', fontWeight: 600, fontSize: 12, display: 'block', marginBottom: 4 }}>
                    {t('emailOptional') || 'EMAIL ADDRESS (OPTIONAL)'}
                  </label>
                  <input
                    type="email"
                    style={{ height: 46, width: '100%', padding: '0 14px', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: 8, color: '#0F172A', fontSize: 14, outline: 'none' }}
                    placeholder="arjun@gmail.com"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{ height: 50, fontSize: 16, fontWeight: 700, marginTop: 8, backgroundColor: '#1B5E20', color: '#FFFFFF', border: 'none', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <span>{loading ? (t('sendingOtp') || 'Sending OTP…') : (t('sendOtp') || 'Get OTP Code')}</span>
                {!loading && <ChevronRight size={18} />}
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                  style={{ paddingLeft: 0, marginBottom: 10, fontSize: 13, fontWeight: 600, color: '#1B5E20', display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <ArrowLeft size={16} /> {t('changePhone') || 'Change Mobile Number'}
                </button>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0F172A' }}>
                  {t('enterOtp') || 'Enter 6-Digit OTP Code'}
                </h2>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
                  {t('codeSentTo') || 'Sent 6-digit OTP code to'} <strong style={{ color: '#0F172A' }}>+91 {phone}</strong>
                </p>
              </div>

              {/* 6-Digit OTP Input Boxes */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => (otpRefs.current[i] = el)}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      height: 50,
                      width: '100%',
                      backgroundColor: '#F8FAFC',
                      border: `2px solid ${d ? '#1B5E20' : '#CBD5E1'}`,
                      borderRadius: 8,
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                {timer > 0 ? (
                  <span style={{ fontSize: 13, color: '#64748B' }}>
                    {t('resendIn') || 'Resend code in'} <strong style={{ color: '#1B5E20' }}>{timer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    style={{ fontWeight: 600, color: '#1B5E20', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    {t('resendOtp') || 'Resend OTP Code'}
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOTP()}
                disabled={loading || otp.some(d => !d)}
                style={{
                  height: 50,
                  fontSize: 16,
                  fontWeight: 700,
                  backgroundColor: '#1B5E20',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  opacity: otp.some(d => !d) ? 0.6 : 1
                }}
              >
                {loading ? 'Verifying…' : (activeTab === 'register' ? (t('verifyAndRegister') || 'Verify OTP & Create Account') : (t('verifyAndLogin') || 'Verify OTP & Login'))}
              </button>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: '#64748B' }}>
            <ShieldCheck size={16} color="#1B5E20" />
            <span>100% Encrypted & Safe OTP Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
