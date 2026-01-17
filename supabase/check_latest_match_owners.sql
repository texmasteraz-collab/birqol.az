-- check_latest_match_owners.sql
-- Run this to see EXACTLY who is allowed to chat in the latest match.
select m.id as match_id,
    m.status,
    t1.name as creator_team,
    t1.owner_id as creator_owner_id,
    u1.name as creator_name,
    t2.name as opponent_team,
    t2.owner_id as opponent_owner_id,
    u2.name as opponent_name
from matches m
    join teams t1 on m.team_creator_id = t1.id
    join teams t2 on m.opponent_team_id = t2.id
    left join users u1 on t1.owner_id = u1.id
    left join users u2 on t2.owner_id = u2.id
where m.id = 'ac4c8390-8562-4fd0-85b2-9188cf0ac51c';