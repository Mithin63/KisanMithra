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
      village: 'Pedakakani'
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
  { id: 1, name: 'Paddy', variety: 'Sona Masoori Grade A', msp_price_per_quintal: 2369.00 },
  { id: 2, name: 'Wheat', variety: 'Sharbati Premium', msp_price_per_quintal: 2275.00 },
  { id: 3, name: 'Maize', variety: 'Hybrid Yellow', msp_price_per_quintal: 2090.00 },
  { id: 4, name: 'Cotton', variety: 'Long Staple High Quality', msp_price_per_quintal: 7020.00 },
  { id: 5, name: 'Groundnut', variety: 'Bold Bold-50', msp_price_per_quintal: 6377.00 }
];

export const initialCentres: ProcurementCentre[] = [
  { id: 1, name: 'Guntur Agricultural Procurement Centre', district: 'Guntur', address: 'NH-16 Bypass, Market Yard, Guntur, AP - 522001', latitude: 16.3067, longitude: 80.4365, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 372, current_queue: 18, available_slots: 128, utilization_percent: 74 },
  { id: 2, name: 'Vijayawada Procurement Centre', district: 'NTR District', address: 'PNS Bus Stand Road, Auto Nagar, Vijayawada, AP - 520007', latitude: 16.5062, longitude: 80.6480, daily_capacity: 450, active_counters: 4, status: 'HIGH_LOAD', avg_processing_mins: 4, booked_slots: 390, current_queue: 24, available_slots: 60, utilization_percent: 86 },
  { id: 3, name: 'Tenali Agricultural Yard Centre', district: 'Guntur', address: 'Bose Road, Agricultural Market, Tenali, AP - 522201', latitude: 16.2430, longitude: 80.6400, daily_capacity: 350, active_counters: 3, status: 'NORMAL', avg_processing_mins: 5, booked_slots: 195, current_queue: 9, available_slots: 155, utilization_percent: 55 },
  { id: 4, name: 'Bapatla Coastal Procurement Hub', district: 'Bapatla', address: 'Karlapalem Road, Bapatla, AP - 522101', latitude: 15.9042, longitude: 80.4674, daily_capacity: 300, active_counters: 3, status: 'NORMAL', avg_processing_mins: 4, booked_slots: 140, current_queue: 6, available_slots: 160, utilization_percent: 46 },
  { id: 5, name: 'Narasaraopet Regional Grain Depot', district: 'Palnadu', address: 'Kotappakonda Road, Narasaraopet, AP - 522601', latitude: 16.2354, longitude: 80.0487, daily_capacity: 400, active_counters: 4, status: 'OVERLOADED', avg_processing_mins: 6, booked_slots: 388, current_queue: 32, available_slots: 12, utilization_percent: 97 }
];

export const initialBookings: Booking[] = [
  {
    id: 1,
    farmer_id: 1,
    centre_id: 1,
    crop_id: 1,
    quantity: 25.40,
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
    crop_name: 'Paddy',
    variety: 'Sona Masoori Grade A',
    msp_price: 2369.00,
    queue_position: 13,
    estimated_wait_time: 45
  },
  {
    id: 2,
    farmer_id: 2,
    centre_id: 1,
    crop_id: 1,
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
    crop_name: 'Paddy',
    msp_price: 2369.00,
    queue_position: 0,
    estimated_wait_time: 0
  },
  {
    id: 3,
    farmer_id: 3,
    centre_id: 1,
    crop_id: 2,
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
    crop_name: 'Wheat',
    msp_price: 2275.00,
    queue_position: 1,
    estimated_wait_time: 4
  },
  {
    id: 4,
    farmer_id: 4,
    centre_id: 1,
    crop_id: 4,
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
    crop_name: 'Cotton',
    msp_price: 7020.00,
    queue_position: 2,
    estimated_wait_time: 8
  },
  {
    id: 5,
    farmer_id: 1,
    centre_id: 3,
    crop_id: 5,
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
    crop_name: 'Groundnut',
    msp_price: 6377.00,
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
    moisture: 11.80,
    procurement_price: 6377.00,
    total_amount: 127540.00,
    status: 'COMPLETED',
    completed_at: '2026-08-25T10:15:00Z',
    farmer_name: 'Ravi Kumar',
    crop_name: 'Groundnut'
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
    crop_name: 'Groundnut',
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
    message: 'Payment of ₹1,27,540 for Voucher #SP20260825101 has been credited to your bank account.',
    type: 'PAYMENT',
    read: true,
    created_at: '2026-08-25T14:35:00Z'
  }
];
