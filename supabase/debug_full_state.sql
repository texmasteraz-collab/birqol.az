-- Full System State Check
-- Run this to see EXACTLY what is in your database.
-- 1. List ALL Users (Latest first)
select 'USERS' as table_name,
    id,
    name,
    created_at
from users
order by created_at desc
limit 5;
-- 2. List ALL Teams (Latest first)
select 'TEAMS' as table_name,
    id,
    name,
    owner_id
from teams
order by created_at desc
limit 5;
-- 3. Show Latest Match and its Connections
-- If "creator_team_name" or "opponent_team_name" is NULL, that team does NOT exist.
select 'MATCH' as table_name,
    m.id as match_id,
    m.status,
    m.team_creator_id,
    t1.name as creator_team_name,
    -- Will be NULL if team missing
    m.opponent_team_id,
    t2.name as opponent_team_name -- Will be NULL if team missing
from matches m
    left join teams t1 on m.team_creator_id = t1.id
    left join teams t2 on m.opponent_team_id = t2.id
order by m.created_at desc
limit 1;