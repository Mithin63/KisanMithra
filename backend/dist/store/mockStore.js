"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockStore = exports.MockStore = void 0;
class MockStore {
    users = [
        { id: 1, name: 'Ravi Kumar', mobile: '9876543210', email: 'ravi.kumar@farmer.in', role: 'FARMER', created_at: new Date().toISOString() },
        { id: 2, name: 'Officer Anitha', mobile: '9876543211', email: 'anitha.officer@gov.in', role: 'OFFICER', created_at: new Date().toISOString() },
        { id: 3, name: 'Dr. K. S. Sharma', mobile: '9876543212', email: 'admin.sharma@gov.in', role: 'ADMIN', created_at: new Date().toISOString() },
        { id: 4, name: 'Venkateswarlu M.', mobile: '9876543213', email: 'venkat.m@farmer.in', role: 'FARMER', created_at: new Date().toISOString() },
        { id: 5, name: 'Srinivasa Rao', mobile: '9876543214', email: 'srinivas.r@farmer.in', role: 'FARMER', created_at: new Date().toISOString() },
        { id: 6, name: 'Lakshmi Devi', mobile: '9876543215', email: 'lakshmi.d@farmer.in', role: 'FARMER', created_at: new Date().toISOString() },
        { id: 7, name: 'Subba Rao', mobile: '9876543216', email: 'subba.r@farmer.in', role: 'FARMER', created_at: new Date().toISOString() }
    ];
    farmers = [
        { id: 1, user_id: 1, farmer_id: 'AP-FARM-9872', name: 'Ravi Kumar', mobile: '9876543210', address: 'Door 4-12, Main Street', district: 'Guntur', village: 'Pedakakani', created_at: new Date().toISOString() },
        { id: 2, user_id: 4, farmer_id: 'AP-FARM-9873', name: 'Venkateswarlu M.', mobile: '9876543213', address: 'Door 1-45, Rythu Bazar Rd', district: 'Guntur', village: 'Mangalagiri', created_at: new Date().toISOString() },
        { id: 3, user_id: 5, farmer_id: 'AP-FARM-9874', name: 'Srinivasa Rao', mobile: '9876543214', address: 'Flat 12, Milk Colony', district: 'NTR District', village: 'Kankipadu', created_at: new Date().toISOString() },
        { id: 4, user_id: 6, farmer_id: 'AP-FARM-9875', name: 'Lakshmi Devi', mobile: '9876543215', address: 'Plot 88, Canal Road', district: 'Guntur', village: 'Chebrolu', created_at: new Date().toISOString() },
        { id: 5, user_id: 7, farmer_id: 'AP-FARM-9876', name: 'Subba Rao', mobile: '9876543216', address: 'Door 9-3, Church Street', district: 'Guntur', village: 'Ponnur', created_at: new Date().toISOString() }
    ];
    crops = [
        { id: 1, name: 'Paddy', variety: 'Sona Masoori Grade A', msp_price_per_quintal: 2369.00 },
        { id: 2, name: 'Wheat', variety: 'Sharbati Premium', msp_price_per_quintal: 2275.00 },
        { id: 3, name: 'Maize', variety: 'Hybrid Yellow', msp_price_per_quintal: 2090.00 },
        { id: 4, name: 'Cotton', variety: 'Long Staple High Quality', msp_price_per_quintal: 7020.00 },
        { id: 5, name: 'Groundnut', variety: 'Bold Bold-50', msp_price_per_quintal: 6377.00 }
    ];
    centres = [
        { id: 1, name: 'Guntur Agricultural Procurement Centre', district: 'Guntur', address: 'NH-16 Bypass, Market Yard, Guntur, AP - 522001', latitude: 16.3067, longitude: 80.4365, daily_capacity: 500, active_counters: 5, status: 'NORMAL', avg_processing_mins: 4 },
        { id: 2, name: 'Vijayawada Procurement Centre', district: 'NTR District', address: 'PNS Bus Stand Road, Auto Nagar, Vijayawada, AP - 520007', latitude: 16.5062, longitude: 80.6480, daily_capacity: 450, active_counters: 4, status: 'HIGH_LOAD', avg_processing_mins: 4 },
        { id: 3, name: 'Tenali Agricultural Yard Centre', district: 'Guntur', address: 'Bose Road, Agricultural Market, Tenali, AP - 522201', latitude: 16.2430, longitude: 80.6400, daily_capacity: 350, active_counters: 3, status: 'NORMAL', avg_processing_mins: 5 },
        { id: 4, name: 'Bapatla Coastal Procurement Hub', district: 'Bapatla', address: 'Karlapalem Road, Bapatla, AP - 522101', latitude: 15.9042, longitude: 80.4674, daily_capacity: 300, active_counters: 3, status: 'NORMAL', avg_processing_mins: 4 },
        { id: 5, name: 'Narasaraopet Regional Grain Depot', district: 'Palnadu', address: 'Kotappakonda Road, Narasaraopet, AP - 522601', latitude: 16.2354, longitude: 80.0487, daily_capacity: 400, active_counters: 4, status: 'OVERLOADED', avg_processing_mins: 6 }
    ];
    bookings = [
        { id: 1, farmer_id: 1, centre_id: 1, crop_id: 1, quantity: 25.40, booking_date: '2026-08-28', slot_start: '10:30 AM', slot_end: '11:00 AM', token_number: 127, status: 'WAITING', created_at: new Date().toISOString() },
        { id: 2, farmer_id: 2, centre_id: 1, crop_id: 1, quantity: 18.50, booking_date: '2026-08-28', slot_start: '09:00 AM', slot_end: '09:30 AM', token_number: 113, status: 'IN_PROGRESS', created_at: new Date().toISOString() },
        { id: 3, farmer_id: 3, centre_id: 2, crop_id: 2, quantity: 40.00, booking_date: '2026-08-28', slot_start: '09:30 AM', slot_end: '10:00 AM', token_number: 114, status: 'ARRIVED', created_at: new Date().toISOString() },
        { id: 4, farmer_id: 4, centre_id: 1, crop_id: 4, quantity: 15.00, booking_date: '2026-08-28', slot_start: '10:00 AM', slot_end: '10:30 AM', token_number: 115, status: 'WAITING', created_at: new Date().toISOString() },
        { id: 5, farmer_id: 5, centre_id: 3, crop_id: 5, quantity: 30.00, booking_date: '2026-08-25', slot_start: '09:00 AM', slot_end: '09:30 AM', token_number: 101, status: 'COMPLETED', created_at: new Date().toISOString() }
    ];
    queueTokens = [
        { id: 1, booking_id: 1, token_number: 127, queue_position: 13, estimated_wait_time: 45, status: 'WAITING', updated_at: new Date().toISOString() },
        { id: 2, booking_id: 2, token_number: 113, queue_position: 0, estimated_wait_time: 0, status: 'IN_PROGRESS', updated_at: new Date().toISOString() },
        { id: 3, booking_id: 3, token_number: 114, queue_position: 1, estimated_wait_time: 5, status: 'ARRIVED', updated_at: new Date().toISOString() },
        { id: 4, booking_id: 4, token_number: 115, queue_position: 2, estimated_wait_time: 8, status: 'WAITING', updated_at: new Date().toISOString() },
        { id: 5, booking_id: 5, token_number: 101, queue_position: 0, estimated_wait_time: 0, status: 'COMPLETED', updated_at: new Date().toISOString() }
    ];
    procurementRecords = [
        { id: 1, booking_id: 1, actual_quantity: 25.40, quality_grade: 'GRADE_A', moisture: 12.50, procurement_price: 2369.00, total_amount: 60152.60, status: 'COMPLETED', completed_at: new Date().toISOString() },
        { id: 2, booking_id: 5, actual_quantity: 30.00, quality_grade: 'GRADE_A', moisture: 11.80, procurement_price: 6377.00, total_amount: 191310.00, status: 'COMPLETED', completed_at: '2026-08-25T11:00:00Z' }
    ];
    payments = [
        { id: 1, procurement_id: 1, amount: 60152.60, status: 'PROCESSING', transaction_id: 'SP20260828127', payment_date: new Date().toISOString(), crop_name: 'Paddy', quantity: 25.4 },
        { id: 2, procurement_id: 2, amount: 191310.00, status: 'PAID', transaction_id: 'SP20260825101', payment_date: '2026-08-25T14:30:00Z', crop_name: 'Groundnut', quantity: 30.0 }
    ];
    notifications = [
        { id: 1, user_id: 1, title: 'Booking Confirmed', message: 'Your procurement slot #127 at Guntur Agricultural Procurement Centre has been confirmed for 28 August 2026 (10:30 AM).', type: 'BOOKING', read: false, created_at: new Date().toISOString() },
        { id: 2, user_id: 1, title: 'Queue Update', message: 'Your token #127 is approaching. 13 farmers are ahead of you. Estimated wait time: 45 mins.', type: 'QUEUE', read: false, created_at: new Date().toISOString() },
        { id: 3, user_id: 1, title: 'Procurement Verified', message: 'Quality check passed for 25.4 Quintals of Paddy. Grade A assigned.', type: 'PROCUREMENT', read: true, created_at: new Date().toISOString() }
    ];
}
exports.MockStore = MockStore;
exports.mockStore = new MockStore();
