-- WARNING: This script will DELETE existing data in 'works' and 'case_studies' tables.

-- Drop tables and all their dependents (policies, keys, etc.)
-- This avoids "relation does not exist" errors when trying to drop policies individually
DROP TABLE IF EXISTS case_studies CASCADE;
DROP TABLE IF EXISTS works CASCADE;

-- Create Works Table
create table works (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  heading text,
  subheading text,
  preview_image text,
  background_color text default '#000000',
  background_image text,
  background_video text,
  background_blur integer default 0,
  tags text[]
);

-- Create Case Studies Table
create table case_studies (
  id uuid references works(id) on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  content jsonb,
  metadata jsonb
);

-- Enable Row Level Security (RLS)
alter table works enable row level security;
alter table case_studies enable row level security;

-- Create Policies
create policy "Public works are viewable by everyone"
  on works for select
  using ( true );

create policy "Authenticated users can modify works"
  on works for all
  using ( auth.role() = 'authenticated' );

create policy "Public case studies are viewable by everyone"
  on case_studies for select
  using ( true );

create policy "Authenticated users can modify case studies"
  on case_studies for all
  using ( auth.role() = 'authenticated' );

-- Storage Buckets (Idempotent)
insert into storage.buckets (id, name, public)
values ('work-assets', 'work-assets', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('case-study-images', 'case-study-images', true)
on conflict (id) do nothing;

-- Storage Policies
-- We can safely drop these because storage.objects always exists in Supabase
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id in ('work-assets', 'case-study-images') );

drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload"
  on storage.objects for insert
  with check ( auth.role() = 'authenticated' );

drop policy if exists "Auth Update" on storage.objects;
create policy "Auth Update"
  on storage.objects for update
  with check ( auth.role() = 'authenticated' );

drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete"
  on storage.objects for delete
  using ( auth.role() = 'authenticated' );
