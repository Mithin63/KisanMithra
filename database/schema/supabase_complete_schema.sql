-- =============================================================================
-- SmartProcure - Complete Supabase Database Schema & Seed Script (Enhanced)
-- Ministry of Consumer Affairs, Food & Public Distribution
-- 
-- Run this complete script in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dvllgekdtbhjjvznybcb/sql/new
-- =============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Enums if they do not exist
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('FARMER', 'OFFICER', 'ADMIN');
  end if;
  if not exists (select 1 from pg_type where typname = 'booking_status') then
    create type booking_status as enum ('WAITING', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
  end if;
  if not exists (select 1 from pg_type where typname = 'centre_status') then
    create type centre_status as enum ('NORMAL', 'HIGH_LOAD', 'OVERLOADED');
  end if;
  if not exists (select 1 from pg_type where typname = 'quality_grade') then
    create type quality_grade as enum ('GRADE_A', 'GRADE_B', 'GRADE_C', 'REJECTED');
  end if;
  if not exists (select 1 from pg_type where typname = 'payment_status') then
    create type payment_status as enum ('PENDING', 'PROCESSING', 'PAID', 'FAILED');
  end if;
  if not exists (select 1 from pg_type where typname = 'notification_type') then
    create type notification_type as enum ('BOOKING', 'QUEUE', 'PROCUREMENT', 'PAYMENT', 'SYSTEM');
  end if;
end$$;

-- 2. Drop existing tables in reverse dependency order for clean setup
drop table if exists public.login_events cascade;
drop table if exists public.notifications cascade;
drop table if exists public.payments cascade;
drop table if exists public.procurement_records cascade;
drop table if exists public.queue_tokens cascade;
drop table if exists public.bookings cascade;
drop table if exists public.procurement_centres cascade;
drop table if exists public.crops cascade;
drop table if exists public.farmers cascade;
drop table if exists public.users cascade;

-- =============================================================================
-- Table Definitions
-- =============================================================================

-- 1. Users Table
create table public.users (
    id serial primary key,
    name varchar(150) not null,
    mobile varchar(15) unique not null,
    email varchar(150) unique,
    password_hash varchar(255) not null default '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte',
    role user_role not null default 'FARMER',
    created_at timestamp with time zone default current_timestamp
);

-- 2. Farmers Table
create table public.farmers (
    id serial primary key,
    user_id int not null references public.users(id) on delete cascade,
    farmer_id varchar(50) unique not null,
    address text not null,
    district varchar(100) not null,
    village varchar(100) not null,
    latitude decimal(10, 7) default 16.3067,
    longitude decimal(10, 7) default 80.4365,
    created_at timestamp with time zone default current_timestamp
);

-- 3. Crops Table (27+ Crops with Categories, MSP & Moisture Limits)
create table public.crops (
    id serial primary key,
    name varchar(100) not null,
    variety varchar(100) not null,
    msp_price_per_quintal decimal(10, 2) not null default 2300.00,
    category varchar(50) default 'CEREALS',
    max_moisture decimal(5, 2) default 12.00,
    season varchar(50) default 'KHARIF',
    icon varchar(20) default '🌾'
);

-- 4. Procurement Centres Table (Multi-State & District Yards)
create table public.procurement_centres (
    id serial primary key,
    name varchar(200) not null,
    district varchar(100) not null,
    state varchar(100) default 'Andhra Pradesh',
    address text not null,
    latitude decimal(10, 7) not null,
    longitude decimal(10, 7) not null,
    daily_capacity int not null default 500,
    active_counters int not null default 4,
    status centre_status not null default 'NORMAL',
    avg_processing_mins int not null default 4,
    contact_phone varchar(50)
);

-- 5. Bookings Table (Multi-Crop & Location Support)
create table public.bookings (
    id serial primary key,
    farmer_id int not null references public.farmers(id) on delete cascade,
    centre_id int not null references public.procurement_centres(id) on delete cascade,
    crop_id int not null references public.crops(id) on delete cascade,
    quantity decimal(10, 2) not null,
    total_valuation decimal(14, 2) default 0.00,
    crop_items jsonb default '[]'::jsonb,
    booking_date date not null,
    slot_start varchar(10) not null,
    slot_end varchar(10) not null,
    token_number int not null,
    status booking_status not null default 'WAITING',
    created_at timestamp with time zone default current_timestamp
);

-- 6. Queue Tokens Table
create table public.queue_tokens (
    id serial primary key,
    booking_id int not null references public.bookings(id) on delete cascade,
    token_number int not null,
    queue_position int not null,
    estimated_wait_time int not null,
    status booking_status not null default 'WAITING',
    updated_at timestamp with time zone default current_timestamp
);

-- 7. Procurement Records Table
create table public.procurement_records (
    id serial primary key,
    booking_id int not null references public.bookings(id) on delete cascade,
    actual_quantity decimal(10, 2) not null,
    quality_grade quality_grade not null default 'GRADE_A',
    moisture decimal(5, 2) not null,
    procurement_price decimal(10, 2) not null,
    total_amount decimal(12, 2) not null,
    status varchar(50) not null default 'COMPLETED',
    completed_at timestamp with time zone default current_timestamp
);

-- 8. Payments Table
create table public.payments (
    id serial primary key,
    procurement_id int not null references public.procurement_records(id) on delete cascade,
    amount decimal(12, 2) not null,
    status payment_status not null default 'PROCESSING',
    transaction_id varchar(100) unique not null,
    payment_date timestamp with time zone default current_timestamp
);

-- 9. Notifications Table
create table public.notifications (
    id serial primary key,
    user_id int not null references public.users(id) on delete cascade,
    title varchar(200) not null,
    message text not null,
    type notification_type not null default 'SYSTEM',
    read boolean not null default false,
    created_at timestamp with time zone default current_timestamp
);

-- 10. Login / Authentication Events Table
create table public.login_events (
    id uuid primary key default gen_random_uuid(),
    mobile text,
    email text,
    role text not null check (role in ('FARMER', 'OFFICER', 'ADMIN')),
    event_type text not null check (event_type in ('LOGIN', 'LOGOUT', 'REGISTER')),
    status text not null check (status in ('SUCCESS', 'FAILED')),
    error_message text,
    user_agent text,
    created_at timestamptz not null default now()
);

-- =============================================================================
-- Row Level Security (RLS) & Public Access Policies
-- =============================================================================

alter table public.users enable row level security;
alter table public.farmers enable row level security;
alter table public.crops enable row level security;
alter table public.procurement_centres enable row level security;
alter table public.bookings enable row level security;
alter table public.queue_tokens enable row level security;
alter table public.procurement_records enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.login_events enable row level security;

-- Open policies for Web Application
create policy "Allow all on users" on public.users for all to anon, authenticated using (true) with check (true);
create policy "Allow all on farmers" on public.farmers for all to anon, authenticated using (true) with check (true);
create policy "Allow all on crops" on public.crops for all to anon, authenticated using (true) with check (true);
create policy "Allow all on centres" on public.procurement_centres for all to anon, authenticated using (true) with check (true);
create policy "Allow all on bookings" on public.bookings for all to anon, authenticated using (true) with check (true);
create policy "Allow all on queue_tokens" on public.queue_tokens for all to anon, authenticated using (true) with check (true);
create policy "Allow all on procurement_records" on public.procurement_records for all to anon, authenticated using (true) with check (true);
create policy "Allow all on payments" on public.payments for all to anon, authenticated using (true) with check (true);
create policy "Allow all on notifications" on public.notifications for all to anon, authenticated using (true) with check (true);
create policy "Allow all on login_events" on public.login_events for all to anon, authenticated using (true) with check (true);

-- Grant privileges to Supabase API roles
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- =============================================================================
-- Performance Indexes
-- =============================================================================

create index if not exists idx_users_mobile on public.users(mobile);
create index if not exists idx_crops_category on public.crops(category);
create index if not exists idx_centres_district on public.procurement_centres(district);
create index if not exists idx_bookings_centre_date on public.bookings(centre_id, booking_date);
create index if not exists idx_bookings_farmer on public.bookings(farmer_id);
create index if not exists idx_queue_tokens_booking on public.queue_tokens(booking_id);
create index if not exists idx_procurement_booking on public.procurement_records(booking_id);
create index if not exists idx_notifications_user on public.notifications(user_id);
create index if not exists idx_login_events_created on public.login_events(created_at desc);

-- =============================================================================
-- Rich Agricultural Dataset (27+ Crops & 16 Multi-State Centres)
-- =============================================================================

-- Seed 27 Major Indian Crops
insert into public.crops (id, name, variety, msp_price_per_quintal, category, max_moisture, season, icon) values
(1, 'Paddy (Common)', 'Sona Masoori Grade A', 2300.00, 'CEREALS', 14.0, 'KHARIF', '🌾'),
(2, 'Paddy (Grade A)', 'BPT 5204 (Samba Mahsuri)', 2369.00, 'CEREALS', 13.5, 'KHARIF', '🌾'),
(3, 'Basmati Rice', 'Pusa 1121 Premium', 3850.00, 'CEREALS', 12.0, 'KHARIF', '🍚'),
(4, 'Wheat (Common)', 'HD 2967 High Yield', 2275.00, 'CEREALS', 12.0, 'RABI', '🌾'),
(5, 'Wheat (Sharbati)', 'Sehore Premium Golden', 2850.00, 'CEREALS', 11.5, 'RABI', '🌾'),
(6, 'Maize (Corn)', 'Hybrid Yellow Special', 2090.00, 'CEREALS', 14.0, 'KHARIF', '🌽'),
(7, 'Jowar (Sorghum)', 'Hybrid CSH-16', 3180.00, 'CEREALS', 12.0, 'KHARIF', '🌾'),
(8, 'Bajra (Pearl Millet)', 'Hybrid Pioneer 86M38', 2500.00, 'CEREALS', 12.5, 'KHARIF', '🌾'),
(9, 'Ragi (Finger Millet)', 'GPU 28 Nutrient Rich', 3846.00, 'CEREALS', 12.0, 'KHARIF', '🌾'),
(10, 'Barley (Jau)', 'RD 2552 Malt Grade', 1850.00, 'CEREALS', 12.0, 'RABI', '🌾'),
(11, 'Gram / Chana (Desi)', 'JG 11 Bold Seed', 5440.00, 'PULSES', 10.0, 'RABI', '🧆'),
(12, 'Gram / Chana (Kabuli)', 'Dollar Giant Seed', 6200.00, 'PULSES', 9.5, 'RABI', '🧆'),
(13, 'Tur / Arhar (Red Gram)', 'Asha ICPL 87119', 7000.00, 'PULSES', 10.0, 'KHARIF', '🌱'),
(14, 'Moong (Green Gram)', 'IPM 02-03 Shiny', 8558.00, 'PULSES', 9.0, 'KHARIF', '🌱'),
(15, 'Urad (Black Gram)', 'PU 31 LBG 752', 6950.00, 'PULSES', 10.0, 'KHARIF', '🌱'),
(16, 'Masoor (Lentil)', 'KLS 218 Large Red', 6425.00, 'PULSES', 10.0, 'RABI', '🌱'),
(17, 'Groundnut (Peanut)', 'Bold-50 High Oil', 6377.00, 'OILSEEDS', 8.0, 'KHARIF', '🥜'),
(18, 'Soybean', 'JS 335 Yellow Premium', 4600.00, 'OILSEEDS', 10.0, 'KHARIF', '🫘'),
(19, 'Mustard / Rapeseed', 'Pusa Bold High Erucic', 5650.00, 'OILSEEDS', 8.0, 'RABI', '🌻'),
(20, 'Sunflower Seed', 'KBSH 44 Hybrid', 6760.00, 'OILSEEDS', 9.0, 'KHARIF', '🌻'),
(21, 'Sesamum (Til)', 'Swetha White Premium', 8635.00, 'OILSEEDS', 7.0, 'KHARIF', '🌱'),
(22, 'Cotton (Medium Staple)', 'MCU 5 Good Grade', 6620.00, 'COMMERCIAL', 8.5, 'KHARIF', '🧶'),
(23, 'Cotton (Long Staple)', 'DCH 32 Extra Long Super', 7020.00, 'COMMERCIAL', 8.0, 'KHARIF', '🧶'),
(24, 'Sugarcane (FRP)', 'Co 0238 High Recovery', 340.00, 'COMMERCIAL', 70.0, 'ALL_SEASON', '🎋'),
(25, 'Raw Jute', 'TD 5 Premium Fibre', 5050.00, 'COMMERCIAL', 18.0, 'KHARIF', '🌾'),
(26, 'Red Chilli (Guntur Teja)', 'Teja S17 Export Quality', 19500.00, 'SPICES', 10.0, 'RABI', '🌶️'),
(27, 'Turmeric (Haldi)', 'Salem Yellow Curcumin 5%', 11200.00, 'SPICES', 10.0, 'RABI', '🪴');

-- Seed 16 Regional Procurement Centres across States
insert into public.procurement_centres (id, name, district, state, address, latitude, longitude, daily_capacity, active_counters, status, avg_processing_mins, contact_phone) values
(1, 'Guntur Agricultural Procurement Centre', 'Guntur', 'Andhra Pradesh', 'NH-16 Bypass, Market Yard, Guntur, AP - 522001', 16.3067, 80.4365, 500, 5, 'NORMAL', 4, '0863-2234567'),
(2, 'Vijayawada Multi-Commodity Hub', 'NTR District', 'Andhra Pradesh', 'PNS Bus Stand Road, Auto Nagar, Vijayawada, AP - 520007', 16.5062, 80.6480, 450, 4, 'HIGH_LOAD', 4, '0866-2456789'),
(3, 'Tenali Agricultural Yard Centre', 'Guntur', 'Andhra Pradesh', 'Bose Road, Agricultural Market, Tenali, AP - 522201', 16.2430, 80.6400, 350, 3, 'NORMAL', 5, '08644-223344'),
(4, 'Bapatla Coastal Grain Hub', 'Bapatla', 'Andhra Pradesh', 'Karlapalem Road, Market Yard, Bapatla, AP - 522101', 15.9042, 80.4674, 300, 3, 'NORMAL', 4, '08643-221100'),
(5, 'Narasaraopet Regional Grain Depot', 'Palnadu', 'Andhra Pradesh', 'Kotappakonda Road, Narasaraopet, AP - 522601', 16.2354, 80.0487, 400, 4, 'OVERLOADED', 6, '08647-245566'),
(6, 'Kurnool Mega Cotton & Pulse Yard', 'Kurnool', 'Andhra Pradesh', 'Bellary Road, Agricultural Yard, Kurnool, AP - 518003', 15.8281, 78.0373, 600, 6, 'NORMAL', 4, '08518-234567'),
(7, 'Rajahmundry Godavari Paddy Depot', 'East Godavari', 'Andhra Pradesh', 'Morampudi Junction, Rajahmundry, AP - 533107', 17.0005, 81.8040, 550, 5, 'NORMAL', 4, '0883-2478900'),
(8, 'Eluru Central Rice & Maize Yard', 'Eluru', 'Andhra Pradesh', 'Sanivarapupeta, Market Road, Eluru, AP - 534003', 16.7107, 81.0952, 400, 4, 'NORMAL', 5, '08812-230987'),
(9, 'Anantapur Groundnut Special Centre', 'Anantapur', 'Andhra Pradesh', 'NH-44 Bypass, Industrial Area, Anantapur, AP - 515004', 14.6819, 77.6006, 450, 4, 'HIGH_LOAD', 5, '08554-276543'),
(10, 'Nellore Coastal Paddy Hub', 'SPSR Nellore', 'Andhra Pradesh', 'Podalakur Road, APMC Yard, Nellore, AP - 524004', 14.4426, 79.9865, 500, 5, 'NORMAL', 4, '0861-2334455'),
(11, 'Warangal Mega Cotton & Grain Yard', 'Warangal', 'Telangana', 'Enumamula Market Yard, Warangal, TS - 506006', 17.9689, 79.5941, 700, 7, 'HIGH_LOAD', 4, '0870-2443322'),
(12, 'Nizamabad Turmeric & Maize Hub', 'Nizamabad', 'Telangana', 'Dichpally Road, Nizamabad, TS - 503002', 18.6725, 78.0941, 450, 4, 'NORMAL', 5, '08462-234567'),
(13, 'Khammam Chilli & Cotton Market Depot', 'Khammam', 'Telangana', 'Wyra Road, APMC Complex, Khammam, TS - 507002', 17.2473, 80.1514, 500, 5, 'NORMAL', 4, '08742-225588'),
(14, 'Indore Central Grain & Soybean Yard', 'Indore', 'Madhya Pradesh', 'Chhawani Mandi, Indore, MP - 452001', 22.7196, 75.8577, 800, 8, 'NORMAL', 4, '0731-2456789'),
(15, 'Ludhiana Granary & Wheat Procurement Yard', 'Ludhiana', 'Punjab', 'GT Road, Grain Market, Ludhiana, PB - 141003', 30.9010, 75.8573, 900, 9, 'NORMAL', 3, '0161-2789012'),
(16, 'Karnal Basmati & Wheat Special Yard', 'Karnal', 'Haryana', 'New Anaj Mandi, Karnal, HR - 132001', 29.6857, 76.9905, 750, 7, 'NORMAL', 4, '0184-2233445');

-- Seed Users
insert into public.users (id, name, mobile, email, password_hash, role) values
(1, 'Ravi Kumar', '9876543210', 'ravi.kumar@farmer.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'FARMER'),
(2, 'Officer Anitha', '9876543211', 'anitha.officer@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'OFFICER'),
(3, 'Dr. K. S. Sharma', '9876543212', 'admin.sharma@gov.in', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQOEg6L7h8x6vA9uT9vte', 'ADMIN');

-- Seed Farmers
insert into public.farmers (id, user_id, farmer_id, address, district, village, latitude, longitude) values
(1, 1, 'AP-FARM-9872', 'Door 4-12, Main Street, Pedakakani', 'Guntur', 'Pedakakani', 16.3350, 80.4920);

-- Seed Bookings with Multi-Crop Support
insert into public.bookings (id, farmer_id, centre_id, crop_id, quantity, total_valuation, crop_items, booking_date, slot_start, slot_end, token_number, status) values
(1, 1, 1, 2, 35.40, 83862.60, '[{"crop_id":2,"crop_name":"Paddy (Grade A)","variety":"BPT 5204","quantity":25.40,"msp_price":2369.00,"total_amount":60172.60},{"crop_id":26,"crop_name":"Red Chilli (Guntur Teja)","variety":"Teja S17","quantity":10.00,"msp_price":19500.00,"total_amount":195000.00}]'::jsonb, '2026-08-28', '10:30 AM', '11:00 AM', 127, 'WAITING');

-- Seed Queue Tokens
insert into public.queue_tokens (id, booking_id, token_number, queue_position, estimated_wait_time, status) values
(1, 1, 127, 13, 45, 'WAITING');

-- Seed Procurement Records
insert into public.procurement_records (id, booking_id, actual_quantity, quality_grade, moisture, procurement_price, total_amount, status) values
(1, 1, 25.40, 'GRADE_A', 12.50, 2369.00, 60152.60, 'COMPLETED');

-- Seed Payments
insert into public.payments (id, procurement_id, amount, status, transaction_id) values
(1, 1, 60152.60, 'PROCESSING', 'SP20260828127');

-- Seed Notifications
insert into public.notifications (id, user_id, title, message, type, read) values
(1, 1, 'Booking Confirmed', 'Your procurement slot #127 at Guntur Agricultural Procurement Centre has been confirmed for 28 August 2026 (10:30 AM).', 'BOOKING', false);

-- Sequence Auto-Increment resets
select setval('users_id_seq', (select coalesce(max(id), 1) from public.users));
select setval('farmers_id_seq', (select coalesce(max(id), 1) from public.farmers));
select setval('crops_id_seq', (select coalesce(max(id), 1) from public.crops));
select setval('procurement_centres_id_seq', (select coalesce(max(id), 1) from public.procurement_centres));
select setval('bookings_id_seq', (select coalesce(max(id), 1) from public.bookings));
select setval('queue_tokens_id_seq', (select coalesce(max(id), 1) from public.queue_tokens));
select setval('procurement_records_id_seq', (select coalesce(max(id), 1) from public.procurement_records));
select setval('payments_id_seq', (select coalesce(max(id), 1) from public.payments));
select setval('notifications_id_seq', (select coalesce(max(id), 1) from public.notifications));
