-- Debug Chat Configuration
-- Replace 'MATCH_ID_HERE' with the ID from the URL if running manually. 
-- For now, I'll select the most recent confirmed match.
with recent_match as (
    select *
    from matches
    where status = 'confirmed'
    order by created_at desc
    limit 1
)
select m.id as match_id,
    m.status,
    m.team_creator_id,
    m.opponent_team_id,
    t1.owner_id as creator_owner_id,
    t2.owner_id as opponent_owner_id,
    (
        select count(*)
        from messages
        where match_id = m.id
    ) as message_count
from recent_match m
    left join teams t1 on m.team_creator_id = t1.id
    left join teams t2 on m.opponent_team_id = t2.id;
-- Also show the last 5 messages for context
select match_id,
    sender_id,
    message,
    created_at
from messages
order by created_at desc
limit 5;