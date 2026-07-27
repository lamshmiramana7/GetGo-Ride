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

// ── Trip Context ─────────────────────────────────────────────
export const TripContext = createContext(null);
export const useTrip = () => useContext(TripContext);

// ── Theme Context ─────────────────────────────────────────────
export const ThemeContext = createContext(null);
export const useTheme = () => useContext(ThemeContext);

// ── Language Context ──────────────────────────────────────────
export const LanguageContext = createContext(null);
export const useLanguage = () => useContext(LanguageContext);

// ── App Shell ────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [activeTrip, setActiveTrip] = useState(null);

  // Theme — default dark, persisted in localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('gg-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gg-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  // Language — persisted in localStorage
  const [language, setLanguage] = useState(() => localStorage.getItem('gg-lang') || 'English');

  useEffect(() => {
    localStorage.setItem('gg-lang', language);
  }, [language]);

  const t = useCallback((key) => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS['English'];
    return dict[key] || TRANSLATIONS['English'][key] || key;
  }, [language]);

  const login = useCallback((phone) => {
    setUser({ ...MOCK_USER, phone });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveTrip(null);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <AuthContext.Provider value={{ user, login, logout }}>
          <TripContext.Provider value={{ activeTrip, setActiveTrip }}>
            <HashRouter>
              <Routes>
                {/* Public Login Route - Always renders LoginPage */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected App Routes */}
                <Route element={user ? <Layout /> : <LoginPage />}>
                  <Route index element={<HomePage />} />
                  <Route path="ride" element={<RideBookingPage />} />
                  <Route path="parcel" element={<ParcelPage />} />
                  <Route path="travel" element={<TravelPage />} />
                  <Route path="history" element={<TripHistoryPage />} />
                  <Route path="trips" element={<TripHistoryPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="chat" element={<ChatPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<LoginPage />} />
              </Routes>
            </HashRouter>
          </TripContext.Provider>
        </AuthContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
}
