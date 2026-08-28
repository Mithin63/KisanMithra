export type UserRole = 'FARMER' | 'OFFICER' | 'ADMIN';
export type BookingStatus = 'WAITING' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type CentreStatus = 'NORMAL' | 'HIGH_LOAD' | 'OVERLOADED';
export type QualityGrade = 'GRADE_A' | 'GRADE_B' | 'GRADE_C' | 'REJECTED';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED';
export type NotificationType = 'BOOKING' | 'QUEUE' | 'PROCUREMENT' | 'PAYMENT' | 'SYSTEM';

export interface User {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  password_hash?: string;
  role: UserRole;
  created_at: string;
}

export interface Farmer {
  id: number;
  user_id: number;
  farmer_id: string;
  name?: string;
  mobile?: string;
  address: string;
  district: string;
  village: string;
  created_at: string;
}

export interface Crop {
  id: number;
  name: string;
  variety: string;
  msp_price_per_quintal: number;
}

export interface ProcurementCentre {
  id: number;
  name: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  daily_capacity: number;
  active_counters: number;
  status: CentreStatus;
  avg_processing_mins: number;
  booked_slots?: number;
  current_queue?: number;
  utilization_percent?: number;
}

export interface Booking {
  id: number;
  farmer_id: number;
  centre_id: number;
  crop_id: number;
  quantity: number; // Quintals
  booking_date: string;
  slot_start: string;
  slot_end: string;
  token_number: number;
  status: BookingStatus;
  created_at: string;
  // Hydrated fields
  farmer_name?: string;
  farmer_code?: string;
  centre_name?: string;
  crop_name?: string;
  msp_price?: number;
}

export interface QueueToken {
  id: number;
  booking_id: number;
  token_number: number;
  queue_position: number;
  estimated_wait_time: number; // Minutes
  status: BookingStatus;
  updated_at: string;
}

export interface ProcurementRecord {
  id: number;
  booking_id: number;
  actual_quantity: number;
  quality_grade: QualityGrade;
  moisture: number; // percentage
  procurement_price: number;
  total_amount: number;
  status: string;
  completed_at: string;
}

export interface Payment {
  id: number;
  procurement_id: number;
  amount: number;
  status: PaymentStatus;
  transaction_id: string;
  payment_date: string;
  crop_name?: string;
  quantity?: number;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
}
