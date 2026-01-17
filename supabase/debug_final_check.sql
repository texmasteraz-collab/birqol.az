-- Final Debug Check
-- 1. Who owns the teams?
select id,
    name,
    owner_id
from teams
where id in (
        '02cbdf63-31cf-4882-a411-603cd37b3753',
        '38550ead-b62a-42dc-b011-8283da93a2bd'
    );
-- 2. Are there messages for this match?
select count(*) as message_count,
    max(created_at) as last_message
from messages
where match_id = 'ac4c8390-8562-4fd0-85b2-9188cf0ac51c';
-- 3. Who is the current user? (This will be NULL if run in SQL editor, but serves as a reminder)
-- select auth.uid();