import React, { useEffect, useRef } from 'react';

// ─── MapView uses Leaflet + OpenStreetMap (free, no API key) ─────────────
// Leaflet CSS is imported globally via index.css

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const ICON_SVG = (color = '#1B5E20', label = '') => `
  <div style="position:relative;width:36px;height:44px;">
    <svg viewBox="0 0 36 44" xmlns="http://www.w3.org/2000/svg" width="36" height="44">
      <path d="M18 0C8.06 0 0 8.06 0 18c0 12.77 16.13 25.16 17.38 26.14a1 1 0 001.24 0C19.87 43.16 36 30.77 36 18 36 8.06 27.94 0 18 0z" fill="${color}"/>
      <circle cx="18" cy="18" r="8" fill="white"/>
    </svg>
    ${label ? `<div style="position:absolute;top:7px;left:50%;transform:translateX(-50%);font-size:9px;font-weight:800;color:${color}">${label}</div>` : ''}
  </div>
`;

const CAR_SVG = (color = '#1B5E20') => `
  <div style="background:${color};border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:16px">🚗</div>
`;

/**
 * MapView - Reusable Leaflet map component
 * Props:
 *   center: [lat, lng]
 *   zoom: number
 *   height: string (CSS)
 *   markers: [{ lat, lng, color, label, popup, type: 'pin'|'car'|'pulse' }]
 *   routeCoords: [[lat, lng], ...] — draws a blue route line
 *   showUserDot: boolean — show animated blue user location dot
 */
export default function MapView({
  center = [13.0827, 80.2707], // Default: Chennai
  zoom = 13,
  height = '280px',
  markers = [],
  routeCoords = [],
  showUserDot = false,
}) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);

  useEffect(() => {
    // Dynamic import Leaflet to avoid SSR issues
    import('leaflet').then(L => {
      // Fix default icon paths for Vite bundler
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      if (!mapRef.current) return;

      // Destroy old instance
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, maxZoom: 19 }).addTo(map);

      // User pulsing dot
      if (showUserDot) {
        const pulseIcon = L.divIcon({
          html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563EB;border:3px solid white;box-shadow:0 0 0 4px rgba(37,99,235,0.3),0 0 0 8px rgba(37,99,235,0.15);animation:pulse 2s infinite"></div>
          <style>@keyframes pulse{0%,100%{box-shadow:0 0 0 4px rgba(37,99,235,0.3),0 0 0 8px rgba(37,99,235,0.12)}50%{box-shadow:0 0 0 7px rgba(37,99,235,0.2),0 0 0 14px rgba(37,99,235,0.06)}}</style>`,
          className: '',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker(center, { icon: pulseIcon }).addTo(map);
      }

      // Custom Markers
      markers.forEach(m => {
        let icon;
        if (m.type === 'car') {
          icon = L.divIcon({ html: CAR_SVG(m.color || '#1B5E20'), className: '', iconSize: [34, 34], iconAnchor: [17, 17] });
        } else {
          icon = L.divIcon({ html: ICON_SVG(m.color || '#1B5E20', m.label || ''), className: '', iconSize: [36, 44], iconAnchor: [18, 44] });
        }

        const marker = L.marker([m.lat, m.lng], { icon });
        if (m.popup) marker.bindPopup(m.popup);
        marker.addTo(map);
        markersRef.current.push(marker);
      });

      // Route Polyline
      if (routeCoords.length >= 2) {
        routeRef.current = L.polyline(routeCoords, {
          color: '#1B5E20',
          weight: 4,
          opacity: 0.8,
          dashArray: '8 4',
        }).addTo(map);
        map.fitBounds(routeRef.current.getBounds(), { padding: [30, 30] });
      }

      instanceRef.current = map;
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.remove();
        instanceRef.current = null;
      }
      markersRef.current = [];
    };
  }, [JSON.stringify(center), zoom, JSON.stringify(markers), JSON.stringify(routeCoords), showUserDot]);

  return (
    <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-flat)' }}>
      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div ref={mapRef} style={{ height, width: '100%', zIndex: 0 }} />
      {/* Map watermark */}
      <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 10, color: '#FFFFFF', backgroundColor: 'rgba(27,94,32,0.8)', padding: '2px 8px', borderRadius: 4, zIndex: 400, fontWeight: 600 }}>
        📍 GetGo Maps
      </div>
    </div>
  );
}
