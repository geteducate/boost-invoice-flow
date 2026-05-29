-- BoostProfits: leads table
-- Run this in the Supabase SQL editor or via `supabase db push`

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  source      text default 'booking_cta',
  created_at  timestamptz default now()
);

-- Index for quick email lookups
create index if not exists leads_email_idx on public.leads (email);

-- Enable Row Level Security
alter table public.leads enable row level security;

-- Allow anonymous inserts only (no reads from client)
create policy "Allow anon insert"
  on public.leads
  for insert
  to anon
  with check (true);

-- Only authenticated service role can read leads (use in your admin dashboard)
create policy "Service role can read"
  on public.leads
  for select
  to service_role
  using (true);
