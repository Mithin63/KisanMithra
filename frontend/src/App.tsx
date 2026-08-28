import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoBanner } from './components/DemoBanner';
import { DemoSMSModal } from './components/DemoSMSModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { FarmerRegisterPage } from './pages/FarmerRegisterPage';
import { SlotBookingPage } from './pages/SlotBookingPage';
import { DigitalTokenPage } from './pages/DigitalTokenPage';
import { RealtimeQueuePage } from './pages/RealtimeQueuePage';
import { ProcurementTrackingPage } from './pages/ProcurementTrackingPage';
import { PaymentTrackingPage } from './pages/PaymentTrackingPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
          {/* Hackathon Judge Toolbar */}
          <DemoBanner />

          {/* Government Portal Header */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-grow">
            <Routes>
              {/* Public Landing */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<FarmerRegisterPage />} />

              {/* Farmer Routes */}
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/book-slot" element={<SlotBookingPage />} />
              <Route path="/farmer/digital-token" element={<DigitalTokenPage />} />
              <Route path="/farmer/my-queue" element={<RealtimeQueuePage />} />
              <Route path="/farmer/procurement" element={<ProcurementTrackingPage />} />
              <Route path="/farmer/payments" element={<PaymentTrackingPage />} />
              <Route path="/farmer/notifications" element={<NotificationsPage />} />
              <Route path="/farmer/profile" element={<FarmerProfilePage />} />

              {/* Officer Routes */}
              <Route path="/officer" element={<OfficerDashboard />} />
              <Route path="/officer/queue" element={<OfficerDashboard />} />
              <Route path="/officer/bookings" element={<OfficerDashboard />} />
              <Route path="/officer/procurement" element={<OfficerDashboard />} />
              <Route path="/officer/payments" element={<PaymentTrackingPage />} />
              <Route path="/officer/reports" element={<AdminDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/centres" element={<AdminDashboard />} />
              <Route path="/admin/farmers" element={<AdminDashboard />} />
              <Route path="/admin/bookings" element={<AdminDashboard />} />
              <Route path="/admin/procurement" element={<AdminDashboard />} />
              <Route path="/admin/payments" element={<PaymentTrackingPage />} />
              <Route path="/admin/analytics" element={<AdminDashboard />} />
            </Routes>
          </main>

          {/* Live SMS Notification Alert Pop-up */}
          <DemoSMSModal />

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
