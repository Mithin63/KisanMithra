import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, CheckSquare, CreditCard, Bell, User,
  Building2, BarChart3, LogOut, Menu, X, CloudSun, ClipboardCheck,
  Home, ChevronRight, Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';
import { LanguageSwitcher } from './LanguageSwitcher';

export const Navbar: React.FC = () => {
  const { user, role, logout } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateUnread = () => {
      setUnreadCount(localState.notifications.filter(n => !n.read).length);
    };
    updateUnread();
    return localState.subscribe(updateUnread);
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  interface NavItem { label: string; path: string; icon: any; badge?: number; shortLabel?: string; }

  const hasActiveBooking = user ? localState.bookings.some(b => b.farmer_id === user.farmer?.id) : false;

  const farmerNav: NavItem[] = [
    { label: t('nav_dashboard'),      shortLabel: 'Home',      path: '/farmer',              icon: Home },
    { label: t('nav_book_slot'),       shortLabel: 'Book',      path: '/farmer/book-slot',    icon: Calendar },
    { label: t('nav_weather'),         shortLabel: 'Weather',   path: '/farmer/weather',      icon: CloudSun },
    { label: t('nav_guidelines'),      shortLabel: 'Checklist', path: '/farmer/guidelines',   icon: ClipboardCheck },
    ...(hasActiveBooking ? [
      { label: t('nav_my_queue'),        shortLabel: 'Queue',     path: '/farmer/my-queue',     icon: Clock },
      { label: t('nav_procurement'),     shortLabel: 'Track',     path: '/farmer/procurement',  icon: CheckSquare },
      { label: t('nav_payments'),        shortLabel: 'Pay',       path: '/farmer/payments',     icon: CreditCard },
    ] : []),
    { label: t('nav_notifications'),   shortLabel: 'Alerts',    path: '/farmer/notifications', icon: Bell, badge: unreadCount },
    { label: t('nav_profile'),         shortLabel: 'Profile',   path: '/farmer/profile',      icon: User },
    { label: 'AI Crop Advisor',        shortLabel: 'AI',        path: '/farmer/ai-advisor',   icon: Brain },
  ];

  // Desktop nav shows only first 8 items to leave room for profile chip + logout
  const farmerDesktopNav = farmerNav.slice(0, 8);

  const officerNav: NavItem[] = [
    { label: 'Dashboard', shortLabel: 'Home',    path: '/officer',             icon: Building2 },
    { label: "Today's Queue", shortLabel: 'Queue', path: '/officer/queue',     icon: Clock },
    { label: 'Bookings',   shortLabel: 'Bookings', path: '/officer/bookings',  icon: Calendar },
    { label: 'Procurement', shortLabel: 'Procure', path: '/officer/procurement', icon: CheckSquare },
    { label: 'Payments',   shortLabel: 'Pay',     path: '/officer/payments',   icon: CreditCard },
    { label: 'Reports',    shortLabel: 'Reports', path: '/officer/reports',    icon: BarChart3 },
  ];

  const adminNav: NavItem[] = [
    { label: 'Dashboard',   shortLabel: 'Home',    path: '/admin',            icon: BarChart3 },
    { label: 'Centres',     shortLabel: 'Centres', path: '/admin/centres',    icon: Building2 },
    { label: 'Farmers',     shortLabel: 'Farmers', path: '/admin/farmers',    icon: User },
    { label: 'Analytics',   shortLabel: 'Stats',   path: '/admin/analytics',  icon: BarChart3 },
  ];

  const navItems = role === 'FARMER' ? farmerNav : role === 'OFFICER' ? officerNav : adminNav;
  const desktopNavItems = role === 'FARMER' ? farmerDesktopNav : navItems;

  // Bottom nav shows only first 5 most important items on mobile
  const bottomNavItems = navItems.slice(0, 5);

  const roleColor = role === 'FARMER' ? 'emerald' : role === 'OFFICER' ? 'blue' : 'amber';
  const roleBg = { emerald: 'bg-emerald-600', blue: 'bg-blue-600', amber: 'bg-amber-600' }[roleColor];

  return (
    <>
      {/* ════════════════════════════
          TOP HEADER
      ════════════════════════════ */}
      <header className={`bg-white border-b border-slate-200 sticky top-0 z-40 transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        {/* Tricolour ribbon */}
        <div className="bg-gradient-to-r from-orange-500 via-white to-emerald-600 h-0.5" />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-18 lg:h-20">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0" aria-label="KisanMitra Home">
              <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                <Wheat className="w-5 h-5 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
              </div>
              <div className="hidden xs:block">
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
                    Kisan<span className="text-emerald-700">Mitra</span>
                  </span>
                  <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                    {t('govt_badge')}
                  </span>
                </div>
                <p className="hidden md:block text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                  {t('govt_title')}
                </p>
              </div>
            </Link>

            {/* ── Desktop Nav (lg+) ── */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 min-w-0 overflow-x-auto">
              {desktopNavItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1.5 px-2.5 xl:px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full leading-none">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Controls ── */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              {/* Language switcher — tablet+ */}
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>

              {/* Auth buttons — md+ when NOT logged in */}
              {!user && (
                <div className="hidden md:flex items-center space-x-1.5">
                  <Link to="/signin" className="text-xs font-bold text-slate-600 hover:text-emerald-700 px-3 py-2 rounded-xl hover:bg-slate-100 transition whitespace-nowrap">
                    {t('nav_login')}
                  </Link>
                  <Link to="/register" className="text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl transition shadow whitespace-nowrap">
                    {t('nav_register')}
                  </Link>
                </div>
              )}

              {/* User profile chip & logout — always visible when logged in */}
              {user && (
                <div className="flex items-center space-x-1.5 sm:space-x-2 border-l border-slate-200 pl-2 sm:pl-3">
                  <Link 
                    to={role === 'FARMER' ? '/farmer/profile' : '#'} 
                    className="flex items-center space-x-2 hover:opacity-85 transition group"
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${roleBg} text-white flex items-center justify-center font-black text-xs flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      {user.name.charAt(0)}
                    </div>
                    <div className="hidden xl:block text-right">
                      <div className="text-xs font-bold text-slate-900 leading-none group-hover:text-emerald-700 group-hover:underline">{user.name}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold uppercase mt-0.5">{role}</div>
                    </div>
                  </Link>
                  <button
                    onClick={() => { logout(); navigate('/'); }}
                    className="flex items-center space-x-1 text-red-600 hover:bg-red-50 px-2 sm:px-2.5 py-1.5 rounded-xl border border-red-200 text-[10px] font-bold transition"
                    title="Logout"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              )}

              {/* Notification bell — mobile only shortcut */}
              {user && role === 'FARMER' && unreadCount > 0 && (
                <Link to="/farmer/notifications" className="relative md:hidden p-2 rounded-xl hover:bg-slate-100">
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </Link>
              )}

              {/* Hamburger — mobile/tablet */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition touch-target"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile / Tablet Drawer ── */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl">
            {/* Language + auth row */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
              <LanguageSwitcher />
              {!user ? (
                <div className="flex items-center space-x-2">
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-xl">
                    {t('nav_login')}
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}
                    className="text-xs font-bold bg-emerald-700 text-white px-3 py-1.5 rounded-xl shadow">
                    {t('nav_register')}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className={`w-7 h-7 rounded-full ${roleBg} text-white flex items-center justify-center font-black text-xs`}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <button onClick={() => { logout(); navigate('/'); setMobileMenuOpen(false); }}
                    className="text-[11px] text-red-600 font-bold flex items-center space-x-1 bg-red-50 px-2.5 py-1.5 rounded-xl border border-red-200 ml-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Nav items grid */}
            <div className="px-3 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-3 rounded-2xl text-xs font-semibold transition touch-target ${
                      active
                        ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                        : 'text-slate-700 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                    {item.badge && item.badge > 0 ? (
                      <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full">{item.badge}</span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* ════════════════════════════
          BOTTOM NAV BAR (mobile only, logged-in farmers)
      ════════════════════════════ */}
      {user && role === 'FARMER' && (
        <nav className="bottom-nav lg:hidden">
          {bottomNavItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-center transition-colors relative touch-target ${
                  active ? 'text-emerald-700' : 'text-slate-400'
                }`}
              >
                <div className={`relative ${active ? 'after:absolute after:-top-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-emerald-600 after:rounded-full' : ''}`}>
                  <Icon className={`w-5 h-5 mx-auto ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[8px] font-black flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className={`text-[9px] mt-0.5 font-semibold leading-none ${active ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  {item.shortLabel || item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Spacer for bottom nav on mobile */}
      {user && role === 'FARMER' && (
        <div className="lg:hidden h-16" />
      )}
    </>
  );
};

export default Navbar;
