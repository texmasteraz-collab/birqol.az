-- Fix Missing Opponent Link
-- The "Accept" action previously failed to link the opponent because of permissions.
-- This script finds the accepted request and forces the link.
update matches
set status = 'confirmed',
    opponent_team_id = (
        select requesting_team_id
        from match_requests
        where match_requests.match_id = matches.id
            and match_requests.status = 'accepted'
        limit 1
    )
where id = '4dd707e8-1166-40f5-bbd9-65507b56ff53';
-- Using the ID from your screenshot to be specific
-- Verify the fix
select id,
    status,
    team_creator_id,
    opponent_team_id
from matches
where id = '4dd707e8-1166-40f5-bbd9-65507b56ff53';