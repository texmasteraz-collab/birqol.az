-- Test Chat Connection
-- I am manually inserting a message from the "System".
-- If you see this appear in your chat window instantly, then READING is working.
insert into messages (match_id, sender_id, message)
select id,
    team_creator_id,
    -- Pretend to be the creator for a moment (owner_id lookup needed usually but team_creator_id is a TABLE uuid, not USER uuid. Wait. sender_id must be USER uuid)
    'SYSTEM TEST: Can you see me?'
from matches
where id = 'ac4c8390-8562-4fd0-85b2-9188cf0ac51c';
-- Wait, sender_id must reference public.users(id). 
-- 'team_creator_id' is a team(id). This will fail FK. `matches.team_creator_id` -> `teams.id`.
-- Correct approach: Use the Owner ID we found earlier.
-- '97cb3058-1eec-4b8b-bcad-908b64c5a8f4' was the creator owner ID from previous screenshots.
insert into messages (match_id, sender_id, message)
values (
        'ac4c8390-8562-4fd0-85b2-9188cf0ac51c',
        -- Match ID
        '97cb3058-1eec-4b8b-bcad-908b64c5a8f4',
        -- User ID (Creator)
        'SYSTEM TEST: Can you see this message?'
    );