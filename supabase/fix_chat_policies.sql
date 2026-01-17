-- Fix Chat Permissions (RLS)
-- 1. Enable INSERT on messages for Match Participants
-- Participants are the owners of the 'team_creator_id' OR 'opponent_team_id'
create policy "Participants can insert messages" on messages for
insert with check (
        auth.uid() = sender_id
        and exists (
            select 1
            from matches
                left join teams as t_creator on matches.team_creator_id = t_creator.id
                left join teams as t_opponent on matches.opponent_team_id = t_opponent.id
            where matches.id = messages.match_id
                and (
                    t_creator.owner_id = auth.uid()
                    or t_opponent.owner_id = auth.uid()
                )
        )
    );
-- 2. Ensure SELECT is also robust (Double check)
drop policy if exists "Participants can read messages" on messages;
create policy "Participants can read messages" on messages for
select using (
        exists (
            select 1
            from matches
                left join teams as t_creator on matches.team_creator_id = t_creator.id
                left join teams as t_opponent on matches.opponent_team_id = t_opponent.id
            where matches.id = messages.match_id
                and (
                    t_creator.owner_id = auth.uid()
                    or t_opponent.owner_id = auth.uid()
                )
        )
    );
-- 3. Allow Match Requests Update (Accept/Decline) for Match Owners
-- The owner of the match should be able to update requests sent to their match
create policy "Match owner can update requests" on match_requests for
update using (
        exists (
            select 1
            from matches
                join teams on matches.team_creator_id = teams.id
            where matches.id = match_requests.match_id
                and teams.owner_id = auth.uid()
        )
    );