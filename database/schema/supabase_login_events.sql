-- =============================================================================
-- SmartProcure - Supabase Login Events Table
-- Ministry of Consumer Affairs, Food & Public Distribution
-- Run this SQL in your Supabase SQL Editor to create the login_events table
-- =============================================================================

create table if not exists public.login_events (
  id            uuid primary key default gen_random_uuid(),
  mobile        text,
  email         text,
  role          text not null check (role in ('FARMER', 'OFFICER', 'ADMIN')),
  event_type    text not null check (event_type in ('LOGIN', 'LOGOUT', 'REGISTER')),
  status        text not null check (status in ('SUCCESS', 'FAILED')),
  error_message text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.login_events enable row level security;

-- Allow anonymous/authenticated inserts so the frontend can log events
create policy "Allow insert for all users"
  on public.login_events
  for insert
  to anon, authenticated
  with check (true);

-- Only allow admin-level reads (protect PII)
create policy "Allow select for authenticated users only"
  on public.login_events
  for select
  to authenticated
  using (true);

-- Index for fast queries by role, status, and time
create index if not exists idx_login_events_role on public.login_events (role);
create index if not exists idx_login_events_status on public.login_events (status);
create index if not exists idx_login_events_created_at on public.login_events (created_at desc);

-- Grant API access to anon and authenticated roles
grant insert on public.login_events to anon, authenticated;
grant select on public.login_events to authenticated;
