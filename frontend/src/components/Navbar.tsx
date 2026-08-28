import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, CheckSquare, CreditCard, Bell, User,
  Building2, BarChart3, LogOut, Menu, X, Shield, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localState } from '../services/api';

export const Navbar: React.FC = () => {
  const { user, role, switchRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const updateUnread = () => {
      const unread = localState.notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
    };

    updateUnread();
    const unsubscribe = localState.subscribe(updateUnread);
    return unsubscribe;
  }, []);

  const isActive = (path: string) => location.pathname === path;

  interface NavItem {
    label: string;
    path: string;
    icon: any;
    badge?: number;
  }

  // Role-specific navigation items
  const farmerNav: NavItem[] = [
    { label: 'Dashboard', path: '/farmer', icon: Wheat },
    { label: 'Book Slot', path: '/farmer/book-slot', icon: Calendar },
    { label: 'My Queue', path: '/farmer/my-queue', icon: Clock },
    { label: 'Procurement', path: '/farmer/procurement', icon: CheckSquare },
    { label: 'Payments', path: '/farmer/payments', icon: CreditCard },
    { label: 'Notifications', path: '/farmer/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/farmer/profile', icon: User }
  ];

  const officerNav: NavItem[] = [
    { label: 'Dashboard', path: '/officer', icon: Building2 },
    { label: 'Today\'s Queue', path: '/officer/queue', icon: Clock },
    { label: 'Bookings', path: '/officer/bookings', icon: Calendar },
    { label: 'Procurement', path: '/officer/procurement', icon: CheckSquare },
    { label: 'Payments', path: '/officer/payments', icon: CreditCard },
    { label: 'Reports', path: '/officer/reports', icon: BarChart3 }
  ];

  const adminNav: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: BarChart3 },
    { label: 'Centres', path: '/admin/centres', icon: Building2 },
    { label: 'Farmers', path: '/admin/farmers', icon: User },
    { label: 'Bookings', path: '/admin/bookings', icon: Calendar },
    { label: 'Procurement', path: '/admin/procurement', icon: CheckSquare },
    { label: 'Payments', path: '/admin/payments', icon: CreditCard },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 }
  ];

  const navItems = role === 'FARMER' ? farmerNav : role === 'OFFICER' ? officerNav : adminNav;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-[37px] z-30 shadow-sm">
      {/* Top Ministry Ribbon */}
      <div className="bg-gradient-to-r from-orange-500 via-white to-emerald-600 h-1"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo & Government Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Wheat className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                  Smart<span className="text-emerald-700">Procure</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Govt. Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Ministry of Consumer Affairs, Food & Public Distribution
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 ? (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Role Identity */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0) : 'F'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-800 leading-tight">{user.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {role === 'FARMER' ? `ID: ${user.farmer?.farmer_id || 'AP-FARM-9872'}` : role === 'OFFICER' ? 'Guntur Centre Officer' : 'Admin Authority'}
                  </div>
                </div>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-slate-400 hover:text-red-600 p-1 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-auto px-2 py-0.5 text-xs bg-red-500 text-white font-bold rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
