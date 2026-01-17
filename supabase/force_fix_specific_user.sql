-- Force Fix Specific User 97cb
-- The previous error said this ID was missing. We will FORCE it in.
-- 1. Check existence in AUTH (just for info)
select id,
    email
from auth.users
where id = '97cb3058-1eec-4b8b-bcad-908b64c5a8f4';
-- 2. FORCE INSERT into PUBLIC.USERS
-- We use "ON CONFLICT DO UPDATE" to be safe.
insert into public.users (id, name, role)
values (
        '97cb3058-1eec-4b8b-bcad-908b64c5a8f4',
        -- The ID from the error message
        'Recovered User',
        -- Fallback name
        'player'
    ) on conflict (id) do nothing;
-- 3. Check opponent owner too (just in case)
-- (You provided screenshots earlier, but let's be safe)
-- ID: 38550ead... team -> owner? 
-- Let's just fix the one we know is broken first.
-- 4. Verify it exists now
select *
from public.users
where id = '97cb3058-1eec-4b8b-bcad-908b64c5a8f4';