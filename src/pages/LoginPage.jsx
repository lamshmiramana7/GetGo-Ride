import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useLanguage } from '../App';
import { ArrowLeft, ShieldCheck, Globe, CheckCircle2, Lock, Sparkles, Smartphone, ChevronRight, Navigation, Award, Star } from 'lucide-react';
import { LOGO_BASE64 } from '../assets/logoBase64';
import { RIDE_BANNER_BASE64, DRIVER_AVATAR_BASE64 } from '../assets/mediaBase64';

const LANGUAGES = [
  { id: 'English', label: 'English', flag: '🇬🇧' },
  { id: 'தமிழ் (Tamil)', label: 'தமிழ்', flag: '🇮🇳' },
  { id: 'हिन्दी (Hindi)', label: 'हिन्दी', flag: '🇮🇳' },
  { id: 'తెలుగు (Telugu)', label: 'తెలుగు', flag: '🇮🇳' },
  { id: 'Malayalam', label: 'Malayalam', flag: '🇮🇳' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleSendOTP = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      setError(t('invalidPhoneError') || 'Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 800);
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
    if (code.length < 6) return;
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      login(`+91 ${phone}`);
    }, 800);
  };

  const handleResend = () => {
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
      backgroundColor: 'var(--bg-page)',
      background: 'radial-gradient(100% 50% at 50% 0%, rgba(27, 94, 32, 0.18) 0%, var(--bg-page) 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 440,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Professional Header Banner with Official GetGo Logo & Commercial HD Photo */}
        <div style={{
          background: 'linear-gradient(180deg, #044C23 0%, #022B14 100%)',
          padding: '24px 20px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Top Logo Lockup */}
          <div style={{
            padding: 6,
            borderRadius: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            maxWidth: 240,
            width: '100%',
            marginBottom: 16
          }}>
            <img
              src={LOGO_BASE64}
              alt="GetGo Ride Official Logo"
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 10, objectFit: 'contain' }}
            />
          </div>

          {/* Professional Commercial HD Picture Banner */}
          <div style={{
            width: '100%',
            height: 120,
            borderRadius: 16,
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <img src={RIDE_BANNER_BASE64} alt="GetGo Professional Transport" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(4, 76, 35, 0.9) 0%, rgba(2, 43, 20, 0.4) 100%)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ textAlign: 'left' }}>
                <span className="badge-flat-green" style={{ fontSize: 10, padding: '2px 8px', marginBottom: 4 }}>
                  <Star size={11} fill="currentColor" /> Verified 4.9 ★ Partner
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>
                  GetGo Transport Network
                </div>
                <div style={{ fontSize: 11, color: 'var(--brand-green-text)', marginTop: 2 }}>
                  Professional Drivers · Fast Delivery ⚡
                </div>
              </div>

              {/* Driver Portrait Photo Cutout */}
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #FFFFFF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                flexShrink: 0
              }}>
                <img src={DRIVER_AVATAR_BASE64} alt="Professional GetGo Captain" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector Selector Bar */}
        <div style={{
          padding: '12px 20px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
            <Globe size={15} color="var(--brand-green-text)" />
            <span style={{ fontWeight: 600 }}>{t('language') || 'Language'}:</span>
          </div>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {LANGUAGES.map(l => (
              <option key={l.id} value={l.id}>{l.flag} {l.label}</option>
            ))}
          </select>
        </div>

        {/* Professional Form Card Content Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {step === 'phone' ? (
            <>
              <div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 700 }}>
                  {t('signInTitle') || 'Welcome to GetGo'}
                </h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 13 }}>
                  {t('enterMobileSub') || 'Enter your mobile number to get started'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <label className="text-caption" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 12, letterSpacing: '0.02em' }}>
                  {t('mobileNumber') || 'MOBILE NUMBER'}
                </label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{
                    height: 50,
                    padding: '0 14px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    flexShrink: 0,
                  }}>
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    id="phone-input"
                    type="tel"
                    className="input-field"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                    autoFocus
                    maxLength={10}
                    style={{ height: 50, fontSize: 16, fontWeight: 600, letterSpacing: '0.05em' }}
                  />
                </div>
                {error && <p className="text-caption" style={{ color: '#EF4444', fontSize: 12, marginTop: 2 }}>{error}</p>}
              </div>

              <button
                id="send-otp-btn"
                className="btn-primary"
                onClick={handleSendOTP}
                disabled={loading}
                style={{
                  height: 50,
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  backgroundColor: 'var(--brand-green)',
                  boxShadow: '0 4px 14px rgba(27, 94, 32, 0.4)'
                }}
              >
                <span>{loading ? (t('sendingOtp') || 'Sending OTP…') : (t('continueBtn') || 'Continue with Mobile')}</span>
                {!loading && <ChevronRight size={18} />}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                fontSize: 12,
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)'
              }}>
                <ShieldCheck size={16} color="var(--brand-green-text)" />
                <span>{t('secureOtpVerified') || '100% Encrypted & Verified by GetGo Shield'}</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <button
                  className="btn-text"
                  onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                  style={{ paddingLeft: 0, marginBottom: 12, fontSize: 13, fontWeight: 600, color: 'var(--brand-green-text)', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <ArrowLeft size={16} /> {t('back') || 'Change Phone Number'}
                </button>
                <h2 className="text-section" style={{ color: 'var(--text-primary)', fontSize: 19, fontWeight: 700 }}>
                  {t('enterOtpTitle') || 'Enter Verification Code'}
                </h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 13 }}>
                  {t('codeSentTo') || 'Sent 6-digit verification code to'} <strong style={{ color: 'var(--text-primary)' }}>+91 {phone}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      id={`otp-digit-${i}`}
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
                        backgroundColor: 'var(--bg-input)',
                        border: `2px solid ${d ? 'var(--brand-green)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        boxShadow: d ? '0 0 0 3px rgba(34, 197, 94, 0.2)' : 'none'
                      }}
                    />
                  ))}
                </div>
                {error && <p className="text-caption" style={{ color: '#EF4444', textAlign: 'center', fontSize: 12 }}>{error}</p>}
              </div>

              <div style={{ textAlign: 'center' }}>
                {timer > 0 ? (
                  <span className="text-caption" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {t('resendCodeIn') || 'Resend code in'} <strong style={{ color: 'var(--brand-green-text)' }}>{timer}s</strong>
                  </span>
                ) : (
                  <button className="btn-text" onClick={handleResend} style={{ fontWeight: 600, color: 'var(--brand-green-text)', fontSize: 13 }}>
                    {t('resendOtpBtn') || 'Resend OTP Code'}
                  </button>
                )}
              </div>

              <button
                id="verify-otp-btn"
                className="btn-primary"
                onClick={() => handleVerifyOTP()}
                disabled={loading || otp.some(d => !d)}
                style={{
                  height: 50,
                  fontSize: 16,
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--brand-green)',
                  boxShadow: '0 4px 14px rgba(27, 94, 32, 0.4)'
                }}
              >
                {loading ? (t('verifying') || 'Verifying…') : (t('verifyAndContinue') || 'Verify & Login')}
              </button>

              <p className="text-caption" style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 12 }}>
                {t('demoOtpNotice') || 'Demo mode: Enter any 6-digit OTP code to test'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
