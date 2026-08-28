import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VoiceAssistant } from './components/VoiceAssistant';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { FarmerRegisterPage } from './pages/FarmerRegisterPage';
import { SlotBookingPage } from './pages/SlotBookingPage';
import { DigitalTokenPage } from './pages/DigitalTokenPage';
import { RealtimeQueuePage } from './pages/RealtimeQueuePage';
import { ProcurementTrackingPage } from './pages/ProcurementTrackingPage';
import { PaymentTrackingPage } from './pages/PaymentTrackingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { AgriWeatherPage } from './pages/AgriWeatherPage';
import { RequirementsGuidePage } from './pages/RequirementsGuidePage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AICropAdvisorPage } from './pages/AICropAdvisorPage';
import { HelplinePage } from './pages/HelplinePage';

// Routes that have their own full-screen layout (no shared Navbar/Footer)
const STANDALONE_ROUTES = ['/signin', '/login', '/register', '/landing', '/'];

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isStandalone = STANDALONE_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r + '?'));

  // Redirect logged-out users accessing private routes to login page
  if (!user && !isStandalone) {
    return <Navigate to="/signin" replace />;
  }

  // Role-based authorization guard
  if (user && !isStandalone) {
    const isFarmerRoute = location.pathname.startsWith('/farmer');
    const isOfficerRoute = location.pathname.startsWith('/officer');
    const isAdminRoute = location.pathname.startsWith('/admin');

    if (isFarmerRoute && user.role !== 'FARMER') {
      const defaultPath = user.role === 'OFFICER' ? '/officer' : '/admin';
      return <Navigate to={defaultPath} replace />;
    }
    if (isOfficerRoute && user.role !== 'OFFICER') {
      const defaultPath = user.role === 'FARMER' ? '/farmer' : '/admin';
      return <Navigate to={defaultPath} replace />;
    }
    if (isAdminRoute && user.role !== 'ADMIN') {
      const defaultPath = user.role === 'FARMER' ? '/farmer' : '/officer';
      return <Navigate to={defaultPath} replace />;
    }
  }

  // Redirect logged-in users visiting root / to their dashboard
  if (user && location.pathname === '/') {
    if (user.role === 'FARMER') return <Navigate to="/farmer" replace />;
    if (user.role === 'OFFICER') return <Navigate to="/officer" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {!isStandalone && <Navbar />}
      {!isStandalone && <VoiceAssistant />}

      <main className={`flex-grow ${isStandalone ? '' : ''}`}>
        <Routes>
          {/* Public */}
          <Route path="/"        element={<LoginPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login"   element={<LoginPage />} />
          <Route path="/signin"  element={<LoginPage />} />
          <Route path="/register" element={<FarmerRegisterPage />} />

          {/* Farmer */}
          <Route path="/farmer"                 element={<FarmerDashboard />} />
          <Route path="/farmer/book-slot"       element={<SlotBookingPage />} />
          <Route path="/farmer/weather"         element={<AgriWeatherPage />} />
          <Route path="/farmer/guidelines"      element={<RequirementsGuidePage />} />
          <Route path="/farmer/digital-token"   element={<DigitalTokenPage />} />
          <Route path="/farmer/my-queue"        element={<RealtimeQueuePage />} />
          <Route path="/farmer/procurement"     element={<ProcurementTrackingPage />} />
          <Route path="/farmer/payments"        element={<PaymentTrackingPage />} />
          <Route path="/farmer/notifications"   element={<NotificationsPage />} />
          <Route path="/farmer/profile"         element={<FarmerProfilePage />} />
          <Route path="/farmer/ai-advisor"      element={<AICropAdvisorPage />} />
          <Route path="/farmer/helpline"        element={<HelplinePage />} />

          {/* Officer */}
          <Route path="/officer"              element={<OfficerDashboard />} />
          <Route path="/officer/queue"        element={<OfficerDashboard />} />
          <Route path="/officer/bookings"     element={<OfficerDashboard />} />
          <Route path="/officer/procurement"  element={<OfficerDashboard />} />
          <Route path="/officer/payments"     element={<PaymentTrackingPage />} />
          <Route path="/officer/reports"      element={<AdminDashboard />} />

          {/* Admin */}
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="/admin/centres"      element={<AdminDashboard />} />
          <Route path="/admin/farmers"      element={<AdminDashboard />} />
          <Route path="/admin/bookings"     element={<AdminDashboard />} />
          <Route path="/admin/procurement"  element={<AdminDashboard />} />
          <Route path="/admin/payments"     element={<PaymentTrackingPage />} />
          <Route path="/admin/analytics"    element={<AdminDashboard />} />
        </Routes>
      </main>

      {!isStandalone && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
