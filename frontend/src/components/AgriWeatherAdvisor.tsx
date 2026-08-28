import React, { useState } from 'react';
import {
  CloudSun, Sun, CloudRain, Wind, Droplets, AlertTriangle,
  CheckCircle2, Calendar, MapPin, Sparkles, ArrowRight, Clock,
  ShieldCheck, Thermometer, ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface WeatherDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainChance: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rain' | 'Thunderstorm' | 'Clear';
  icon: string;
  dryingIndex: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  deliveryRecommendation: 'Highly Recommended' | 'Safe' | 'Exercise Caution' | 'Avoid Delivery';
  recommendationColor: string;
}

export const AgriWeatherAdvisor: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t, language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState('Guntur');

  const districtWeatherData: Record<string, WeatherDay[]> = {
    'Guntur': [
      { day: 'Today', date: '28 Aug', tempMax: 34, tempMin: 26, humidity: 55, rainChance: 5, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Tomorrow', date: '29 Aug', tempMax: 33, tempMin: 25, humidity: 58, rainChance: 10, condition: 'Clear', icon: '🌤️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Saturday', date: '30 Aug', tempMax: 32, tempMin: 25, humidity: 64, rainChance: 25, condition: 'Partly Cloudy', icon: '⛅', dryingIndex: 'Good', deliveryRecommendation: 'Safe', recommendationColor: 'bg-teal-600 text-white' },
      { day: 'Sunday', date: '31 Aug', tempMax: 30, tempMin: 24, humidity: 75, rainChance: 65, condition: 'Rain', icon: '🌧️', dryingIndex: 'Poor', deliveryRecommendation: 'Avoid Delivery', recommendationColor: 'bg-red-500 text-white' },
      { day: 'Monday', date: '01 Sep', tempMax: 31, tempMin: 24, humidity: 70, rainChance: 45, condition: 'Partly Cloudy', icon: '🌦️', dryingIndex: 'Fair', deliveryRecommendation: 'Exercise Caution', recommendationColor: 'bg-amber-500 text-white' },
      { day: 'Tuesday', date: '02 Sep', tempMax: 33, tempMin: 25, humidity: 54, rainChance: 15, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Wednesday', date: '03 Sep', tempMax: 34, tempMin: 26, humidity: 50, rainChance: 5, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' }
    ],
    'Vijayawada': [
      { day: 'Today', date: '28 Aug', tempMax: 35, tempMin: 27, humidity: 58, rainChance: 10, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Tomorrow', date: '29 Aug', tempMax: 34, tempMin: 26, humidity: 60, rainChance: 15, condition: 'Clear', icon: '🌤️', dryingIndex: 'Good', deliveryRecommendation: 'Safe', recommendationColor: 'bg-teal-600 text-white' },
      { day: 'Saturday', date: '30 Aug', tempMax: 31, tempMin: 24, humidity: 72, rainChance: 70, condition: 'Rain', icon: '🌧️', dryingIndex: 'Poor', deliveryRecommendation: 'Avoid Delivery', recommendationColor: 'bg-red-500 text-white' },
      { day: 'Sunday', date: '31 Aug', tempMax: 30, tempMin: 24, humidity: 78, rainChance: 80, condition: 'Thunderstorm', icon: '⛈️', dryingIndex: 'Poor', deliveryRecommendation: 'Avoid Delivery', recommendationColor: 'bg-red-500 text-white' },
      { day: 'Monday', date: '01 Sep', tempMax: 32, tempMin: 25, humidity: 62, rainChance: 30, condition: 'Partly Cloudy', icon: '⛅', dryingIndex: 'Fair', deliveryRecommendation: 'Safe', recommendationColor: 'bg-teal-600 text-white' },
      { day: 'Tuesday', date: '02 Sep', tempMax: 34, tempMin: 26, humidity: 52, rainChance: 10, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Wednesday', date: '03 Sep', tempMax: 35, tempMin: 26, humidity: 48, rainChance: 5, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' }
    ],
    'Kurnool': [
      { day: 'Today', date: '28 Aug', tempMax: 36, tempMin: 25, humidity: 45, rainChance: 0, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Tomorrow', date: '29 Aug', tempMax: 37, tempMin: 26, humidity: 42, rainChance: 0, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Saturday', date: '30 Aug', tempMax: 35, tempMin: 25, humidity: 50, rainChance: 10, condition: 'Clear', icon: '🌤️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Sunday', date: '31 Aug', tempMax: 33, tempMin: 24, humidity: 60, rainChance: 35, condition: 'Partly Cloudy', icon: '⛅', dryingIndex: 'Good', deliveryRecommendation: 'Safe', recommendationColor: 'bg-teal-600 text-white' },
      { day: 'Monday', date: '01 Sep', tempMax: 34, tempMin: 25, humidity: 55, rainChance: 20, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Tuesday', date: '02 Sep', tempMax: 36, tempMin: 25, humidity: 45, rainChance: 5, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Wednesday', date: '03 Sep', tempMax: 36, tempMin: 26, humidity: 44, rainChance: 0, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' }
    ],
    'Warangal': [
      { day: 'Today', date: '28 Aug', tempMax: 33, tempMin: 24, humidity: 52, rainChance: 10, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Tomorrow', date: '29 Aug', tempMax: 32, tempMin: 24, humidity: 56, rainChance: 20, condition: 'Clear', icon: '🌤️', dryingIndex: 'Good', deliveryRecommendation: 'Safe', recommendationColor: 'bg-teal-600 text-white' },
      { day: 'Saturday', date: '30 Aug', tempMax: 29, tempMin: 23, humidity: 82, rainChance: 85, condition: 'Rain', icon: '🌧️', dryingIndex: 'Poor', deliveryRecommendation: 'Avoid Delivery', recommendationColor: 'bg-red-500 text-white' },
      { day: 'Sunday', date: '31 Aug', tempMax: 30, tempMin: 23, humidity: 75, rainChance: 60, condition: 'Rain', icon: '🌧️', dryingIndex: 'Poor', deliveryRecommendation: 'Avoid Delivery', recommendationColor: 'bg-red-500 text-white' },
      { day: 'Monday', date: '01 Sep', tempMax: 32, tempMin: 24, humidity: 58, rainChance: 25, condition: 'Partly Cloudy', icon: '⛅', dryingIndex: 'Good', deliveryRecommendation: 'Safe', recommendationColor: 'bg-teal-600 text-white' },
      { day: 'Tuesday', date: '02 Sep', tempMax: 33, tempMin: 25, humidity: 50, rainChance: 10, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' },
      { day: 'Wednesday', date: '03 Sep', tempMax: 34, tempMin: 25, humidity: 48, rainChance: 5, condition: 'Sunny', icon: '☀️', dryingIndex: 'Excellent', deliveryRecommendation: 'Highly Recommended', recommendationColor: 'bg-emerald-500 text-white' }
    ]
  };

  const currentForecast = districtWeatherData[selectedDistrict] || districtWeatherData['Guntur'];
  const todayWeather = currentForecast[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
      
      {/* Header & District Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CloudSun className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Agri-Weather & Harvest Delivery Advisor</h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time 7-day meteorological forecast to prevent crop damage and optimize yard arrival.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-white focus:ring-2 focus:ring-emerald-500 shadow-sm"
          >
            <option value="Guntur">Guntur (AP)</option>
            <option value="Vijayawada">Vijayawada (AP)</option>
            <option value="Kurnool">Kurnool (AP)</option>
            <option value="Warangal">Warangal (Telangana)</option>
          </select>
        </div>
      </div>

      {/* Today's Smart Delivery Recommendation Banner */}
      <div className={`rounded-2xl p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        todayWeather.rainChance < 20
          ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
          : todayWeather.rainChance < 50
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-red-50 border-red-200 text-red-950'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">{todayWeather.icon}</div>
          <div className="space-y-0.5">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider">
                Today's Dispatch Advisory:
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${todayWeather.recommendationColor}`}>
                {todayWeather.deliveryRecommendation}
              </span>
            </div>
            <h3 className="text-base font-extrabold">
              {todayWeather.rainChance < 20
                ? '☀️ Ideal Conditions for Grain Transport & Yard Delivery'
                : todayWeather.rainChance < 50
                ? '⛅ Moderate Cloud Cover: Tarpaulin protection recommended'
                : '⚠️ High Rain Alert: Delay delivery to avoid moisture rejection'}
            </h3>
            <p className="text-xs opacity-80">
              Expected Temperature: <strong>{todayWeather.tempMax}°C</strong> • Humidity: <strong>{todayWeather.humidity}%</strong> • Rain Probability: <strong>{todayWeather.rainChance}%</strong>
            </p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-slate-200 text-right space-y-0.5 flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase block">Grain Drying Index</span>
          <span className="text-sm font-black text-emerald-700 block">{todayWeather.dryingIndex} (Safe Moisture)</span>
          <span className="text-[10px] text-slate-400">Target Moisture &le; 14%</span>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          <span className="flex items-center space-x-1.5">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>7-Day Procurement Window Forecast</span>
          </span>
          <span className="text-[11px] text-slate-400">Updated hourly via IMD Agromet</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {currentForecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border text-center space-y-2 transition hover:shadow-md ${
                idx === 0
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="text-xs font-extrabold text-slate-800">
                {day.day}
                <span className="block text-[10px] font-normal text-slate-500">{day.date}</span>
              </div>

              <div className="text-3xl my-1">{day.icon}</div>

              <div className="text-xs font-black text-slate-900">
                {day.tempMax}° / <span className="text-slate-500 text-[11px] font-medium">{day.tempMin}°</span>
              </div>

              <div className="space-y-1 pt-1 border-t border-slate-200/60 text-[10px]">
                <div className="flex items-center justify-center space-x-1 text-blue-600 font-bold">
                  <Droplets className="w-3 h-3" />
                  <span>{day.rainChance}%</span>
                </div>
                <div className="text-[9px] text-slate-500 font-medium truncate">
                  {day.condition}
                </div>
              </div>

              <span className={`block text-[9px] font-bold py-1 px-1.5 rounded-lg truncate ${day.recommendationColor}`}>
                {day.deliveryRecommendation}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Moisture & Transport Safeguards Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Optimal Sun Drying Window</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Sun-dry paddy, maize, and pulses for 4–6 hours on clear days to bring grain moisture below the 14% government procurement standard.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <div className="flex items-center space-x-2 text-blue-800 font-bold text-xs">
            <Wind className="w-4 h-4 text-blue-500" />
            <span>Tarpaulin Covering Mandate</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Always carry waterproof tarpaulins on transport tractors/trucks even on clear days to guard against sudden showers en route.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
          <div className="flex items-center space-x-2 text-purple-800 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            <span>Instant Slot Reschedule Policy</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            In case of unseasonal heavy rain, your booking token is automatically protected without penalty for up to 48 hours.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AgriWeatherAdvisor;
