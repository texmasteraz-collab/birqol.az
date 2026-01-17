-- Check User Integrity
-- Authentication works (you can login), but can you write data?
-- The 'messages' table requires your ID to be in the 'public.users' table.
-- 1. Check if the authenticated user exists in public.users
select au.id as auth_id,
    au.email,
    pu.id as public_id,
    pu.name as public_name
from auth.users au
    left join public.users pu on au.id = pu.id
order by au.created_at desc
limit 5;
-- 2. Check Foreign Key Constraints for Messages
-- This confirms that sender_id MUST exist in users table
select conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(c.oid) as definition
from pg_constraint c
    join pg_namespace n on n.oid = c.connamespace
where n.nspname = 'public'
    and conrelid::regclass::text = 'messages';