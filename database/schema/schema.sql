-- =============================================================================
-- SmartProcure - PostgreSQL Database Schema
-- Ministry of Consumer Affairs, Food & Public Distribution
-- =============================================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS procurement_records CASCADE;
DROP TABLE IF EXISTS queue_tokens CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS procurement_centres CASCADE;
DROP TABLE IF EXISTS crops CASCADE;
DROP TABLE IF EXISTS farmers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Enum Types
CREATE TYPE user_role AS ENUM ('FARMER', 'OFFICER', 'ADMIN');
CREATE TYPE booking_status AS ENUM ('WAITING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE centre_status AS ENUM ('NORMAL', 'HIGH_LOAD', 'OVERLOADED');
CREATE TYPE quality_grade AS ENUM ('GRADE_A', 'GRADE_B', 'GRADE_C', 'REJECTED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED');
CREATE TYPE notification_type AS ENUM ('BOOKING', 'QUEUE', 'PROCUREMENT', 'PAYMENT', 'SYSTEM');

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'FARMER',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Farmers Table
CREATE TABLE farmers (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farmer_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. AP-FARM-9872
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    village VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Crops Table
CREATE TABLE crops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- e.g. Paddy, Wheat, Maize, Cotton, Groundnut
    variety VARCHAR(100) NOT NULL, -- e.g. Sona Masoori, Sharbati, Hybrid Yellow
    msp_price_per_quintal DECIMAL(10, 2) NOT NULL DEFAULT 2300.00
);

-- 4. Procurement Centres Table
CREATE TABLE procurement_centres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    daily_capacity INT NOT NULL DEFAULT 500,
    active_counters INT NOT NULL DEFAULT 4,
    status centre_status NOT NULL DEFAULT 'NORMAL',
    avg_processing_mins INT NOT NULL DEFAULT 4
);

-- 5. Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    farmer_id INT NOT NULL REFERENCES farmers(id) ON DELETE CASCADE,
    centre_id INT NOT NULL REFERENCES procurement_centres(id) ON DELETE CASCADE,
    crop_id INT NOT NULL REFERENCES crops(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL, -- in Quintals
    booking_date DATE NOT NULL,
    slot_start VARCHAR(10) NOT NULL, -- e.g. '10:30 AM'
    slot_end VARCHAR(10) NOT NULL,   -- e.g. '11:00 AM'
    token_number INT NOT NULL,      -- e.g. 127
    status booking_status NOT NULL DEFAULT 'WAITING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Queue Tokens Table
CREATE TABLE queue_tokens (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    token_number INT NOT NULL,
    queue_position INT NOT NULL,
    estimated_wait_time INT NOT NULL, -- in minutes
    status booking_status NOT NULL DEFAULT 'WAITING',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Procurement Records Table
CREATE TABLE procurement_records (
    id SERIAL PRIMARY KEY,
    booking_id INT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    actual_quantity DECIMAL(10, 2) NOT NULL,
    quality_grade quality_grade NOT NULL DEFAULT 'GRADE_A',
    moisture DECIMAL(5, 2) NOT NULL, -- percentage e.g. 12.5
    procurement_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payments Table
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    procurement_id INT NOT NULL REFERENCES procurement_records(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    status payment_status NOT NULL DEFAULT 'PROCESSING',
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL DEFAULT 'SYSTEM',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_users_mobile ON users(mobile);
CREATE INDEX idx_bookings_centre_date ON bookings(centre_id, booking_date);
CREATE INDEX idx_bookings_farmer ON bookings(farmer_id);
CREATE INDEX idx_queue_tokens_booking ON queue_tokens(booking_id);
CREATE INDEX idx_procurement_booking ON procurement_records(booking_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
