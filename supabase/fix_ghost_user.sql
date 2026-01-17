-- Fix Ghost User
-- If you signed up but the "Trigger" failed, you exist in Auth but not in Public.
-- This script manually copies YOU (and any other missing users) into the public table.
insert into public.users (id, name, phone, role)
select id,
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'phone',
    coalesce(raw_user_meta_data->>'role', 'player')
from auth.users
where id not in (
        select id
        from public.users
    );
-- Verify the fix:
select count(*) as missing_users_fixed
from public.users;