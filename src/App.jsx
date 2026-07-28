import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MOCK_USER } from './data/mockData';
import { TRANSLATIONS } from './data/translations';

import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import RideBookingPage from './pages/RideBookingPage';
import ParcelPage from './pages/ParcelPage';
import TravelPage from './pages/TravelPage';
import TripHistoryPage from './pages/TripHistoryPage';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';

import './index.css';

// ── Auth Context ────────────────────────────────────────────
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ── Location Context ─────────────────────────────────────────
export const LocationContext = createContext(null);
export const useLocation = () => useContext(LocationContext);

// ── Trip Context ─────────────────────────────────────────────
export const TripContext = createContext(null);
export const useTrip = () => useContext(TripContext);

// ── Theme Context ─────────────────────────────────────────────
export const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

// ── Language Context ──────────────────────────────────────────
export const LanguageContext = createContext(null);
export const useLanguage = () => useContext(LanguageContext);

export default function App() {
  // Saved users DB in localStorage
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gg-active-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTrip, setActiveTrip] = useState(null);

  // Hardened Light Mode Default — clears any stale dark keys on startup
  const [theme, setTheme] = useState(() => {
    // Remove old 'gg-theme' key from previous sessions that may have stored 'dark'
    const oldTheme = localStorage.getItem('gg-theme');
    if (oldTheme) localStorage.removeItem('gg-theme');
    // Only activate dark if user explicitly toggled it THIS session
    const explicit = localStorage.getItem('gg-explicit-dark');
    if (explicit !== 'true') {
      // Ensure dark is not accidentally set
      localStorage.setItem('gg-explicit-dark', 'false');
      return 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(current => {
      const next = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('gg-explicit-dark', next === 'dark' ? 'true' : 'false');
      return next;
    });
  }, []);

  // Location management & Geolocation API permission
  const [userLocation, setUserLocation] = useState(() => localStorage.getItem('gg-user-loc') || 'Chennai, Tamil Nadu');
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const requestLocationPermission = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const detected = `Lat ${pos.coords.latitude.toFixed(2)}, Lng ${pos.coords.longitude.toFixed(2)} (Chennai Center)`;
          setUserLocation(detected);
          localStorage.setItem('gg-user-loc', detected);
          setLocationPermissionGranted(true);
        },
        (err) => {
          console.warn('Geolocation fallback to default:', err.message);
          setUserLocation('Chennai, Tamil Nadu');
          localStorage.setItem('gg-user-loc', 'Chennai, Tamil Nadu');
        }
      );
    }
  }, []);

  useEffect(() => {
    requestLocationPermission();
  }, [requestLocationPermission]);

  // Language — persisted in localStorage
  const [language, setLanguage] = useState(() => localStorage.getItem('gg-lang') || 'English');

  useEffect(() => {
    localStorage.setItem('gg-lang', language);
  }, [language]);

  const t = useCallback((key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['English'];
    return dict[key] || TRANSLATIONS['English'][key] || key;
  }, [language]);

  // Authenticate user with saved credentials
  const login = useCallback((phone) => {
    const db = JSON.parse(localStorage.getItem('gg-registered-users') || '[]');
    const cleanPhone = phone.replace(/\D/g, '');
    const found = db.find(u => u.phone.replace(/\D/g, '') === cleanPhone);

    const loggedInUser = found || {
      ...MOCK_USER,
      phone: cleanPhone || '9876543210',
      name: found ? found.name : 'Registered Rider',
    };

    setUser(loggedInUser);
    localStorage.setItem('gg-active-user', JSON.stringify(loggedInUser));
  }, []);

  // Register new account
  const registerAccount = useCallback((userData) => {
    const db = JSON.parse(localStorage.getItem('gg-registered-users') || '[]');
    const newUser = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      phone: userData.phone,
      email: userData.email || `${userData.phone}@getgoride.in`,
      language: userData.language || 'English',
      wallet: 500.00,
    };

    db.push(newUser);
    localStorage.setItem('gg-registered-users', JSON.stringify(db));
    setUser(newUser);
    localStorage.setItem('gg-active-user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveTrip(null);
    localStorage.removeItem('gg-active-user');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AuthContext.Provider value={{ user, login, registerAccount, logout }}>
          <LocationContext.Provider value={{ userLocation, setUserLocation, requestLocationPermission, locationPermissionGranted }}>
            <TripContext.Provider value={{ activeTrip, setActiveTrip }}>
              <HashRouter>
                <Routes>
                  {user ? (
                    /* Authenticated App Shell */
                    <Route element={<Layout />}>
                      <Route index element={<HomePage />} />
                      <Route path="ride" element={<RideBookingPage />} />
                      <Route path="parcel" element={<ParcelPage />} />
                      <Route path="travel" element={<TravelPage />} />
                      <Route path="history" element={<TripHistoryPage />} />
                      <Route path="trips" element={<TripHistoryPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="chat" element={<ChatPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                  ) : (
                    /* Pre-login Protection: Only LoginPage rendered */
                    <Route path="*" element={<LoginPage />} />
                  )}
                </Routes>
              </HashRouter>
            </TripContext.Provider>
          </LocationContext.Provider>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}
