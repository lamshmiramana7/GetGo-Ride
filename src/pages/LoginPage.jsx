import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';

/* ── Inline App Icon Logo (matches screenshot style) ─────────────────── */
function AppIconLogo() {
  return (
    <div style={{
      width: 140,
      height: 140,
      borderRadius: 32,
      background: 'linear-gradient(180deg, #053315 0%, #021c0b 100%)',
      boxShadow: '0 10px 36px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.15)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid rgba(0,210,100,0.3)',
      padding: '12px 14px',
      boxSizing: 'border-box',
    }}>
      {/* GetGo + Bike Rider row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 900,
          fontSize: '1.75rem',
          color: '#ffffff',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}>GetGo</span>

        {/* Motorcycle Rider Vector */}
        <svg width="40" height="30" viewBox="0 0 50 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Speed lines behind */}
          <line x1="2" y1="12" x2="12" y2="12" stroke="#00A651" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="0" y1="20" x2="10" y2="20" stroke="#00A651" strokeWidth="2" strokeLinecap="round"/>
          {/* Wheels */}
          <circle cx="16" cy="27" r="7" stroke="white" strokeWidth="2.5"/>
          <circle cx="40" cy="27" r="7" stroke="white" strokeWidth="2.5"/>
          {/* Chassis & Body */}
          <path d="M16 27 L26 17 L36 17 L40 27" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M26 17 L22 10 L32 7 L36 17" fill="white"/>
          {/* Rider */}
          <circle cx="28" cy="6" r="3.5" fill="white"/>
          <path d="M25 9 Q32 11 36 15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* -- RIDE -- line section */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 6, margin: '4px 0 2px' }}>
        <div style={{ height: 1.5, flex: 1, background: '#00A651' }} />
        <span style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 900,
          fontSize: '1.125rem',
          color: '#00A651',
          letterSpacing: '3px',
          lineHeight: 1,
        }}>RIDE</span>
        <div style={{ height: 1.5, flex: 1, background: '#00A651' }} />
      </div>

      {/* Sub-tagline inside logo box */}
      <div style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: '0.45rem',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '0.1px',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        marginTop: 2,
      }}>
        The ultimate transport network for India.
      </div>
    </div>
  );
}

/* ── Main Login Page ──────────────────────────────────────────────────── */
export default function LoginPage() {
  const { login } = useAuth();
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
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      setTimer(30);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }, 1200);
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
    }, 1000);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0F172A',
      fontFamily: 'Outfit, sans-serif',
    }}>

      {/* ── GREEN HERO SECTION ── */}
      <div style={{
        background: '#044C23',
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '36px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />

        {/* User's Uploaded Logo Image */}
        <div style={{
          width: 200,
          maxHeight: 200,
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
          border: '2px solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#044C23',
        }}>
          <img
            src="logo.png"
            alt="GetGo Ride Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* ── DARK BODY SECTION ── */}
      <div style={{
        flex: 1,
        background: '#111827',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        marginTop: -16,
        padding: '32px 24px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        overflowY: 'auto',
      }}>

        {step === 'phone' ? (
          <>
            {/* Heading */}
            <div>
              <h1 style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '1.625rem',
                fontWeight: 800,
                color: '#fff',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}>
                Welcome back! 👋
              </h1>
              <p style={{
                color: 'rgba(255,255,255,0.55)',
                fontSize: '0.9375rem',
                marginTop: 6,
              }}>
                Enter your mobile number to continue
              </p>
            </div>

            {/* Phone Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
              }}>
                Mobile Number
              </label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
                {/* Country code */}
                <div style={{
                  background: '#1E2A3A',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  borderRadius: 14,
                  padding: '14px 16px',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9375rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  🇮🇳 +91
                </div>
                {/* Number input */}
                <input
                  id="phone-input"
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  autoFocus
                  maxLength={10}
                  style={{
                    flex: 1,
                    background: '#1E2A3A',
                    border: '1.5px solid rgba(255,255,255,0.12)',
                    borderRadius: 14,
                    padding: '14px 18px',
                    color: '#fff',
                    fontSize: '1.0625rem',
                    fontFamily: 'Outfit, sans-serif',
                    fontWeight: 500,
                    outline: 'none',
                    letterSpacing: '1px',
                  }}
                  onFocus={e => e.target.style.borderColor = '#00A651'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
              {error && <p style={{ color: '#F87171', fontSize: '0.8125rem', margin: 0 }}>{error}</p>}
            </div>

            {/* Send OTP Button */}
            <button
              id="send-otp-btn"
              onClick={handleSendOTP}
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #00A651, #00C060)',
                border: 'none',
                borderRadius: 16,
                padding: '17px',
                color: '#fff',
                fontSize: '1.0625rem',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 6px 20px rgba(0,166,81,0.4)',
                transition: 'transform 0.15s, opacity 0.15s',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={e => { if (!loading) e.target.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
            >
              {loading ? (
                <span style={{ display: 'flex', gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'bounce 0.8s infinite' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'bounce 0.8s 0.15s infinite' }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'bounce 0.8s 0.3s infinite' }} />
                </span>
              ) : <>Send OTP →</>}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', lineHeight: 1.6, margin: 0 }}>
              By continuing, you agree to GetGo's{' '}
              <span style={{ color: '#00A651' }}>Terms of Service</span> and{' '}
              <span style={{ color: '#00A651' }}>Privacy Policy</span>
            </p>
          </>
        ) : (
          <>
            {/* OTP Step */}
            <div>
              <button
                onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', marginBottom: 16, fontSize: '0.9rem' }}
              >
                ← Back
              </button>
              <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.625rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                Verify OTP 🔐
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9375rem', marginTop: 6 }}>
                6-digit code sent to <strong style={{ color: '#fff' }}>+91 {phone}</strong>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                Enter OTP
              </label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
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
                      width: '100%',
                      aspectRatio: '1',
                      background: '#1E2A3A',
                      border: `2px solid ${d ? '#00A651' : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 14,
                      color: '#fff',
                      fontSize: '1.375rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                  />
                ))}
              </div>
              {error && <p style={{ color: '#F87171', fontSize: '0.8125rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
              {timer > 0 ? (
                <>Resend OTP in <strong style={{ color: '#fff' }}>{timer}s</strong></>
              ) : (
                <>Didn't receive it?{' '}
                  <button onClick={handleResend} style={{ background: 'none', border: 'none', color: '#00A651', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem' }}>
                    Resend OTP
                  </button>
                </>
              )}
            </p>

            <button
              id="verify-otp-btn"
              onClick={() => handleVerifyOTP()}
              disabled={loading || otp.some(d => !d)}
              style={{
                background: loading || otp.some(d => !d) ? '#1E2A3A' : 'linear-gradient(135deg, #00A651, #00C060)',
                border: 'none',
                borderRadius: 16,
                padding: '17px',
                color: loading || otp.some(d => !d) ? 'rgba(255,255,255,0.35)' : '#fff',
                fontSize: '1.0625rem',
                fontWeight: 700,
                fontFamily: 'Poppins, sans-serif',
                cursor: loading || otp.some(d => !d) ? 'not-allowed' : 'pointer',
                boxShadow: !loading && !otp.some(d => !d) ? '0 6px 20px rgba(0,166,81,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Verifying…' : 'Verify & Continue →'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: 0 }}>
              💡 Demo: Any 6-digit OTP works
            </p>
          </>
        )}
      </div>
    </div>
  );
}
