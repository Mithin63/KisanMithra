import React from 'react';
import { Wheat, PhoneCall, ShieldCheck, Mail, Globe, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Platform Branding */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Wheat className="w-5 h-5" />
              </div>
              <span>SmartProcure</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              An intelligent digital procurement management platform by the Ministry of Consumer Affairs, Food & Public Distribution to automate queue allocations, eliminate delays, and empower Indian farmers.
            </p>
            <p className="text-emerald-400 font-semibold text-xs italic">
              "Smart Queues. Faster Procurement. Better Farming."
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Quick Services</h4>
            <ul className="space-y-2">
              <li><Link to="/farmer/book-slot" className="hover:text-emerald-400 transition">Digital Slot Booking</Link></li>
              <li><Link to="/farmer/my-queue" className="hover:text-emerald-400 transition">Live Queue Tracker</Link></li>
              <li><Link to="/farmer/procurement" className="hover:text-emerald-400 transition">Procurement Progress Status</Link></li>
              <li><Link to="/farmer/payments" className="hover:text-emerald-400 transition">Direct Payment Tracker (DBT)</Link></li>
              <li><Link to="/officer" className="hover:text-emerald-400 transition">Procurement Officer Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Govt Portals */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Government Portals</h4>
            <ul className="space-y-2">
              <li><a href="https://consumerfinance.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Department of Food & Public Distribution</a></li>
              <li><a href="https://pmkisan.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">PM-KISAN Samman Nidhi</a></li>
              <li><a href="https://enam.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">National Agriculture Market (eNAM)</a></li>
              <li><a href="https://agricoop.nic.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition">Ministry of Agriculture & Farmers Welfare</a></li>
            </ul>
          </div>

          {/* Col 4: Farmer Helpline & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Farmer Support Helpline</h4>
            <div className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                <PhoneCall className="w-4 h-4" />
                <span>1800-180-1551 (Toll-Free)</span>
              </div>
              <p className="text-[11px] text-slate-400">
                National Kisan Call Centre (24x7 Support in 22 Official Languages)
              </p>
            </div>
            <div className="flex items-center space-x-2 text-slate-400 text-xs">
              <Mail className="w-4 h-4 text-emerald-500" />
              <span>support-smartprocure@gov.in</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] space-y-3 sm:space-y-0">
          <p>© 2026 SmartProcure. Designed & Developed for Ministry of Consumer Affairs, Food & Public Distribution, Govt. of India.</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Accessibility Statement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
