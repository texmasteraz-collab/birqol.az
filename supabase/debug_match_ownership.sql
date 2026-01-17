-- Check Ownership of the teams in the latest match
-- This helps verify if the logged-in user is actually the owner of one of the teams.
select m.id as match_id,
    m.status,
    t1.name as creator_team_name,
    t1.owner_id as creator_owner_id,
    t1.id as creator_team_id,
    t2.name as opponent_team_name,
    t2.owner_id as opponent_owner_id,
    t2.id as opponent_team_id
from matches m
    left join teams t1 on m.team_creator_id = t1.id
    left join teams t2 on m.opponent_team_id = t2.id
where m.id = 'ac4c8390-8562-4fd0-85b2-9188cf0ac51c';
-- ID from your latest screenshot