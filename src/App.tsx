import { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MarketingSite from './components/Marketing';
import AppLayout from './components/AppLayout';
import AuthPages from './components/AuthPages';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import Portal from './pages/Portal';
import Settings from './pages/Settings';
import OtherPages from './pages/OtherPages';

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentView: 'marketing' | 'app' | 'portal';
  setCurrentView: (v: 'marketing' | 'app' | 'portal') => void;
}

export const AppContext = createContext<AppContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  currentView: 'marketing',
  setCurrentView: () => {},
});

export const useApp = () => useContext(AppContext);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState<'marketing' | 'app' | 'portal'>('marketing');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode, currentView, setCurrentView }}>
      <Router>
        <Routes>
          {/* Marketing Site */}
          <Route path="/" element={<MarketingSite />} />
          <Route path="/pricing" element={<MarketingSite />} />
          <Route path="/features" element={<MarketingSite />} />
          <Route path="/security" element={<MarketingSite />} />
          <Route path="/demo" element={<MarketingSite />} />
          
          {/* Auth Pages */}
          <Route path="/signup" element={<AuthPages />} />
          <Route path="/login" element={<AuthPages />} />
          <Route path="/forgot-password" element={<AuthPages />} />
          <Route path="/reset-password" element={<AuthPages />} />
          <Route path="/accept-invite" element={<AuthPages />} />
          <Route path="/portal/:slug/login" element={<AuthPages />} />

          {/* App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="messages" element={<OtherPages page="messages" />} />
            <Route path="meetings" element={<OtherPages page="meetings" />} />
            <Route path="tasks" element={<OtherPages page="tasks" />} />
            <Route path="documents" element={<OtherPages page="documents" />} />
            <Route path="team" element={<OtherPages page="team" />} />
            <Route path="billing" element={<OtherPages page="billing" />} />
            <Route path="activity" element={<OtherPages page="activity" />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Client Portal */}
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/:slug" element={<Portal />} />

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppContext.Provider>
  );
}
