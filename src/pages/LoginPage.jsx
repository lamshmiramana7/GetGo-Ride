import React, { useState, useRef, useEffect } from 'react';
import { useAuth, useLanguage } from '../App';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { LOGO_BASE64 } from '../assets/logoBase64';
import { LOGIN_HERO_BASE64 } from '../assets/loginHeroBase64';

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
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-flat)',
        overflow: 'hidden',
      }}>
        {/* Header featuring exact uploaded GetGo RIDE logo picture */}
        <div style={{
          backgroundColor: '#005826',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderBottom: '1px solid var(--border)',
        }}>
          <img
            src={LOGIN_HERO_BASE64}
            alt="GetGo Ride Official Logo"
            style={{
              width: '100%',
              maxWidth: 280,
              height: 'auto',
              maxHeight: 280,
              borderRadius: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>

        {/* Language selector inside login */}
        <div style={{ padding: '12px 24px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            <option value="English">English</option>
            <option value="தமிழ் (Tamil)">தமிழ் (Tamil)</option>
            <option value="हिन्दी (Hindi)">हिन्दी (Hindi)</option>
            <option value="తెలుగు (Telugu)">తెలుగు (Telugu)</option>
            <option value="Malayalam">Malayalam</option>
          </select>
        </div>

        {/* Content Body */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {step === 'phone' ? (
            <>
              <div>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>
                  {t('signInTitle') || 'Sign in or create account'}
                </h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                  {t('enterMobileSub') || 'Enter your 10-digit mobile number to continue'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label className="text-caption" style={{ color: 'var(--text-secondary)' }}>
                  {t('mobileNumber') || 'Mobile Number'}
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{
                    height: 48,
                    padding: '0 14px',
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    flexShrink: 0,
                  }}>
                    🇮🇳 +91
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
                  />
                </div>
                {error && <p className="text-caption" style={{ color: '#EF4444' }}>{error}</p>}
              </div>

              <button
                id="send-otp-btn"
                className="btn-primary"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? (t('sendingOtp') || 'Sending OTP…') : (t('continueBtn') || 'Continue')}
              </button>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: 13,
                color: 'var(--text-muted)',
              }}>
                <ShieldCheck size={16} color="var(--brand-green-text)" />
                <span>{t('secureOtpVerified') || '100% Secure & OTP Verified'}</span>
              </div>
            </>
          ) : (
            <>
              <div>
                <button
                  className="btn-text"
                  onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }}
                  style={{ paddingLeft: 0, marginBottom: 8 }}
                >
                  <ArrowLeft size={16} /> {t('back') || 'Back'}
                </button>
                <h2 className="text-section" style={{ color: 'var(--text-primary)' }}>
                  {t('enterOtpTitle') || 'Enter Verification Code'}
                </h2>
                <p className="text-caption" style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                  {t('codeSentTo') || 'Sent 6-digit code to'} <strong>+91 {phone}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                        height: 48,
                        width: '100%',
                        backgroundColor: 'var(--bg-input)',
                        border: `1px solid ${d ? 'var(--brand-green)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        fontSize: 18,
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    />
                  ))}
                </div>
                {error && <p className="text-caption" style={{ color: '#EF4444', textAlign: 'center' }}>{error}</p>}
              </div>

              <div style={{ textAlign: 'center' }}>
                {timer > 0 ? (
                  <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
                    {t('resendCodeIn') || 'Resend code in'} <strong style={{ color: 'var(--text-primary)' }}>{timer}s</strong>
                  </span>
                ) : (
                  <button className="btn-text" onClick={handleResend}>
                    {t('resendOtpBtn') || 'Resend OTP Code'}
                  </button>
                )}
              </div>

              <button
                id="verify-otp-btn"
                className="btn-primary"
                onClick={() => handleVerifyOTP()}
                disabled={loading || otp.some(d => !d)}
              >
                {loading ? (t('verifying') || 'Verifying…') : (t('verifyAndContinue') || 'Verify & Continue')}
              </button>

              <p className="text-caption" style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                {t('demoOtpNotice') || 'Demo: Enter any 6-digit code to proceed'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
