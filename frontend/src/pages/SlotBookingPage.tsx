import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wheat, Calendar, Clock, MapPin, Sparkles, CheckCircle2, ArrowRight,
  ShieldCheck, QrCode, Plus, Trash2, Search, Filter, Layers, DollarSign,
  TrendingUp, HelpCircle, AlertCircle, Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { localState } from '../services/api';
import { RecommendationResult, Booking, Crop, CropCategory } from '../types';
import { CentreRecommendationCard } from '../components/CentreRecommendationCard';
import { QRModal } from '../components/QRModal';
import { AutoLocationDetector } from '../components/AutoLocationDetector';

interface SelectedCropItem {
  cropId: number;
  quantity: number;
}

const formatLocalDate = (dateObj: Date) => {
  const offset = dateObj.getTimezoneOffset();
  const localTime = new Date(dateObj.getTime() - (offset * 60 * 1000));
  return localTime.toISOString().split('T')[0];
};

export const SlotBookingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Booking Flow Steps (1 to 6)
  const [step, setStep] = useState(1);

  // Multi-Crop Selection State
  const [selectedCropItems, setSelectedCropItems] = useState<SelectedCropItem[]>([
    { cropId: 2, quantity: 25.4 } // Default Paddy (Grade A)
  ]);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [cropSearch, setCropSearch] = useState('');

  // Location & Centre Choice
  const [selectedCentreId, setSelectedCentreId] = useState(1);

  // Dynamically calculate open dates starting from today or tomorrow (if past last slot time 3:00 PM)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    const isPastLastSlot = today.getHours() >= 15; // 3:00 PM (15:00) is the last slot hour
    const startDay = isPastLastSlot ? 1 : 0;
    
    for (let i = startDay; i < startDay + 4; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      dates.push(formatLocalDate(d));
    }
    return dates;
  }, []);

  const [bookingDate, setBookingDate] = useState(availableDates[0]);
  const [selectedSlot, setSelectedSlot] = useState({ start: '10:30 AM', end: '11:00 AM' });
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Listen for voice-triggered auto-booking requests
  useEffect(() => {
    (window as any).triggerVoiceAutoBooking = (cropNameInput?: string, weightVal?: number, timePref?: string) => {
      let cropId = 2; // Paddy
      if (cropNameInput) {
        const matchingCrop = localState.crops.find(c => 
          c.name.toLowerCase().includes(cropNameInput.toLowerCase()) || 
          c.variety.toLowerCase().includes(cropNameInput.toLowerCase())
        );
        if (matchingCrop) cropId = matchingCrop.id;
      }
      
      const qty = weightVal || 20.0;
      setSelectedCropItems([{ cropId, quantity: qty }]);
      
      // Auto select nearest centre
      const recs = localState.getCentreRecommendations(
        localState.userLocation || user?.farmer?.district || 'Guntur',
        cropId
      );
      const chosenCentreId = recs && recs.length > 0 ? recs[0].centre.id : 1;
      setSelectedCentreId(chosenCentreId);

      // Tomorrow date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = formatLocalDate(tomorrow);
      setBookingDate(tomorrowStr);

      // Map time slot based on user's morning/afternoon/evening preference
      let slot = { start: '10:30 AM', end: '11:00 AM' };
      if (timePref === 'afternoon') {
        slot = { start: '02:00 PM', end: '02:30 PM' };
      } else if (timePref === 'evening') {
        slot = { start: '02:30 PM', end: '03:00 PM' };
      } else if (timePref === 'morning') {
        slot = { start: '09:30 AM', end: '10:00 AM' };
      }
      setSelectedSlot(slot);

      // Save and finish
      const newBooking = localState.createMultiCropBooking({
        farmerId: user?.id || 1,
        centreId: chosenCentreId,
        items: [{ cropId, quantity: qty }],
        bookingDate: tomorrowStr,
        slotStart: slot.start,
        slotEnd: slot.end
      });

      setCreatedBooking(newBooking);
      setStep(6);
      setShowQR(true);
      return true;
    };

    return () => {
      delete (window as any).triggerVoiceAutoBooking;
    };
  }, [user]);

  // Check if a time slot has already passed based on local time
  const isTimeSlotPassed = (slotStart: string, dateStr: string) => {
    try {
      const today = new Date();
      const currentLocDate = formatLocalDate(today);
      
      if (dateStr > currentLocDate) return false;
      if (dateStr < currentLocDate) return true;
      
      const [time, period] = slotStart.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0, 0);
      
      return slotTime.getTime() <= today.getTime();
    } catch (e) {
      return false;
    }
  };

  // Auto-correct selected time slot if it has passed
  useEffect(() => {
    const passed = isTimeSlotPassed(selectedSlot.start, bookingDate);
    if (passed) {
      const firstAvail = timeSlots.find(s => !isTimeSlotPassed(s.start, bookingDate) && s.status !== 'Full');
      if (firstAvail) {
        setSelectedSlot({ start: firstAvail.start, end: firstAvail.end });
      }
    }
  }, [bookingDate]);

  // Filtered Crop Catalog
  const filteredCrops = localState.crops.filter(crop => {
    const matchesCat = activeCategory === 'ALL' || crop.category === activeCategory;
    const matchesSearch = crop.name.toLowerCase().includes(cropSearch.toLowerCase()) ||
                          crop.variety.toLowerCase().includes(cropSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate recommendation results with live location
  const recommendations: RecommendationResult[] = localState.getCentreRecommendations(
    localState.userLocation || user?.farmer?.district || 'Guntur',
    selectedCropItems[0]?.cropId || 1
  );

  const timeSlots = [
    { start: '09:00 AM', end: '09:30 AM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '09:30 AM', end: '10:00 AM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '10:00 AM', end: '10:30 AM', status: 'Limited', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { start: '10:30 AM', end: '11:00 AM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '11:00 AM', end: '11:30 AM', status: 'Full', color: 'bg-red-100 text-red-800 border-red-300' },
    { start: '11:30 AM', end: '12:00 PM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '02:00 PM', end: '02:30 PM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '02:30 PM', end: '03:00 PM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
  ];

  const selectedCentreObj = localState.centres.find(c => c.id === selectedCentreId);

  // Multi-Crop management helpers
  const handleToggleCrop = (cropId: number) => {
    const existingIndex = selectedCropItems.findIndex(i => i.cropId === cropId);
    if (existingIndex >= 0) {
      if (selectedCropItems.length > 1) {
        setSelectedCropItems(selectedCropItems.filter(i => i.cropId !== cropId));
      }
    } else {
      setSelectedCropItems([...selectedCropItems, { cropId, quantity: 15.0 }]);
    }
  };

  const handleUpdateQuantity = (cropId: number, qty: number) => {
    setSelectedCropItems(selectedCropItems.map(i => i.cropId === cropId ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const handleRemoveCrop = (cropId: number) => {
    if (selectedCropItems.length > 1) {
      setSelectedCropItems(selectedCropItems.filter(i => i.cropId !== cropId));
    }
  };

  // Aggregate Calculations
  const totalQuantity = selectedCropItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValuation = selectedCropItems.reduce((sum, item) => {
    const crop = localState.crops.find(c => c.id === item.cropId);
    return sum + (item.quantity * (crop?.msp_price_per_quintal || 0));
  }, 0);

  const handleConfirmSlot = () => {
    const newBooking = localState.createMultiCropBooking({
      farmerId: user?.id || 1,
      centreId: selectedCentreId,
      items: selectedCropItems,
      bookingDate,
      slotStart: selectedSlot.start,
      slotEnd: selectedSlot.end
    });

    setCreatedBooking(newBooking);
    setShowQR(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 bg-emerald-100 border border-emerald-300 px-3.5 py-1 rounded-full text-emerald-800 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Smart Multi-Crop Slot Allocation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('slot_booking_title')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">{t('govt_title')}</p>
      </div>

      {/* Auto Location / GPS Proximity Bar */}
      <AutoLocationDetector />

      {/* Step Stepper Header */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
        <button onClick={() => setStep(1)} className={`px-3 py-1.5 rounded-xl transition ${step >= 1 ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100'}`}>
          {t('step_crop')} ({selectedCropItems.length})
        </button>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <button onClick={() => setStep(2)} className={`px-3 py-1.5 rounded-xl transition ${step >= 2 ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100'}`}>
          {t('step_quantity')}
        </button>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <button onClick={() => setStep(3)} className={`px-3 py-1.5 rounded-xl transition ${step >= 3 ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100'}`}>
          {t('step_centre')}
        </button>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <button onClick={() => setStep(4)} className={`px-3 py-1.5 rounded-xl transition ${step >= 4 ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100'}`}>
          {t('step_date')}
        </button>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <button onClick={() => setStep(5)} className={`px-3 py-1.5 rounded-xl transition ${step >= 5 ? 'bg-emerald-600 text-white font-bold' : 'hover:bg-slate-100'}`}>
          {t('step_slot')}
        </button>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <button onClick={() => setStep(6)} className={`px-3 py-1.5 rounded-xl transition ${step >= 6 ? 'bg-amber-600 text-white font-bold' : 'hover:bg-slate-100'}`}>
          {t('step_summary')}
        </button>
      </div>

      {/* STEP 1: MULTI-CROP SELECTION */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900">{t('select_crops')}</h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {t('multi_crop_badge')} ({selectedCropItems.length} Selected)
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Select one or more crops for your delivery appointment. Government MSP prices guaranteed.
              </p>
            </div>

            {/* Live Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={cropSearch}
                onChange={(e) => setCropSearch(e.target.value)}
                placeholder={t('search_crop_placeholder')}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: t('all_categories') },
              { id: 'CEREALS', label: t('cereals') },
              { id: 'PULSES', label: t('pulses') },
              { id: 'OILSEEDS', label: t('oilseeds') },
              { id: 'COMMERCIAL', label: t('commercial') },
              { id: 'SPICES', label: t('spices') }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  activeCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Crops Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrops.map(crop => {
              const isSelected = selectedCropItems.some(i => i.cropId === crop.id);
              return (
                <div
                  key={crop.id}
                  onClick={() => handleToggleCrop(crop.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition relative group ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl">{crop.icon || '🌾'}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-snug">{crop.name}</h3>
                        <p className="text-[11px] text-slate-500">{crop.variety}</p>
                      </div>
                    </div>
                    
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                      isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Govt. MSP</span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        ₹{crop.msp_price_per_quintal.toLocaleString('en-IN')}<span className="text-[10px] text-slate-500 font-normal">/Qtl</span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-medium">Max Moisture</span>
                      <span className="text-[11px] font-semibold text-slate-700">{crop.max_moisture || 12}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Crops Summary Bar */}
          <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center space-x-3 text-xs">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </span>
              <div>
                <div className="font-bold text-slate-200">
                  {selectedCropItems.length} Crop(s) Selected in Appointment
                </div>
                <div className="text-[11px] text-slate-400">
                  Proceed to set produce quantities for each crop.
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition shadow"
            >
              <span>{t('step_quantity')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: MULTI-CROP QUANTITIES */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900">Step 2: Enter Produce Quantities</h2>
            <p className="text-xs text-slate-500 mt-1">Specify estimated delivery load (in Quintals) for each selected crop.</p>
          </div>

          <div className="space-y-4">
            {selectedCropItems.map((item, idx) => {
              const crop = localState.crops.find(c => c.id === item.cropId);
              const msp = crop?.msp_price_per_quintal || 2300;
              const subtotal = item.quantity * msp;

              return (
                <div key={item.cropId} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <span className="text-3xl">{crop?.icon || '🌾'}</span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900 text-sm">{crop?.name}</h4>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                          {crop?.variety}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        MSP: ₹{msp.toLocaleString('en-IN')} per Quintal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Quantity (Quintals)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.cropId, parseFloat(e.target.value) || 0)}
                        className="w-28 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-900 text-right focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="text-right min-w-[120px]">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Est. Payout</span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {selectedCropItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCrop(item.cropId)}
                        className="text-slate-400 hover:text-red-600 p-2 transition"
                        title={t('remove_crop')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grand Totals */}
          <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-6 text-center sm:text-left">
              <div>
                <span className="text-xs text-emerald-200 block">{t('total_quantity')}</span>
                <span className="text-2xl font-black text-white">{totalQuantity.toFixed(1)} <span className="text-sm font-normal">Quintals</span></span>
              </div>
              <div className="border-l border-emerald-700 pl-6">
                <span className="text-xs text-emerald-200 block">{t('total_est_payout')}</span>
                <span className="text-2xl font-black text-amber-300">₹{totalValuation.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-emerald-100"
              >
                + Add / Change Crops
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-2 rounded-xl text-xs shadow flex items-center space-x-1"
              >
                <span>{t('step_centre')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* STEP 3: PROCUREMENT CENTRE SELECTION */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 3: Select Nearest Procurement Centre</h2>
              <p className="text-xs text-slate-500 mt-1">Centres automatically ranked by GPS distance and live waiting queue length.</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold self-start">
              {recommendations.length} Centres Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(rec => (
              <div
                key={rec.centre.id}
                onClick={() => setSelectedCentreId(rec.centre.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition relative ${
                  selectedCentreId === rec.centre.id
                    ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{rec.centre.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{rec.centre.address}</p>
                  </div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                    ★ {rec.score} Pts
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Distance</span>
                    <span className="font-bold text-slate-800">{rec.distanceKm} km</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Live Queue</span>
                    <span className="font-bold text-amber-700">{rec.centre.current_queue || 12} ahead</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Est. Wait</span>
                    <span className="font-bold text-emerald-700">{rec.estimatedWaitMins} mins</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {rec.reasons.map((r, i) => (
                    <span key={i} className="text-[10px] font-medium bg-white text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              ← Back to Quantities
            </button>

            <button
              type="button"
              onClick={() => setStep(4)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-2"
            >
              <span>{t('step_date')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: DATE SELECTION */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900">Step 4: Select Appointment Date</h2>
            <p className="text-xs text-slate-500 mt-1">Choose a convenient date within the open procurement window.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {availableDates.map((d: string, idx: number) => (
              <button
                key={d}
                type="button"
                onClick={() => setBookingDate(d)}
                className={`p-4 rounded-2xl border-2 text-center transition ${
                  bookingDate === d
                    ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-xs text-slate-500 block">{idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : 'Upcoming'}</span>
                <span className="text-lg font-black text-slate-900 block my-1">{d}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                  Slots Open
                </span>
              </button>
            ))}
          </div>

          {/* Weather Advisory for Delivery Date */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
            <span className="text-xl">☀️</span>
            <div className="space-y-0.5">
              <span className="font-bold block">Delivery Weather Advisory for {bookingDate}:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Clear sunny conditions expected (Temp: 34°C, Rain Chance: 5%, Drying Index: Excellent). Ideal for moisture testing compliance.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              ← Back to Centres
            </button>

            <button
              type="button"
              onClick={() => setStep(5)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-2"
            >
              <span>{t('step_slot')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: TIME SLOT */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900">Step 5: Select Time Window</h2>
            <p className="text-xs text-slate-500 mt-1">Arrival window helps prevent yard traffic and ensures prompt counter weighing.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {timeSlots.map((slot, idx) => {
              const isSelected = selectedSlot.start === slot.start;
              const hasPassed = isTimeSlotPassed(slot.start, bookingDate);
              const isFull = slot.status === 'Full' || hasPassed;
              const statusText = hasPassed ? 'Passed' : slot.status;
              const badgeColor = hasPassed 
                ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse' 
                : slot.color;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isFull}
                  onClick={() => setSelectedSlot({ start: slot.start, end: slot.end })}
                  className={`p-4 rounded-2xl border-2 text-center transition ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                      : isFull
                      ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="font-black text-sm text-slate-900 block">{slot.start} – {slot.end}</span>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border mt-2 ${badgeColor}`}>
                    {statusText}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              ← Back to Date
            </button>

            <button
              type="button"
              onClick={() => setStep(6)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-2"
            >
              <span>{t('step_summary')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: SUMMARY & CONFIRMATION */}
      {step === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-fadeIn">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 6: Review & Confirm Slot</h2>
              <p className="text-xs text-slate-500 mt-1">Instant digital token number and verifiable QR pass will be issued upon confirmation.</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full border border-amber-300">
              Token Pending
            </span>
          </div>

          {/* Breakdown Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Farmer Profile</span>
                <span className="font-bold text-slate-800 text-sm">{user?.name || 'Ravi Kumar'} ({user?.farmer?.farmer_id || 'AP-FARM-9872'})</span>
                <p className="text-slate-500 text-[11px]">{user?.farmer?.village}, {user?.farmer?.district}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Procurement Yard</span>
                <span className="font-bold text-slate-800 text-sm">{selectedCentreObj?.name}</span>
                <p className="text-slate-500 text-[11px]">{selectedCentreObj?.address}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Scheduled Date & Time</span>
                <span className="font-bold text-emerald-700 text-sm">{bookingDate} ({selectedSlot.start} – {selectedSlot.end})</span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Total Produce Volume</span>
                <span className="font-bold text-slate-800 text-sm">{totalQuantity.toFixed(1)} Quintals ({selectedCropItems.length} Crops)</span>
              </div>
            </div>

            {/* Multi-Crop Breakdown Table */}
            <div className="border-t border-slate-200 pt-3">
              <span className="text-[11px] uppercase font-bold text-slate-500 block mb-2">Produce Breakdown</span>
              <div className="space-y-2">
                {selectedCropItems.map(item => {
                  const crop = localState.crops.find(c => c.id === item.cropId);
                  const msp = crop?.msp_price_per_quintal || 2300;
                  const subtotal = item.quantity * msp;
                  return (
                    <div key={item.cropId} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center space-x-2">
                        <span>{crop?.icon || '🌾'}</span>
                        <span className="font-bold text-slate-800">{crop?.name} ({crop?.variety})</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-slate-600 font-semibold">{item.quantity} Qtl @ ₹{msp}/Qtl</span>
                        <span className="font-bold text-emerald-700">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
              <span className="font-bold text-slate-800 text-sm">Estimated Total MSP Value</span>
              <span className="text-xl font-black text-emerald-700">₹{totalValuation.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Gate Arrival Document Reminder */}
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 flex items-start space-x-3">
            <span className="text-xl">📋</span>
            <div className="space-y-1">
              <span className="font-bold block">Mandatory Gate Entry Checklist:</span>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Remember to bring: 1. Aadhaar Card, 2. Land Record (Pattadar/RoR 1B), 3. Aadhaar-linked Bank Passbook, 4. Standard clean 50kg gunny bags or tractor trolley.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(5)}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              ← Back to Slots
            </button>

            <button
              type="button"
              onClick={handleConfirmSlot}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-3.5 rounded-2xl text-sm shadow-xl shadow-emerald-950 flex items-center space-x-2 transition transform active:scale-95"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm & Generate Digital Token</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Code Pass Pop-up Modal */}
      {showQR && createdBooking && (
        <QRModal
          booking={createdBooking}
          onClose={() => {
            setShowQR(false);
            navigate('/farmer/digital-token');
          }}
        />
      )}

    </div>
  );
};
