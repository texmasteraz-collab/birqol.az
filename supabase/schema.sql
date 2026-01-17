-- Users Table
create table users (
    id uuid references auth.users not null primary key,
    name text,
    phone text,
    role text check (
        role in ('team_captain', 'player', 'field_owner')
    ),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Teams Table
create table teams (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    city text not null,
    district text,
    skill_level text,
    match_format text,
    age_range text,
    preferred_days text [],
    preferred_time text,
    description text,
    avatar_url text,
    owner_id uuid references users(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Matches Table
create table matches (
    id uuid default gen_random_uuid() primary key,
    team_creator_id uuid references teams(id) not null,
    opponent_team_id uuid references teams(id),
    date date not null,
    time time not null,
    district text,
    format text,
    field_type text check (field_type in ('paid', 'free')),
    status text check (
        status in ('searching', 'confirmed', 'cancelled')
    ) default 'searching',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Match Requests Table
create table match_requests (
    id uuid default gen_random_uuid() primary key,
    match_id uuid references matches(id) not null,
    requesting_team_id uuid references teams(id) not null,
    status text check (status in ('pending', 'accepted', 'declined')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Chat Messages Table
create table messages (
    id uuid default gen_random_uuid() primary key,
    match_id uuid references matches(id) not null,
    sender_id uuid references users(id) not null,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Football Fields Table
create table football_fields (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    location text not null,
    district text,
    price numeric,
    available_slots jsonb,
    owner_id uuid references users(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Ratings Table
create table ratings (
    id uuid default gen_random_uuid() primary key,
    match_id uuid references matches(id) not null,
    rated_team_id uuid references teams(id) not null,
    rater_team_id uuid references teams(id) not null,
    punctuality integer check (
        punctuality between 1 and 5
    ),
    fair_play integer check (
        fair_play between 1 and 5
    ),
    communication integer check (
        communication between 1 and 5
    ),
    comment text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- RLS Policies (Basic Setup)
alter table users enable row level security;
alter table teams enable row level security;
alter table matches enable row level security;
alter table match_requests enable row level security;
alter table messages enable row level security;
alter table football_fields enable row level security;
alter table ratings enable row level security;
-- Public read for now (refine later)
create policy "Public read users" on users for
select using (true);
create policy "Public read teams" on teams for
select using (true);
create policy "Public read matches" on matches for
select using (true);
create policy "Public read fields" on football_fields for
select using (true);
-- Authenticated insert/update
create policy "Auth insert teams" on teams for
insert with check (auth.uid() = owner_id);
create policy "Auth update teams" on teams for
update using (auth.uid() = owner_id);