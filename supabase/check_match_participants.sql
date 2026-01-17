-- Check if opponent is set for the specific match
select id as match_id,
    status,
    team_creator_id,
    opponent_team_id
from matches
where id = '4dd707e8-1166-40f5-bbd9-65507b56ff53';
-- Also check if the current user (you) owns one of these teams
-- (We can't filter by 'auth.uid()' here directly in basic SQL editor easily without knowing your ID, 
-- but this will show us the team IDs).
select id,
    name,
    owner_id
from teams
where id in (
        select team_creator_id
        from matches
        where id = '4dd707e8-1166-40f5-bbd9-65507b56ff53'
        union
        select opponent_team_id
        from matches
        where id = '4dd707e8-1166-40f5-bbd9-65507b56ff53'
    );