import React from 'react';

export default function GetGoLogo({ size = 80, showText = true }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Outer circle background */}
      <circle cx="100" cy="100" r="96" fill="#0F172A" stroke="#00A651" strokeWidth="4"/>

      {/* Green inner glow circle */}
      <circle cx="100" cy="100" r="74" fill="#00A651"/>

      {/* Highlight arc */}
      <ellipse cx="100" cy="72" rx="52" ry="28" fill="rgba(255,255,255,0.12)"/>

      {/* Auto-rickshaw body */}
      <rect x="54" y="96" width="68" height="36" rx="8" fill="#fff"/>

      {/* Windshield */}
      <rect x="98" y="100" width="20" height="18" rx="3" fill="#B2F0D3"/>

      {/* Roof */}
      <path d="M60 96 Q62 78 100 76 Q130 76 134 96Z" fill="white"/>

      {/* Roof detail */}
      <path d="M68 96 Q70 82 100 80 Q126 80 128 96Z" fill="#E2FAF0"/>

      {/* Front wheel */}
      <circle cx="128" cy="136" r="12" fill="#0F172A" stroke="white" strokeWidth="3"/>
      <circle cx="128" cy="136" r="5" fill="white"/>

      {/* Rear wheel */}
      <circle cx="70" cy="136" r="12" fill="#0F172A" stroke="white" strokeWidth="3"/>
      <circle cx="70" cy="136" r="5" fill="white"/>

      {/* Speed lines */}
      <line x1="34" y1="100" x2="50" y2="100" stroke="#FFD700" strokeWidth="3" strokeLinecap="round"/>
      <line x1="30" y1="110" x2="50" y2="110" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="36" y1="120" x2="50" y2="120" stroke="#FFD700" strokeWidth="2" strokeLinecap="round"/>

      {/* Gold lightning bolt */}
      <polygon points="108,54 102,68 107,68 100,84 116,66 110,66" fill="#FFD700"/>

      {/* Text: GetGo */}
      {showText && (
        <text
          x="100"
          y="176"
          textAnchor="middle"
          fontSize="20"
          fontWeight="900"
          fontFamily="Arial, sans-serif"
          letterSpacing="2"
          fill="white"
        >
          GETGO
        </text>
      )}
    </svg>
  );
}
