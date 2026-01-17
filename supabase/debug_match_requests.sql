-- Inspect requests and current participants for the problematic match
select m.id as match_id,
    m.created_at,
    m.team_creator_id,
    creator_team.name as creator_team_name,
    creator_team.owner_id as creator_owner_id,
    m.opponent_team_id,
    opp_team.name as opp_team_name,
    opp_team.owner_id as opp_owner_id
from matches m
    left join teams creator_team on m.team_creator_id = creator_team.id
    left join teams opp_team on m.opponent_team_id = opp_team.id
where m.id = '4dd707e8-1166-40f5-bbd9-65507b56ff53';
-- Check all requests for this match
select mr.id as request_id,
    mr.status,
    mr.requesting_team_id,
    t.name as requesting_team_name,
    t.owner_id as requesting_owner_id
from match_requests mr
    join teams t on mr.requesting_team_id = t.id
where mr.match_id = '4dd707e8-1166-40f5-bbd9-65507b56ff53';