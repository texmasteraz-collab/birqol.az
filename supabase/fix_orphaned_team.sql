-- Fix Orphaned Team
-- The Team Owner (97cb...) was deleted from Auth, so the team has no valid owner.
-- We must transfer the team to a VALID user (likely YOU, the most recent user).
do $$
declare v_new_owner_id uuid;
begin -- 1. Get the most recent user ID from Auth (This is likely you)
select id into v_new_owner_id
from auth.users
order by created_at desc
limit 1;
if v_new_owner_id is not null then -- 2. Update the Orphaned Team (Creator Team) to this new owner
update teams
set owner_id = v_new_owner_id
where owner_id = '97cb3058-1eec-4b8b-bcad-908b64c5a8f4';
-- The old, deleted ID
-- 3. Also update the Public Users table for this new owner (just in case)
insert into public.users (id, name, role)
select id,
    raw_user_meta_data->>'name',
    'player'
from auth.users
where id = v_new_owner_id on conflict (id) do nothing;
raise notice 'Fixed! Transferred Team ownership to User %',
v_new_owner_id;
else raise exception 'No users found in Auth table!';
end if;
end $$;