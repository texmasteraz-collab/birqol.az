-- Fix Missing READ Permissions (SELECT Policies)
-- 1. MATCH REQUESTS: Allow users to see requests they sent OR requests for their matches
create policy "Enable read for match_requests" on match_requests for
select using (
        exists (
            select 1
            from teams
            where teams.id = match_requests.requesting_team_id
                and teams.owner_id = auth.uid()
        )
        OR exists (
            select 1
            from matches
                join teams on matches.team_creator_id = teams.id
            where matches.id = match_requests.match_id
                and teams.owner_id = auth.uid()
        )
    );
-- 2. MESSAGES: Allow participants to read messages
create policy "Enable read for messages" on messages for
select using (
        exists (
            select 1
            from matches
                join teams on matches.team_creator_id = teams.id
            where matches.id = messages.match_id
                and (
                    teams.owner_id = auth.uid() -- I am the owner
                    OR exists (
                        -- I am the opponent
                        select 1
                        from teams op_team
                        where op_team.id = matches.opponent_team_id
                            and op_team.owner_id = auth.uid()
                    )
                )
        )
    );