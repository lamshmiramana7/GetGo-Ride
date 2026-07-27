import React from 'react';
import { LOGO_BASE64 } from '../assets/logoBase64';

export default function GetGoLogo({ size = 40, showText = true, variant = 'primary' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      {/* Uploaded GetGo RIDE Official Brand Logo Image */}
      <img
        src={LOGO_BASE64}
        alt="GetGo Ride"
        style={{
          height: size,
          maxHeight: size,
          width: 'auto',
          objectFit: 'contain',
          borderRadius: 8,
          display: 'block',
          flexShrink: 0
        }}
      />
    </div>
  );
}
