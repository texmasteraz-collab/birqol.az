-- 1. DROP THE FAILING TRIGGER
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;
-- 2. UPDATE RLS TO ALLOW INSERT
-- Allow a user to insert their own row into the 'users' table
create policy "Enable insert for users based on user_id" on public.users for
insert with check (auth.uid() = id);
-- Allow a user to update their own row (if needed later)
create policy "Enable update for users based on user_id" on public.users for
update using (auth.uid() = id);
-- Ensure public read is still there
drop policy if exists "Public read users" on users;
create policy "Public read users" on users for
select using (true);