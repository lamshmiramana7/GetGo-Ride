import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';

/* ── Inline App Icon Logo (matches screenshot style) ─────────────────── */
function AppIconLogo() {
  return (
    <div style={{
      width: 130,
      height: 130,
      borderRadius: 28,
      background: 'linear-gradient(145deg, #1a2e1a, #0d1f0d)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,166,81,0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1.5px solid rgba(0,166,81,0.3)',
      padding: '10px 14px',
      gap: 2,
    }}>
      {/* GetGo + Bike row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{
          fontFamily: 'Poppins, Arial, sans-serif',
          fontWeight: 900,
          fontSize: '1.75rem',
          color: '#fff',
          lineHeight: 1,
          letterSpacing: '-0.5px',
        }}>GetGo</span>
        {/* Bike SVG icon */}
        <svg width="32" height="28" viewBox="0 0 60 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rear wheel */}
          <circle cx="13" cy="33" r="10" stroke="white" strokeWidth="3" fill="none"/>
          <circle cx="13" cy="33" r="3" fill="white"/>
          {/* Front wheel */}
          <circle cx="47" cy="33" r="10" stroke="white" strokeWidth="3" fill="none"/>
          <circle cx="47" cy="33" r="3" fill="white"/>
          {/* Frame */}
          <path d="M13 33 L26 14 L38 14 L47 33" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M26 14 L13 33" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          {/* Seat/body */}
          <path d="M28 14 L38 14 L42 20 L32 20 Z" fill="white"/>
          {/* Handlebar */}
          <path d="M42 12 L46 12 L46 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          {/* Rider hint */}
          <circle cx="30" cy="9" r="5" fill="white"/>
        </svg>
      </div>
      {/* RIDE text */}
      <div style={{
        fontFamily: 'Poppins, Arial, sans-serif',
        fontWeight: 800,
        fontSize: '1.1rem',
        color: '#00A651',
        letterSpacing: '4px',
        marginTop: 2,
        textTransform: 'uppercase',
      }}>RIDE</div>
      {/* Tagline */}
      <div style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '0.48rem',
        color: 'rgba(255,255,255,0.65)',
        marginTop: 3,
        letterSpacing: '0.2px',
        textAlign: 'center',
        lineHeight: 1.3,
      }}>The ultimate transport network for India.</div>
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
        background: 'linear-gradient(160deg, #00A651 0%, #00C060 60%, #00A651 100%)',
        flex: '0 0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 52,
        paddingBottom: 44,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />
        <div style={{
          position: 'absolute', bottom: -30, left: -30,
          width: 140, height: 140, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
        }} />

        {/* App Icon */}
        <AppIconLogo />

        {/* Tagline */}
        <p style={{
          color: 'rgba(255,255,255,0.92)',
          fontSize: '1rem',
          fontWeight: 500,
          marginTop: 20,
          letterSpacing: '0.2px',
          textAlign: 'center',
        }}>
          The ultimate transport network for India
        </p>
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
