-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES
-- Stores user identity, linked strictly to Firebase Auth UID
create table public.profiles (
  firebase_uid text primary key,
  email text not null,
  name text,
  photo_url text,
  role text default 'user', -- 'user', 'admin'
  fcm_token text,
  -- Academic Info
  phone text,
  faculty text,
  academic_term text,
  courses text[], -- Array of course codes e.g. ['CS101', 'MATH202']
  whatsapp_number text,
  bio text,
  profile_completed boolean default false,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS: Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- REPLACE ALL auth.uid() with (auth.jwt() ->> 'sub')

create policy "Users can update their own profile"
  on profiles for update
  using ( (auth.jwt() ->> 'sub') = firebase_uid );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( (auth.jwt() ->> 'sub') = firebase_uid );

-- 2. COURSES
create policy "Admins can manage courses"
  on courses for all
  using ( 
    exists (select 1 from profiles where firebase_uid = (auth.jwt() ->> 'sub') and role = 'admin')
  );

-- 3. TEAMS
create policy "Users can create teams"
  on teams for insert
  with check ( (auth.jwt() ->> 'sub') = created_by );

create policy "Team owners can update their teams"
  on teams for update
  using ( (auth.jwt() ->> 'sub') = created_by );

-- 4. TEAM MEMBERS
create policy "Users can join (create pending membership)"
  on team_members for insert
  with check ( (auth.jwt() ->> 'sub') = user_id );

create policy "Team leaders can updatem emberships"
  on team_members for update
  using ( 
    exists (
      select 1 from teams 
      where id = team_members.team_id 
      and created_by = (auth.jwt() ->> 'sub')
    )
  );

-- 5. NOTIFICATIONS
create policy "Users can view own notifications"
  on notifications for select
  using ( (auth.jwt() ->> 'sub') = user_id );

create policy "Users can update own notifications (mark read)"
  on notifications for update
  using ( (auth.jwt() ->> 'sub') = user_id );

-- 6. NOTIFICATION SETTINGS
create policy "Users can view own settings" 
  on notification_settings for select 
  using ( (auth.jwt() ->> 'sub') = user_id );

create policy "Users can update own settings" 
  on notification_settings for update 
  using ( (auth.jwt() ->> 'sub') = user_id );

create policy "Users can insert own settings" 
  on notification_settings for insert 
  with check ( (auth.jwt() ->> 'sub') = user_id );

-- 7. ADMIN BROADCASTS
create policy "Admins can manage broadcasts"
  on admin_broadcasts for all
  using ( 
    exists (select 1 from profiles where firebase_uid = (auth.jwt() ->> 'sub') and role = 'admin')
  );

-- 8. RATINGS
create policy "Users can create ratings"
  on ratings for insert
  with check ( (auth.jwt() ->> 'sub') = rater_id );
