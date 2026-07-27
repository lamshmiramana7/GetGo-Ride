import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../App';

export default function LoginPage() {
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = useRef([]);

  // Countdown timer
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
      // Focus first OTP box
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
      // Any 6-digit OTP works for the prototype
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
    <div className="login-screen">
      {/* Hero */}
      <div className="login-hero">
        <img src="/logo.png" alt="GetGo Ride" className="login-logo" />
        <p className="login-tagline">The ultimate transport network for India</p>
      </div>

      {/* Body */}
      <div className="login-body animate-slideUp">
        {step === 'phone' ? (
          <>
            <div>
              <h1 className="login-title font-poppins">Welcome back! 👋</h1>
              <p className="login-sub">Enter your mobile number to continue</p>
            </div>

            <div className="input-group">
              <label className="input-label">Mobile Number</label>
              <div className="phone-input-row">
                <div className="country-code-btn">🇮🇳 +91</div>
                <input
                  id="phone-input"
                  type="tel"
                  className="input-field flex-1"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  autoFocus
                  maxLength={10}
                />
              </div>
              {error && <p style={{ color: '#F87171', fontSize: '0.8125rem' }}>{error}</p>}
            </div>

            <button
              id="send-otp-btn"
              className="btn btn-primary"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-dots"><span/><span/><span/></span>
              ) : 'Send OTP →'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
              By continuing, you agree to GetGo's{' '}
              <span style={{ color: 'var(--brand-green)' }}>Terms of Service</span> and{' '}
              <span style={{ color: 'var(--brand-green)' }}>Privacy Policy</span>
            </p>
          </>
        ) : (
          <>
            <div>
              <button
                className="back-btn"
                onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                style={{ marginBottom: 16 }}
              >←</button>
              <h1 className="login-title font-poppins">Verify OTP 🔐</h1>
              <p className="login-sub">6-digit code sent to +91 {phone}</p>
            </div>

            <div className="input-group">
              <label className="input-label">Enter OTP</label>
              <div className="otp-container">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    id={`otp-digit-${i}`}
                    ref={el => (otpRefs.current[i] = el)}
                    type="tel"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-digit"
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                  />
                ))}
              </div>
              {error && <p style={{ color: '#F87171', fontSize: '0.8125rem', textAlign: 'center' }}>{error}</p>}
            </div>

            <p className="otp-timer" style={{ textAlign: 'center' }}>
              {timer > 0 ? (
                <>Resend OTP in <strong style={{ color: 'var(--text-primary)' }}>{timer}s</strong></>
              ) : (
                <>Didn't receive it?{' '}
                  <button className="otp-resend" onClick={handleResend}>Resend OTP</button>
                </>
              )}
            </p>

            <button
              id="verify-otp-btn"
              className="btn btn-primary"
              onClick={() => handleVerifyOTP()}
              disabled={loading || otp.some(d => !d)}
            >
              {loading ? (
                <span className="loading-dots"><span/><span/><span/></span>
              ) : 'Verify & Continue →'}
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              💡 Demo: Any 6-digit OTP works
            </p>
          </>
        )}
      </div>
    </div>
  );
}
