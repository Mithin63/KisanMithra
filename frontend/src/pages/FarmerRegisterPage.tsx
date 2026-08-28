import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Wheat, MapPin, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { localState } from '../services/api';

export const FarmerRegisterPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    farmerId: '',
    address: '',
    district: 'Guntur',
    village: '',
    crop: 'Paddy',
    variety: 'Sona Masoori Grade A',
    expectedQuantity: '25',
    preferredCentreId: 1
  });

  const districts = ['Guntur', 'NTR District', 'Bapatla', 'Palnadu', 'Prakasam'];
  const centresInDistrict = localState.centres.filter(
    c => c.district.toLowerCase() === formData.district.toLowerCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete Registration
      login(formData.mobile || '9876543210');
      navigate('/farmer/book-slot');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
          Farmer Registration Portal
        </span>
        <h1 className="text-3xl font-black text-slate-900">Create Farmer Account</h1>
        <p className="text-xs text-slate-500">
          Ministry of Consumer Affairs, Food & Public Distribution
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between max-w-md mx-auto">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                step === i
                  ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100'
                  : step > i
                  ? 'bg-emerald-100 text-emerald-800 font-bold'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
            </div>
            <span className="text-xs font-semibold text-slate-600 hidden sm:inline">
              {i === 1 ? 'Personal' : i === 2 ? 'Produce' : 'Centre'}
            </span>
          </div>
        ))}
      </div>

      {/* Form Box */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Personal Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Step 1: Farmer Identity Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ravi Kumar"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.mobile}
                    onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
                  <select
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Village / Mandal *</label>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={e => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Pedakakani"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Residential Address *</label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Door number, street name, pincode"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>
          )}

          {/* STEP 2: Produce Info */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Step 2: Crop & Produce Info</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Type *</label>
                  <select
                    value={formData.crop}
                    onChange={e => setFormData({ ...formData, crop: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="Paddy">Paddy (Rice)</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Maize">Maize</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Groundnut">Groundnut</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Variety / Grade *</label>
                  <input
                    type="text"
                    required
                    value={formData.variety}
                    onChange={e => setFormData({ ...formData, variety: e.target.value })}
                    placeholder="e.g. Sona Masoori Grade A"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Expected Quantity (in Quintals) *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.expectedQuantity}
                  onChange={e => setFormData({ ...formData, expectedQuantity: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">1 Quintal = 100 kg. Government MSP applicable.</p>
              </div>
            </div>
          )}

          {/* STEP 3: Procurement Centre Choice */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">Step 3: Preferred Procurement Centre</h2>
              <p className="text-xs text-slate-600">Available centres in {formData.district} district:</p>

              <div className="space-y-3">
                {centresInDistrict.length > 0 ? (
                  centresInDistrict.map(c => (
                    <label
                      key={c.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition ${
                        formData.preferredCentreId === c.id
                          ? 'bg-emerald-50 border-emerald-600 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="preferredCentre"
                          checked={formData.preferredCentreId === c.id}
                          onChange={() => setFormData({ ...formData, preferredCentreId: c.id })}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                          <p className="text-xs text-slate-500">{c.address}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                        Capacity: {c.daily_capacity}/day
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-xs text-amber-600">No centres found in selected district. Choose Guntur or NTR District.</p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 flex items-center space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : <div></div>}

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow flex items-center space-x-2"
            >
              <span>{step === 3 ? 'Complete Registration' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
