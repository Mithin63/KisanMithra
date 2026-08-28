import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wheat, Calendar, Clock, MapPin, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localState } from '../services/api';
import { RecommendationResult, Booking } from '../types';
import { CentreRecommendationCard } from '../components/CentreRecommendationCard';
import { QRModal } from '../components/QRModal';

export const SlotBookingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Booking Flow Steps (1 to 6)
  const [step, setStep] = useState(1);

  // Form State
  const [selectedCropId, setSelectedCropId] = useState(1);
  const [quantity, setQuantity] = useState('25.4');
  const [selectedCentreId, setSelectedCentreId] = useState(1);
  const [bookingDate, setBookingDate] = useState('2026-08-28');
  const [selectedSlot, setSelectedSlot] = useState({ start: '10:30 AM', end: '11:00 AM' });
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [showQR, setShowQR] = useState(false);

  const farmerDistrict = user?.farmer?.district || 'Guntur';
  const recommendations: RecommendationResult[] = localState.getCentreRecommendations(farmerDistrict, selectedCropId);

  const timeSlots = [
    { start: '09:00 AM', end: '09:30 AM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '09:30 AM', end: '10:00 AM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '10:00 AM', end: '10:30 AM', status: 'Limited', color: 'bg-amber-100 text-amber-800 border-amber-300' },
    { start: '10:30 AM', end: '11:00 AM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    { start: '11:00 AM', end: '11:30 AM', status: 'Full', color: 'bg-red-100 text-red-800 border-red-300' },
    { start: '11:30 AM', end: '12:00 PM', status: 'Available', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
  ];

  const selectedCropObj = localState.crops.find(c => c.id === selectedCropId);
  const selectedCentreObj = localState.centres.find(c => c.id === selectedCentreId);

  const handleConfirmSlot = () => {
    const newBooking = localState.createBooking({
      farmerId: user?.id || 1,
      centreId: selectedCentreId,
      cropId: selectedCropId,
      quantity: parseFloat(quantity) || 25,
      bookingDate,
      slotStart: selectedSlot.start,
      slotEnd: selectedSlot.end
    });

    setCreatedBooking(newBooking);
    setShowQR(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Page Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Smart Slot Allocation Engine
        </span>
        <h1 className="text-3xl font-black text-slate-900">Book Procurement Appointment Slot</h1>
        <p className="text-xs text-slate-500">Ministry of Consumer Affairs, Food & Public Distribution</p>
      </div>

      {/* Step Stepper Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-600">
        <div className={`px-3 py-1.5 rounded-xl ${step >= 1 ? 'bg-emerald-600 text-white font-bold' : ''}`}>1. Crop</div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <div className={`px-3 py-1.5 rounded-xl ${step >= 2 ? 'bg-emerald-600 text-white font-bold' : ''}`}>2. Quantity</div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <div className={`px-3 py-1.5 rounded-xl ${step >= 3 ? 'bg-emerald-600 text-white font-bold' : ''}`}>3. Centre</div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <div className={`px-3 py-1.5 rounded-xl ${step >= 4 ? 'bg-emerald-600 text-white font-bold' : ''}`}>4. Date</div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <div className={`px-3 py-1.5 rounded-xl ${step >= 5 ? 'bg-emerald-600 text-white font-bold' : ''}`}>5. Time Slot</div>
        <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
        <div className={`px-3 py-1.5 rounded-xl ${step >= 6 ? 'bg-amber-600 text-white font-bold' : ''}`}>6. Summary</div>
      </div>

      {/* STEP 1: Select Crop */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Wheat className="w-5 h-5 text-emerald-600" />
            <span>Step 1: Select Crop for Procurement</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {localState.crops.map(crop => (
              <div
                key={crop.id}
                onClick={() => setSelectedCropId(crop.id)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between ${
                  selectedCropId === crop.id
                    ? 'bg-emerald-50 border-emerald-600 shadow-md ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{crop.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{crop.variety}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-medium">MSP Rate:</span>
                  <span className="font-extrabold text-emerald-700">₹{crop.msp_price_per_quintal} / Q</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl text-xs shadow flex items-center space-x-2"
            >
              <span>Continue to Quantity</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Enter Quantity */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 2: Expected Produce Quantity</h2>
          <div className="max-w-md space-y-3">
            <label className="block text-xs font-bold text-slate-700">Expected Quantity (in Quintals) *</label>
            <input
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              className="w-full px-4 py-3 text-lg font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-500">
              Selected Crop: <strong>{selectedCropObj?.name}</strong> • Estimated Value: ₹{((parseFloat(quantity) || 0) * (selectedCropObj?.msp_price_per_quintal || 0)).toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(1)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold">Back</button>
            <button onClick={() => setStep(3)} className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs shadow">Select Centre</button>
          </div>
        </div>
      )}

      {/* STEP 3: AI Smart Centre Recommendation */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-lg space-y-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h2 className="text-lg font-bold">AI Smart Centre Recommendation Engine</h2>
            </div>
            <p className="text-xs text-emerald-200">
              Calculates optimal center scores based on distance, active queue, counter processing rates, and today's capacity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => (
              <CentreRecommendationCard
                key={rec.centre.id}
                recommendation={rec}
                isBest={idx === 0}
                onSelect={(cid) => {
                  setSelectedCentreId(cid);
                  setStep(4);
                }}
              />
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(2)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold">Back</button>
          </div>
        </div>
      )}

      {/* STEP 4: Select Date */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 4: Select Booking Date</h2>
          <div className="max-w-xs space-y-2">
            <label className="block text-xs font-bold text-slate-700">Date *</label>
            <input
              type="date"
              value={bookingDate}
              onChange={e => setBookingDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold text-sm"
            />
          </div>
          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(3)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold">Back</button>
            <button onClick={() => setStep(5)} className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs shadow">Select Time Slot</button>
          </div>
        </div>
      )}

      {/* STEP 5: Select Time Slot */}
      {step === 5 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Step 5: Select Appointment Time Slot</h2>
          <p className="text-xs text-slate-500">Available counters at {selectedCentreObj?.name}:</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {timeSlots.map((slot, idx) => (
              <button
                key={idx}
                disabled={slot.status === 'Full'}
                onClick={() => setSelectedSlot({ start: slot.start, end: slot.end })}
                className={`p-4 rounded-2xl border-2 text-left transition ${
                  selectedSlot.start === slot.start
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                    : slot.status === 'Full'
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                }`}
              >
                <div className="font-bold text-sm">{slot.start} – {slot.end}</div>
                <span className={`text-[10px] font-semibold inline-block mt-2 px-2 py-0.5 rounded-full ${slot.color}`}>
                  {slot.status === 'Available' ? '🟢 Available' : slot.status === 'Limited' ? '🟡 Limited' : '🔴 Full'}
                </span>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button onClick={() => setStep(4)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold">Back</button>
            <button onClick={() => setStep(6)} className="bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs shadow">Review Summary</button>
          </div>
        </div>
      )}

      {/* STEP 6: Booking Summary & Confirm */}
      {step === 6 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              Final Appointment Review
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">Booking Summary</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Farmer Name</span>
              <p className="font-bold text-slate-900 text-base">{user?.name || 'Ravi Kumar'}</p>
              <p className="text-slate-500">ID: {user?.farmer?.farmer_id || 'AP-FARM-9872'}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Crop & Quantity</span>
              <p className="font-bold text-slate-900 text-base">{selectedCropObj?.name} ({quantity} Quintals)</p>
              <p className="text-emerald-700 font-bold">Est. Value: ₹{((parseFloat(quantity) || 0) * (selectedCropObj?.msp_price_per_quintal || 0)).toLocaleString('en-IN')}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Procurement Centre</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedCentreObj?.name}</p>
              <p className="text-slate-500">{selectedCentreObj?.address}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] block">Appointment Time</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{bookingDate}</p>
              <p className="text-emerald-800 font-bold text-xs">{selectedSlot.start} – {selectedSlot.end}</p>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <button onClick={() => setStep(5)} className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold">Back</button>

            <button
              onClick={handleConfirmSlot}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-4 rounded-2xl text-sm shadow-xl transition transform hover:scale-105 flex items-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5 text-amber-300" />
              <span>Confirm Slot & Generate Token</span>
            </button>
          </div>
        </div>
      )}

      {/* QR Confirmation Modal */}
      {showQR && createdBooking && (
        <QRModal
          booking={createdBooking}
          onClose={() => {
            setShowQR(false);
            navigate('/farmer/my-queue');
          }}
        />
      )}

    </div>
  );
};
