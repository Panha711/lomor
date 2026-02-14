-- Run this in Supabase: SQL Editor → New query → paste and run
-- This creates tables so your data persists when you deploy on Vercel.

-- Clothes table (matches ClothingItem)
create table if not exists public.clothes (
  id text primary key,
  name text not null,
  type text not null,
  size text not null,
  color text not null,
  price numeric not null default 0,
  price_old numeric,
  quantity integer not null default 0,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sales table (matches Sale; items stored as JSONB)
create table if not exists public.sales (
  id text primary key,
  items jsonb not null default '[]',
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Allow client access (anon key) for Vercel deployment
alter table public.clothes enable row level security;
alter table public.sales enable row level security;

create policy "Allow all on clothes"
  on public.clothes for all
  using (true)
  with check (true);

create policy "Allow all on sales"
  on public.sales for all
  using (true)
  with check (true);
