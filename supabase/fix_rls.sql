-- Fix RLS Policies for Matches, Requests, and Chat
-- 1. MATCHES: Allow team owners to create matches
create policy "Enable insert for matches" on matches for
insert with check (
        exists (
            select 1
            from teams
            where teams.id = team_creator_id
                and teams.owner_id = auth.uid()
        )
    );
-- Allow match creator to update/delete (e.g. cancel)
create policy "Enable update for matches" on matches for
update using (
        exists (
            select 1
            from teams
            where teams.id = team_creator_id
                and teams.owner_id = auth.uid()
        )
    );
-- 2. MATCH REQUESTS: Allow other teams to request to join
create policy "Enable insert for match_requests" on match_requests for
insert with check (
        exists (
            select 1
            from teams
            where teams.id = requesting_team_id
                and teams.owner_id = auth.uid()
        )
    );
-- Allow match owner (team creator) to update status (accept/decline)
create policy "Enable update for match_requests" on match_requests for
update using (
        exists (
            select 1
            from matches
                join teams on matches.team_creator_id = teams.id
            where matches.id = match_requests.match_id
                and teams.owner_id = auth.uid()
        )
    );
-- 3. MESSAGES: Allow participants to send messages
create policy "Enable insert for messages" on messages for
insert with check (auth.uid() = sender_id);
-- 4. FOOTBALL FIELDS: Allow owners to add fields
create policy "Enable insert for football_fields" on football_fields for
insert with check (auth.uid() = owner_id);