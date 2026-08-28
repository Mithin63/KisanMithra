import {
  User, Farmer, Crop, ProcurementCentre, Booking, QueueToken,
  ProcurementRecord, Payment, Notification
} from '../types';

export const initialUsers: User[] = [
  {
    id: 1,
    name: 'Ravi Kumar',
    mobile: '9876543210',
    email: 'ravi.kumar@farmer.in',
    role: 'FARMER',
    farmer: {
      id: 1,
      user_id: 1,
      farmer_id: 'AP-FARM-9872',
      name: 'Ravi Kumar',
      mobile: '9876543210',
      address: 'Door 4-12, Main Street',
      district: 'Guntur',
      village: 'Pedakakani',
      latitude: 16.3350,
      longitude: 80.4920
    }
  },
  {
    id: 2,
    name: 'Officer Anitha',
    mobile: '9876543211',
    email: 'anitha.officer@gov.in',
    role: 'OFFICER'
  },
  {
    id: 3,
    name: 'Dr. K. S. Sharma',
    mobile: '9876543212',
    email: 'admin.sharma@gov.in',
    role: 'ADMIN'
  }
];

export const initialCrops: Crop[] = [
  // 1. Cereals & Grains
  { id: 1, name: 'Paddy (Common)', variety: 'Sona Masoori Grade A', msp_price_per_quintal: 2300.00, category: 'CEREALS', max_moisture: 14.0, season: 'KHARIF', icon: '🌾' },
  { id: 2, name: 'Paddy (Grade A)', variety: 'BPT 5204 (Samba Mahsuri)', msp_price_per_quintal: 2369.00, category: 'CEREALS', max_moisture: 13.5, season: 'KHARIF', icon: '🌾' },
  { id: 3, name: 'Basmati Rice', variety: 'Pusa 1121 Premium', msp_price_per_quintal: 3850.00, category: 'CEREALS', max_moisture: 12.0, season: 'KHARIF', icon: '🍚' },
  { id: 4, name: 'Wheat (Common)', variety: 'HD 2967 High Yield', msp_price_per_quintal: 2275.00, category: 'CEREALS', max_moisture: 12.0, season: 'RABI', icon: '🌾' },
  { id: 5, name: 'Wheat (Sharbati)', variety: 'Sehore Premium Golden', msp_price_per_quintal: 2850.00, category: 'CEREALS', max_moisture: 11.5, season: 'RABI', icon: '🌾' },
  { id: 6, name: 'Maize (Corn)', variety: 'Hybrid Yellow Special', msp_price_per_quintal: 2090.00, category: 'CEREALS', max_moisture: 14.0, season: 'KHARIF', icon: '🌽' },
  { id: 7, name: 'Jowar (Sorghum)', variety: 'Hybrid CSH-16', msp_price_per_quintal: 3180.00, category: 'CEREALS', max_moisture: 12.0, season: 'KHARIF', icon: '🌾' },
  { id: 8, name: 'Bajra (Pearl Millet)', variety: 'Hybrid Pioneer 86M38', msp_price_per_quintal: 2500.00, category: 'CEREALS', max_moisture: 12.5, season: 'KHARIF', icon: '🌾' },
  { id: 9, name: 'Ragi (Finger Millet)', variety: 'GPU 28 Nutrient Rich', msp_price_per_quintal: 3846.00, category: 'CEREALS', max_moisture: 12.0, season: 'KHARIF', icon: '🌾' },
  { id: 10, name: 'Barley (Jau)', variety: 'RD 2552 Malt Grade', msp_price_per_quintal: 1850.00, category: 'CEREALS', max_moisture: 12.0, season: 'RABI', icon: '🌾' },

  // 2. Pulses & Dals
  { id: 11, name: 'Gram / Chana (Desi)', variety: 'JG 11 Bold Seed', msp_price_per_quintal: 5440.00, category: 'PULSES', max_moisture: 10.0, season: 'RABI', icon: '🧆' },
  { id: 12, name: 'Gram / Chana (Kabuli)', variety: 'Dollar Giant Seed', msp_price_per_quintal: 6200.00, category: 'PULSES', max_moisture: 9.5, season: 'RABI', icon: '🧆' },
  { id: 13, name: 'Tur / Arhar (Red Gram)', variety: 'Asha ICPL 87119', msp_price_per_quintal: 7000.00, category: 'PULSES', max_moisture: 10.0, season: 'KHARIF', icon: '🌱' },
  { id: 14, name: 'Moong (Green Gram)', variety: 'IPM 02-03 Shiny', msp_price_per_quintal: 8558.00, category: 'PULSES', max_moisture: 9.0, season: 'KHARIF', icon: '🌱' },
  { id: 15, name: 'Urad (Black Gram)', variety: 'PU 31 LBG 752', msp_price_per_quintal: 6950.00, category: 'PULSES', max_moisture: 10.0, season: 'KHARIF', icon: '🌱' },
  { id: 16, name: 'Masoor (Lentil)', variety: 'KLS 218 Large Red', msp_price_per_quintal: 6425.00, category: 'PULSES', max_moisture: 10.0, season: 'RABI', icon: '🌱' },

  // 3. Oilseeds
  { id: 17, name: 'Groundnut (Peanut)', variety: 'Bold-50 High Oil', msp_price_per_quintal: 6377.00, category: 'OILSEEDS', max_moisture: 8.0, season: 'KHARIF', icon: '🥜' },
  { id: 18, name: 'Soybean', variety: 'JS 335 Yellow Premium', msp_price_per_quintal: 4600.00, category: 'OILSEEDS', max_moisture: 10.0, season: 'KHARIF', icon: '🫘' },
  { id: 19, name: 'Mustard / Rapeseed', variety: 'Pusa Bold High Erucic', msp_price_per_quintal: 5650.00, category: 'OILSEEDS', max_moisture: 8.0, season: 'RABI', icon: '🌻' },
  { id: 20, name: 'Sunflower Seed', variety: 'KBSH 44 Hybrid', msp_price_per_quintal: 6760.00, category: 'OILSEEDS', max_moisture: 9.0, season: 'KHARIF', icon: '🌻' },
  { id: 21, name: 'Sesamum (Til)', variety: 'Swetha White Premium', msp_price_per_quintal: 8635.00, category: 'OILSEEDS', max_moisture: 7.0, season: 'KHARIF', icon: '🌱' },

  // 4. Commercial & Cash Crops
  { id: 22, name: 'Cotton (Medium Staple)', variety: 'MCU 5 Good Grade', msp_price_per_quintal: 6620.00, category: 'COMMERCIAL', max_moisture: 8.5, season: 'KHARIF', icon: '🧶' },
  { id: 23, name: 'Cotton (Long Staple)', variety: 'DCH 32 Extra Long Super', msp_price_per_quintal: 7020.00, category: 'COMMERCIAL', max_moisture: 8.0, season: 'KHARIF', icon: '🧶' },
  { id: 24, name: 'Sugarcane (FRP)', variety: 'Co 0238 High Recovery', msp_price_per_quintal: 340.00, category: 'COMMERCIAL', max_moisture: 70.0, season: 'ALL_SEASON', icon: '🎋' },
  { id: 25, name: 'Raw Jute', variety: 'TD 5 Premium Fibre', msp_price_per_quintal: 5050.00, category: 'COMMERCIAL', max_moisture: 18.0, season: 'KHARIF', icon: '🌾' },

  // 5. Spices & Commercial
  { id: 26, name: 'Red Chilli (Guntur Teja)', variety: 'Teja S17 Export Quality', msp_price_per_quintal: 19500.00, category: 'SPICES', max_moisture: 10.0, season: 'RABI', icon: '🌶️' },
  { id: 27, name: 'Turmeric (Haldi)', variety: 'Salem Yellow Curcumin 5%', msp_price_per_quintal: 11200.00, category: 'SPICES', max_moisture: 10.0, season: 'RABI', icon: '🪴' }
];

export const initialCentres: ProcurementCentre[] = [
  // Andhra Pradesh Regional Centres
  { id: 1, name: 'Guntur Agricultural Procurement Centre', district: 'Guntur', state: 'Andhra Pradesh', address: 'NH-16 Bypass, Market Yard, Guntur, AP - 522001', latitude: 16.3067, longitude: 80.4365, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 372, current_queue: 18, available_slots: 128, utilization_percent: 74, contact_phone: '0863-2234567' },
  { id: 2, name: 'Vijayawada Multi-Commodity Hub', district: 'NTR District', state: 'Andhra Pradesh', address: 'PNS Bus Stand Road, Auto Nagar, Vijayawada, AP - 520007', latitude: 16.5062, longitude: 80.6480, daily_capacity: 450, active_counters: 4, status: 'HIGH_LOAD', avg_processing_mins: 4, booked_slots: 390, current_queue: 24, available_slots: 60, utilization_percent: 86, contact_phone: '0866-2456789' },
  { id: 3, name: 'Tenali Agricultural Yard Centre', district: 'Guntur', state: 'Andhra Pradesh', address: 'Bose Road, Agricultural Market, Tenali, AP - 522201', latitude: 16.2430, longitude: 80.6400, daily_capacity: 350, active_counters: 3, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 195, current_queue: 9, available_slots: 155, utilization_percent: 55, contact_phone: '08644-223344' },
  { id: 4, name: 'Bapatla Coastal Grain Hub', district: 'Bapatla', state: 'Andhra Pradesh', address: 'Karlapalem Road, Market Yard, Bapatla, AP - 522101', latitude: 15.9042, longitude: 80.4674, daily_capacity: 300, active_counters: 3, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 140, current_queue: 6, available_slots: 160, utilization_percent: 46, contact_phone: '08643-221100' },
  { id: 5, name: 'Narasaraopet Regional Grain Depot', district: 'Palnadu', state: 'Andhra Pradesh', address: 'Kotappakonda Road, Narasaraopet, AP - 522601', latitude: 16.2354, longitude: 80.0487, daily_capacity: 400, active_counters: 4, status: 'OVERLOADED', avg_processing_mins: 6, booked_slots: 388, current_queue: 32, available_slots: 12, utilization_percent: 97, contact_phone: '08647-245566' },
  { id: 6, name: 'Kurnool Mega Cotton & Pulse Yard', district: 'Kurnool', state: 'Andhra Pradesh', address: 'Bellary Road, Agricultural Yard, Kurnool, AP - 518003', latitude: 15.8281, longitude: 78.0373, daily_capacity: 600, active_counters: 6, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 410, current_queue: 15, available_slots: 190, utilization_percent: 68, contact_phone: '08518-234567' },
  { id: 7, name: 'Rajahmundry Godavari Paddy Depot', district: 'East Godavari', state: 'Andhra Pradesh', address: 'Morampudi Junction, Rajahmundry, AP - 533107', latitude: 17.0005, longitude: 81.8040, daily_capacity: 550, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 320, current_queue: 12, available_slots: 230, utilization_percent: 58, contact_phone: '0883-2478900' },
  { id: 8, name: 'Eluru Central Rice & Maize Yard', district: 'Eluru', state: 'Andhra Pradesh', address: 'Sanivarapupeta, Market Road, Eluru, AP - 534003', latitude: 16.7107, longitude: 81.0952, daily_capacity: 400, active_counters: 4, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 240, current_queue: 10, available_slots: 160, utilization_percent: 60, contact_phone: '08812-230987' },
  { id: 9, name: 'Anantapur Groundnut Special Centre', district: 'Anantapur', state: 'Andhra Pradesh', address: 'NH-44 Bypass, Industrial Area, Anantapur, AP - 515004', latitude: 14.6819, longitude: 77.6006, daily_capacity: 450, active_counters: 4, status: 'HIGH_LOAD', avg_processing_mins: 5, booked_slots: 375, current_queue: 22, available_slots: 75, utilization_percent: 83, contact_phone: '08554-276543' },
  { id: 10, name: 'Nellore Coastal Paddy Hub', district: 'SPSR Nellore', state: 'Andhra Pradesh', address: 'Podalakur Road, APMC Yard, Nellore, AP - 524004', latitude: 14.4426, longitude: 79.9865, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 290, current_queue: 11, available_slots: 210, utilization_percent: 58, contact_phone: '0861-2334455' },

  // Telangana Regional Centres
  { id: 11, name: 'Warangal Mega Cotton & Grain Yard', district: 'Warangal', state: 'Telangana', address: 'Enumamula Market Yard, Warangal, TS - 506006', latitude: 17.9689, longitude: 79.5941, daily_capacity: 700, active_counters: 7, status: 'HIGH_LOAD', avg_processing_mins: 4, booked_slots: 590, current_queue: 28, available_slots: 110, utilization_percent: 84, contact_phone: '0870-2443322' },
  { id: 12, name: 'Nizamabad Turmeric & Maize Hub', district: 'Nizamabad', state: 'Telangana', address: 'Dichpally Road, Nizamabad, TS - 503002', latitude: 18.6725, longitude: 78.0941, daily_capacity: 450, active_counters: 4, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 260, current_queue: 14, available_slots: 190, utilization_percent: 57, contact_phone: '08462-234567' },
  { id: 13, name: 'Khammam Chilli & Cotton Market Depot', district: 'Khammam', state: 'Telangana', address: 'Wyra Road, APMC Complex, Khammam, TS - 507002', latitude: 17.2473, longitude: 80.1514, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 340, current_queue: 16, available_slots: 160, utilization_percent: 68, contact_phone: '08742-225588' },

  // National Major Agricultural Hubs
  { id: 14, name: 'Indore Central Grain & Soybean Yard', district: 'Indore', state: 'Madhya Pradesh', address: 'Chhawani Mandi, Indore, MP - 452001', latitude: 22.7196, longitude: 75.8577, daily_capacity: 800, active_counters: 8, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 530, current_queue: 20, available_slots: 270, utilization_percent: 66, contact_phone: '0731-2456789' },
  { id: 15, name: 'Ludhiana Granary & Wheat Procurement Yard', district: 'Ludhiana', state: 'Punjab', address: 'GT Road, Grain Market, Ludhiana, PB - 141003', latitude: 30.9010, longitude: 75.8573, daily_capacity: 900, active_counters: 9, status: 'NORMAL', avg_processing_mins: 3, booked_slots: 620, current_queue: 19, available_slots: 280, utilization_percent: 68, contact_phone: '0161-2789012' },
  { id: 16, name: 'Karnal Basmati & Wheat Special Yard', district: 'Karnal', state: 'Haryana', address: 'New Anaj Mandi, Karnal, HR - 132001', latitude: 29.6857, longitude: 76.9905, daily_capacity: 750, active_counters: 7, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 480, current_queue: 17, available_slots: 270, utilization_percent: 64, contact_phone: '0184-2233445' },

  // Expanded India Hubs
  // Uttar Pradesh
  { id: 17, name: 'Bareilly Regional Paddy Mandi', district: 'Bareilly', state: 'Uttar Pradesh', address: 'Pilibhit Bypass Road, Bareilly, UP - 243006', latitude: 28.3670, longitude: 79.4300, daily_capacity: 650, active_counters: 6, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 340, current_queue: 15, available_slots: 310, utilization_percent: 52, contact_phone: '0581-224455' },
  { id: 18, name: 'Saharanpur Grain Procurement Yard', district: 'Saharanpur', state: 'Uttar Pradesh', address: 'Ambala Road, Saharanpur, UP - 247001', latitude: 29.9640, longitude: 77.5460, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 290, current_queue: 12, available_slots: 210, utilization_percent: 58, contact_phone: '0132-234567' },
  { id: 19, name: 'Varanasi Pulse & Cereal Depot', district: 'Varanasi', state: 'Uttar Pradesh', address: 'GT Road, Babatpur, Varanasi, UP - 221006', latitude: 25.3176, longitude: 82.9739, daily_capacity: 550, active_counters: 5, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 310, current_queue: 14, available_slots: 240, utilization_percent: 56, contact_phone: '0542-262233' },

  // Rajasthan
  { id: 20, name: 'Sri Ganganagar Wheat & Mustard Mandi', district: 'Sri Ganganagar', state: 'Rajasthan', address: 'Mandi Road, Sri Ganganagar, RJ - 335001', latitude: 29.9130, longitude: 73.8780, daily_capacity: 850, active_counters: 8, status: 'HIGH_LOAD', avg_processing_mins: 4, booked_slots: 690, current_queue: 26, available_slots: 160, utilization_percent: 81, contact_phone: '0154-2245566' },
  { id: 21, name: 'Kota Soybeans & Coriander Hub', district: 'Kota', state: 'Rajasthan', address: 'Bhamashah Mandi, Kota, RJ - 324005', latitude: 25.1800, longitude: 75.8300, daily_capacity: 600, active_counters: 6, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 420, current_queue: 18, available_slots: 180, utilization_percent: 70, contact_phone: '0744-248990' },

  // Gujarat
  { id: 22, name: 'Gondal Groundnut & Chilli Mega Yard', district: 'Rajkot', state: 'Gujarat', address: 'APMC Market Yard, Gondal, GJ - 360311', latitude: 21.9620, longitude: 70.7930, daily_capacity: 800, active_counters: 8, status: 'NORMAL', avg_processing_mins: 3, booked_slots: 510, current_queue: 19, available_slots: 290, utilization_percent: 63, contact_phone: '02825-223400' },
  { id: 23, name: 'Mehsana Oilseed & Cereal Centre', district: 'Mehsana', state: 'Gujarat', address: 'Radhanpur Road Mandi, Mehsana, GJ - 384002', latitude: 23.6000, longitude: 72.4000, daily_capacity: 400, active_counters: 4, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 220, current_queue: 9, available_slots: 180, utilization_percent: 55, contact_phone: '02762-233445' },

  // Maharashtra
  { id: 24, name: 'Nagpur Cotton & Orange Mandi Hub', district: 'Nagpur', state: 'Maharashtra', address: 'Kalamna Market Yard, Nagpur, MH - 440008', latitude: 21.1458, longitude: 79.0882, daily_capacity: 700, active_counters: 7, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 480, current_queue: 22, available_slots: 220, utilization_percent: 68, contact_phone: '0712-243556' },
  { id: 25, name: 'Latur Pulse & Soybean Terminal', district: 'Latur', state: 'Maharashtra', address: 'APMC Market, Latur, MH - 413512', latitude: 18.4088, longitude: 76.5604, daily_capacity: 650, active_counters: 6, status: 'HIGH_LOAD', avg_processing_mins: 5, booked_slots: 540, current_queue: 25, available_slots: 110, utilization_percent: 83, contact_phone: '02382-224455' },

  // West Bengal
  { id: 26, name: 'Bardhaman Mega Paddy Hub', district: 'Bardhaman', state: 'West Bengal', address: 'Grand Trunk Road, Bardhaman, WB - 713101', latitude: 23.2324, longitude: 87.8630, daily_capacity: 750, active_counters: 7, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 510, current_queue: 18, available_slots: 240, utilization_percent: 68, contact_phone: '0342-266554' },
  { id: 27, name: 'Malda Jute & Mango Market Yard', district: 'Malda', state: 'West Bengal', address: 'English Bazar Mandi, Malda, WB - 732101', latitude: 25.0108, longitude: 88.1398, daily_capacity: 450, active_counters: 4, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 230, current_queue: 8, available_slots: 220, utilization_percent: 51, contact_phone: '03512-223456' },

  // Karnataka
  { id: 28, name: 'Davanagere Rice & Maize Yard', district: 'Davanagere', state: 'Karnataka', address: 'PB Road, APMC Yard, Davanagere, KA - 577002', latitude: 14.4644, longitude: 75.9218, daily_capacity: 600, active_counters: 6, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 360, current_queue: 14, available_slots: 240, utilization_percent: 60, contact_phone: '08192-234567' },
  { id: 29, name: 'Shimoga Paddy & Arecanut Depot', district: 'Shimoga', state: 'Karnataka', address: 'Sagar Road, APMC Market, Shimoga, KA - 577201', latitude: 13.9299, longitude: 75.5681, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 280, current_queue: 11, available_slots: 220, utilization_percent: 56, contact_phone: '08182-224466' },

  // Tamil Nadu
  { id: 30, name: 'Thanjavur Delta Paddy Procurement Hub', district: 'Thanjavur', state: 'Tamil Nadu', address: 'Trichy Highway, Thanjavur, TN - 613007', latitude: 10.7870, longitude: 79.1378, daily_capacity: 600, active_counters: 6, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 390, current_queue: 15, available_slots: 210, utilization_percent: 65, contact_phone: '04362-223344' },
  { id: 31, name: 'Madurai Millets & Pulse Yard', district: 'Madurai', state: 'Tamil Nadu', address: 'Mattuthavani, Madurai, TN - 625007', latitude: 9.9252, longitude: 78.1198, daily_capacity: 400, active_counters: 4, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 210, current_queue: 7, available_slots: 190, utilization_percent: 52, contact_phone: '0452-258900' },

  // Odisha
  { id: 32, name: 'Bargarh Rice Bowl Procurement Centre', district: 'Bargarh', state: 'Odisha', address: 'Canal Road Mandi, Bargarh, OD - 768028', latitude: 21.3333, longitude: 83.6167, daily_capacity: 650, active_counters: 6, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 440, current_queue: 17, available_slots: 210, utilization_percent: 67, contact_phone: '06646-234567' },

  // Chhattisgarh
  { id: 33, name: 'Raipur Central Rice Mandi Yard', district: 'Raipur', state: 'Chhattisgarh', address: 'Naya Raipur Mandi Road, Raipur, CG - 492001', latitude: 21.2514, longitude: 81.6296, daily_capacity: 800, active_counters: 8, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 520, current_queue: 21, available_slots: 280, utilization_percent: 65, contact_phone: '0771-2445566' }
];

export const initialBookings: Booking[] = [
  {
    id: 1,
    farmer_id: 1,
    centre_id: 1,
    crop_id: 2,
    quantity: 35.40,
    booking_date: '2026-08-28',
    slot_start: '10:30 AM',
    slot_end: '11:00 AM',
    token_number: 127,
    status: 'WAITING',
    created_at: new Date().toISOString(),
    farmer_name: 'Ravi Kumar',
    farmer_code: 'AP-FARM-9872',
    centre_name: 'Guntur Agricultural Procurement Centre',
    centre_address: 'NH-16 Bypass, Market Yard, Guntur, AP - 522001',
    crop_name: 'Paddy (Grade A)',
    variety: 'BPT 5204 (Samba Mahsuri)',
    msp_price: 2369.00,
    total_valuation: 83862.60,
    crop_items: [
      { crop_id: 2, crop_name: 'Paddy (Grade A)', variety: 'BPT 5204', quantity: 25.40, msp_price: 2369.00, total_amount: 60172.60 },
      { crop_id: 26, crop_name: 'Red Chilli (Guntur Teja)', variety: 'Teja S17', quantity: 10.00, msp_price: 19500.00, total_amount: 195000.00 }
    ],
    queue_position: 13,
    estimated_wait_time: 45
  },
  {
    id: 2,
    farmer_id: 2,
    centre_id: 1,
    crop_id: 2,
    quantity: 18.50,
    booking_date: '2026-08-28',
    slot_start: '09:00 AM',
    slot_end: '09:30 AM',
    token_number: 113,
    status: 'IN_PROGRESS',
    created_at: new Date().toISOString(),
    farmer_name: 'Venkateswarlu M.',
    farmer_code: 'AP-FARM-9873',
    centre_name: 'Guntur Agricultural Procurement Centre',
    crop_name: 'Paddy (Grade A)',
    msp_price: 2369.00,
    total_valuation: 43826.50,
    queue_position: 0,
    estimated_wait_time: 0
  },
  {
    id: 3,
    farmer_id: 3,
    centre_id: 1,
    crop_id: 4,
    quantity: 40.00,
    booking_date: '2026-08-28',
    slot_start: '09:30 AM',
    slot_end: '10:00 AM',
    token_number: 114,
    status: 'ARRIVED',
    created_at: new Date().toISOString(),
    farmer_name: 'Srinivasa Rao',
    farmer_code: 'AP-FARM-9874',
    centre_name: 'Guntur Agricultural Procurement Centre',
    crop_name: 'Wheat (Common)',
    msp_price: 2275.00,
    total_valuation: 91000.00,
    queue_position: 1,
    estimated_wait_time: 4
  },
  {
    id: 4,
    farmer_id: 4,
    centre_id: 1,
    crop_id: 23,
    quantity: 15.00,
    booking_date: '2026-08-28',
    slot_start: '10:00 AM',
    slot_end: '10:30 AM',
    token_number: 115,
    status: 'WAITING',
    created_at: new Date().toISOString(),
    farmer_name: 'Lakshmi Devi',
    farmer_code: 'AP-FARM-9875',
    centre_name: 'Guntur Agricultural Procurement Centre',
    crop_name: 'Cotton (Long Staple)',
    msp_price: 7020.00,
    total_valuation: 105300.00,
    queue_position: 2,
    estimated_wait_time: 8
  },
  {
    id: 5,
    farmer_id: 1,
    centre_id: 3,
    crop_id: 17,
    quantity: 20.00,
    booking_date: '2026-08-25',
    slot_start: '09:00 AM',
    slot_end: '09:30 AM',
    token_number: 101,
    status: 'COMPLETED',
    created_at: '2026-08-25T08:30:00Z',
    farmer_name: 'Ravi Kumar',
    farmer_code: 'AP-FARM-9872',
    centre_name: 'Tenali Agricultural Yard Centre',
    crop_name: 'Groundnut (Peanut)',
    msp_price: 6377.00,
    total_valuation: 127540.00,
    queue_position: 0,
    estimated_wait_time: 0
  }
];

export const initialProcurements: ProcurementRecord[] = [
  {
    id: 1,
    booking_id: 5,
    actual_quantity: 20.00,
    quality_grade: 'GRADE_A',
    moisture: 7.80,
    procurement_price: 6377.00,
    total_amount: 127540.00,
    status: 'COMPLETED',
    completed_at: '2026-08-25T10:15:00Z',
    farmer_name: 'Ravi Kumar',
    crop_name: 'Groundnut (Peanut)'
  }
];

export const initialPayments: Payment[] = [
  {
    id: 1,
    procurement_id: 1,
    amount: 127540.00,
    status: 'PAID',
    transaction_id: 'SP20260825101',
    payment_date: '2026-08-25T14:30:00Z',
    crop_name: 'Groundnut (Peanut)',
    quantity: 20.00
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Booking Confirmed',
    message: 'Your procurement slot #127 at Guntur Agricultural Procurement Centre has been confirmed for 28 August 2026 (10:30 AM – 11:00 AM).',
    type: 'BOOKING',
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 2,
    user_id: 1,
    title: 'Queue Update',
    message: 'Your token #127 is approaching. 13 farmers are ahead of you in the queue.',
    type: 'QUEUE',
    read: false,
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 3,
    user_id: 1,
    title: 'Payment Processed',
    message: 'Payment of ₹1,27,540 for Voucher #SP20260825101 has been credited to your bank account via DBT.',
    type: 'PAYMENT',
    read: true,
    created_at: '2026-08-25T14:35:00Z'
  }
];
