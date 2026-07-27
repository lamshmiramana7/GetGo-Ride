import React from 'react';

export default function GetGoLogo({ size = 32, showText = true, variant = 'primary' }) {
  // Colors based on core palette (#1B5E20)
  const isDark = variant === 'dark' || variant === 'white';
  const greenColor = isDark ? '#FFFFFF' : '#1B5E20';
  const subColor = isDark ? '#E8F5E9' : '#64748B';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {/* Flat Geometric Icon (Solid #1B5E20) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', flexShrink: 0 }}
      >
        {/* Solid Green Rounded Square Badge */}
        <rect width="100" height="100" rx="24" fill={variant === 'white' ? '#FFFFFF' : '#1B5E20'} />

        {/* Crisp Geometric 'G' + Forward Motion Arrow Mark (Solid White or Dark Green) */}
        <path
          d="M 68 36 C 63 29, 52 26, 42 30 C 30 35, 25 48, 28 60 C 32 72, 45 78, 58 74 C 67 71, 72 63, 72 54 L 48 54 L 48 44 L 82 44 L 82 56 C 82 71, 72 82, 56 86 C 36 91, 16 80, 10 60 C 4 40, 16 18, 38 12 C 54 8, 71 14, 80 26 Z"
          fill={variant === 'white' ? '#1B5E20' : '#FFFFFF'}
        />

        {/* Minimal Speed Bar Indicator */}
        <rect x="62" y="66" width="18" height="6" rx="3" fill={variant === 'white' ? '#1B5E20' : '#E8F5E9'} />
      </svg>

      {/* Wordmark */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
          <div style={{
            fontSize: size * 0.65,
            fontWeight: 800,
            color: greenColor,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.03em'
          }}>
            GetGo
          </div>
          <div style={{
            fontSize: size * 0.32,
            fontWeight: 700,
            color: subColor,
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.15em',
            marginTop: 2
          }}>
            SUPER-APP
          </div>
        </div>
      )}
    </div>
  );
}
