-- Fix Phantom Opponent
-- The match is linked to a team that has been deleted or doesn't exist.
-- We will try to find ANOTHER valid team to link as the opponent.
do $$
declare v_new_opponent_id uuid;
begin -- 1. Find a valid team that is NOT the creator team
select id into v_new_opponent_id
from teams
where id != '02cbdf63-31cf-4882-a411-603cd37b3753' -- The creator team
limit 1;
-- 2. If we found one, update the match
if v_new_opponent_id is not null then
update matches
set opponent_team_id = v_new_opponent_id
where id = 'ac4c8390-8562-4fd0-85b2-9188cf0ac51c';
raise notice 'Fixed! Linked match to team %',
v_new_opponent_id;
else raise exception 'Could not find any other team! Please CREATE a second team first.';
end if;
end $$;