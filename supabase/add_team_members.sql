-- 1. Create team_members table
create table if not exists team_members (
    id uuid default gen_random_uuid() primary key,
    team_id uuid references teams(id) on delete cascade not null,
    user_id uuid references users(id) on delete cascade not null,
    role text check (role in ('captain', 'member')) default 'member',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(team_id, user_id)
);
-- 2. RLS Policies
-- Enable RLS
alter table team_members enable row level security;
-- Policy: Everyone can view members (Public Roster)
create policy "Public read team_members" on team_members for
select using (true);
-- Policy: Team Owners (Captains) can add members
-- Note: We check if the auth user is the owner of the team being added to
create policy "Captains can add members" on team_members for
insert with check (
        exists (
            select 1
            from teams
            where teams.id = team_members.team_id
                and teams.owner_id = auth.uid()
        )
    );
-- Policy: Captains can remove members
create policy "Captains can remove members" on team_members for delete using (
    exists (
        select 1
        from teams
        where teams.id = team_members.team_id
            and teams.owner_id = auth.uid()
    )
);
-- Policy: Users can remove themselves (Leave Team)
create policy "Users can leave team" on team_members for delete using (auth.uid() = user_id);