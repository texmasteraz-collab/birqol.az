-- Check the ABSOLUTE latest match created
select id,
    status,
    created_at,
    team_creator_id,
    opponent_team_id
from matches
order by created_at desc
limit 1;