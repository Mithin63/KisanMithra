import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, Bell, CheckSquare, CreditCard, ShieldCheck,
  TrendingUp, Users, MapPin, ArrowRight, Zap, Award, Sparkles, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (mobile: string, path: string) => {
    login(mobile);
    navigate(path);
  };

  const featureCards = [
    {
      title: 'Digital Slot Booking',
      desc: 'Book a convenient procurement slot without standing in long physical queues.',
      icon: Calendar,
      color: 'bg-emerald-500'
    },
    {
      title: 'Live Queue Tracking',
      desc: 'Know your token position and AI estimated waiting time in real time.',
      icon: Clock,
      color: 'bg-amber-500'
    },
    {
      title: 'Smart Notifications',
      desc: 'Receive appointment, queue, and payment updates through SMS & app notifications.',
      icon: Bell,
      color: 'bg-blue-500'
    },
    {
      title: 'Procurement Tracking',
      desc: 'Track your produce through an 8-stage visual pipeline from arrival to completion.',
      icon: CheckSquare,
      color: 'bg-purple-500'
    },
    {
      title: 'Payment Transparency',
      desc: 'Know exactly when your procurement payment is credited directly via Direct Benefit Transfer (DBT).',
      icon: CreditCard,
      color: 'bg-indigo-500'
    },
    {
      title: 'Smart Centre Management',
      desc: 'Help procurement centres automatically balance capacity and prevent overcrowding.',
      icon: ShieldCheck,
      color: 'bg-rose-500'
    }
  ];

  const workflowSteps = [
    { num: '01', title: 'Register', desc: 'Register with mobile & land details' },
    { num: '02', title: 'Book Slot', desc: 'Select crop, quantity & centre' },
    { num: '03', title: 'Get Token', desc: 'Receive instant digital token & QR' },
    { num: '04', title: 'Track Queue', desc: 'Monitor live queue position & wait time' },
    { num: '05', title: 'Deliver Produce', desc: 'Arrive at scheduled slot for quality check' },
    { num: '06', title: 'Receive Payment', desc: 'Get direct bank credit notification' }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-green-950 to-slate-900 text-white pt-16 pb-24 rounded-b-3xl shadow-xl">
        {/* Subtle background glow elements */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Government Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-emerald-500/40 px-4 py-1.5 rounded-full text-emerald-300 text-xs font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
          </div>

          {/* Title & Tagline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-sans leading-tight">
              Smart<span className="text-emerald-400">Procure</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-amber-300 italic tracking-wide">
              "Smart Queues. Faster Procurement. Better Farming."
            </p>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-3xl mx-auto pt-2">
              An intelligent procurement management platform that reduces waiting time, prevents overcrowding, and gives farmers real-time visibility into procurement and payments.
            </p>
          </div>

          {/* Action Login Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => handleDemoLogin('9876543210', '/farmer')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 text-sm"
            >
              <Wheat className="w-5 h-5" />
              <span>Farmer Login</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>

            <button
              onClick={() => handleDemoLogin('9876543211', '/officer')}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold px-8 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 text-sm"
            >
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Centre Officer Login</span>
            </button>

            <button
              onClick={() => handleDemoLogin('9876543212', '/admin')}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center justify-center space-x-3 text-sm"
            >
              <TrendingUp className="w-5 h-5" />
              <span>Admin Dashboard</span>
            </button>
          </div>

          {/* Quick Demo Credentials pill */}
          <div className="pt-6 inline-block">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl px-5 py-3 text-xs text-slate-300 flex flex-wrap items-center justify-center gap-4">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">Demo Quick Access:</span>
              <span>👨‍🌾 Farmer: <strong className="text-white">9876543210</strong></span>
              <span>👮 Officer: <strong className="text-white">9876543211</strong></span>
              <span>🏛️ Admin: <strong className="text-white">9876543212</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Impact Ticker Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-emerald-700">12,845+</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Registered Farmers</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700">32 min</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Avg Waiting Time (Down 65%)</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700">932 T</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Daily Procurement Volume</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-700">100%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">DBT Payment Transparency</div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Key Platform Features</h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto">
            Designed to bring digital convenience, transparency, and order to government grain procurement yards across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-200 transition space-y-4 group"
              >
                <div className={`w-12 h-12 rounded-xl ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">How SmartProcure Works</h2>
            <p className="text-slate-600 text-sm">Seamless 6-step workflow for hassle-free crop procurement</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowSteps.map((step, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative text-center space-y-2">
                <span className="text-2xl font-black text-emerald-700 font-mono block">{step.num}</span>
                <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-green-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to Experience Zero-Wait Procurement?</h3>
            <p className="text-emerald-200 text-sm max-w-xl">
              Log in now using your mobile number or test demo credentials to see live queue tracking and automated token management.
            </p>
          </div>
          <button
            onClick={() => handleDemoLogin('9876543210', '/farmer')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-2xl transition shadow-lg text-sm flex-shrink-0"
          >
            Launch Farmer Demo
          </button>
        </div>
      </section>

    </div>
  );
};
