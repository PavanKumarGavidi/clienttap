import { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { StoreProvider } from './store/StoreContext';
import { auth } from './lib/auth';
import MarketingSite from './components/Marketing';
import AppLayout from './components/AppLayout';
import AuthPages from './components/AuthPages';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import Invoices from './pages/Invoices';
import Retainers from './pages/Retainers';
import Portal from './pages/Portal';
import Settings from './pages/Settings';
import OtherPages from './pages/OtherPages';
import { useStore } from './store/StoreContext';

// Wrapper component that forces Settings to remount when user changes
function SettingsWrapper() {
  const { currentUser } = useStore();
  return <Settings key={currentUser?.id || 'no-user'} />;
}

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const AppContext = createContext<AppContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export const useApp = () => useContext(AppContext);

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
}

// Public route wrapper - redirects to app if already logged in
function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    auth.isAuthenticated().then(setIsAuthenticated);
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <AppContext.Provider value={{ darkMode, toggleDarkMode }}>
      <StoreProvider>
        <Routes>
          {/* Marketing Site - Public */}
          <Route path="/" element={<MarketingSite />} />
          <Route path="/pricing" element={<MarketingSite />} />
          <Route path="/features" element={<MarketingSite />} />
          <Route path="/demo" element={<MarketingSite />} />
          
          {/* Auth Pages - Public (redirect if logged in) */}
          <Route path="/signup" element={<PublicRoute><AuthPages /></PublicRoute>} />
          <Route path="/login" element={<AuthPages />} />
          <Route path="/forgot-password" element={<AuthPages />} />

          {/* App Routes - Protected */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<Leads />} />
            <Route path="clients" element={<Clients />} />
            <Route path="projects" element={<Projects />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="payments" element={<Invoices />} />
            <Route path="retainers" element={<Retainers />} />
            <Route path="messages" element={<OtherPages page="messages" />} />
            <Route path="meetings" element={<OtherPages page="meetings" />} />
            <Route path="tasks" element={<OtherPages page="tasks" />} />
            <Route path="documents" element={<OtherPages page="documents" />} />
            <Route path="team" element={<OtherPages page="team" />} />
            <Route path="billing" element={<OtherPages page="billing" />} />
            <Route path="activity" element={<OtherPages page="activity" />} />
            <Route path="settings" element={<SettingsWrapper />} />
          </Route>

          {/* Client Portal - Public */}
          <Route path="/portal" element={<Portal />} />
          <Route path="/portal/:slug" element={<Portal />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </StoreProvider>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
