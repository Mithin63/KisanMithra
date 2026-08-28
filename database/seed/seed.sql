-- =============================================================================
-- SmartProcure - Seed Data
-- Ministry of Consumer Affairs, Food & Public Distribution
-- =============================================================================

-- Seed Crops
INSERT INTO crops (id, name, variety, msp_price_per_quintal) VALUES
(1, 'Paddy', 'Sona Masoori Grade A', 2369.00),
(2, 'Wheat', 'Sharbati Premium', 2275.00),
(3, 'Maize', 'Hybrid Yellow', 2090.00),
(4, 'Cotton', 'Long Staple High Quality', 7020.00),
(5, 'Groundnut', 'Bold Bold-50', 6377.00);

-- Seed Procurement Centres
INSERT INTO procurement_centres (id, name, district, address, latitude, longitude, daily_capacity, active_counters, status, avg_processing_mins) VALUES
(1, 'Guntur Agricultural Procurement Centre', 'Guntur', 'NH-16 Bypass, Market Yard, Guntur, AP - 522001', 16.3067, 80.4365, 500, 5, 'NORMAL', 4),
(2, 'Vijayawada Procurement Centre', 'NTR District', 'PNS Bus Stand Road, Auto Nagar, Vijayawada, AP - 520007', 16.5062, 80.6480, 450, 4, 'HIGH_LOAD', 4),
(3, 'Tenali Agricultural Yard Centre', 'Guntur', 'Bose Road, Agricultural Market, Tenali, AP - 522201', 16.2430, 80.6400, 350, 3, 'NORMAL', 5),
(4, 'Bapatla Coastal Procurement Hub', 'Bapatla', 'Karlapalem Road, Bapatla, AP - 522101', 15.9042, 80.4674, 300, 3, 'NORMAL', 4),
(5, 'Narasaraopet Regional Grain Depot', 'Palnadu', 'Kotappakonda Road, Narasaraopet, AP - 522601', 16.2354, 80.0487, 400, 4, 'OVERLOADED', 6);

-- Seed Users (Password hash for demo is bcrypt hash of 'demo123')
INSERT INTO users (id, name, mobile, email, password_hash, role) VALUES
(1, 'Ravi Kumar', '9876543210', 'ravi.kumar@farmer.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'FARMER'),
(2, 'Anitha Officer', '9876543211', 'anitha.officer@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'OFFICER'),
(3, 'Dr. K. S. Sharma', '9876543212', 'admin.sharma@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'ADMIN'),
(4, 'Venkateswarlu M.', '9876543213', 'venkat.m@farmer.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'FARMER'),
(5, 'Srinivasa Rao', '9876543214', 'srinivas.r@farmer.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'FARMER'),
(6, 'Lakshmi Devi', '9876543215', 'lakshmi.d@farmer.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'FARMER'),
(7, 'Subba Rao', '9876543216', 'subba.r@farmer.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'FARMER');

-- Seed Farmers
INSERT INTO farmers (id, user_id, farmer_id, address, district, village) VALUES
(1, 1, 'AP-FARM-9872', 'Door 4-12, Main Street, Pedakakani', 'Guntur', 'Pedakakani'),
(2, 4, 'AP-FARM-9873', 'Door 1-45, Rythu Bazar Rd, Mangalagiri', 'Guntur', 'Mangalagiri'),
(3, 5, 'AP-FARM-9874', 'Flat 12, Milk Colony, Kankipadu', 'NTR District', 'Kankipadu'),
(4, 6, 'AP-FARM-9875', 'Plot 88, Canal Road, Chebrolu', 'Guntur', 'Chebrolu'),
(5, 7, 'AP-FARM-9876', 'Door 9-3, Church Street, Ponnur', 'Guntur', 'Ponnur');

-- Seed Bookings
INSERT INTO bookings (id, farmer_id, centre_id, crop_id, quantity, booking_date, slot_start, slot_end, token_number, status) VALUES
(1, 1, 1, 1, 25.40, '2026-08-28', '10:30 AM', '11:00 AM', 127, 'WAITING'),
(2, 2, 1, 1, 18.50, '2026-08-28', '09:00 AM', '09:30 AM', 113, 'IN_PROGRESS'),
(3, 3, 2, 2, 40.00, '2026-08-28', '09:30 AM', '10:00 AM', 114, 'ARRIVED'),
(4, 4, 1, 4, 15.00, '2026-08-28', '10:00 AM', '10:30 AM', 115, 'WAITING'),
(5, 5, 3, 5, 30.00, '2026-08-25', '09:00 AM', '09:30 AM', 101, 'COMPLETED');

-- Seed Queue Tokens
INSERT INTO queue_tokens (id, booking_id, token_number, queue_position, estimated_wait_time, status) VALUES
(1, 1, 127, 13, 45, 'WAITING'),
(2, 2, 113, 0, 0, 'IN_PROGRESS'),
(3, 3, 114, 1, 5, 'ARRIVED'),
(4, 4, 115, 2, 8, 'WAITING'),
(5, 5, 101, 0, 0, 'COMPLETED');

-- Seed Procurement Records
INSERT INTO procurement_records (id, booking_id, actual_quantity, quality_grade, moisture, procurement_price, total_amount, status) VALUES
(1, 1, 25.40, 'GRADE_A', 12.50, 2369.00, 60152.60, 'COMPLETED'),
(2, 5, 30.00, 'GRADE_A', 11.80, 6377.00, 191310.00, 'COMPLETED');

-- Seed Payments
INSERT INTO payments (id, procurement_id, amount, status, transaction_id) VALUES
(1, 1, 60152.60, 'PROCESSING', 'SP20260828127'),
(2, 2, 191310.00, 'PAID', 'SP20260825101');

-- Seed Notifications
INSERT INTO notifications (id, user_id, title, message, type, read) VALUES
(1, 1, 'Booking Confirmed', 'Your procurement slot #127 at Guntur Agricultural Procurement Centre has been confirmed for 28 August 2026 (10:30 AM).', 'BOOKING', false),
(2, 1, 'Queue Update', 'Your token #127 is approaching. 13 farmers are ahead of you. Estimated wait time: 45 mins.', 'QUEUE', false),
(3, 1, 'Procurement Verified', 'Quality check passed for 25.4 Quintals of Paddy. Grade A assigned.', 'PROCUREMENT', true);
