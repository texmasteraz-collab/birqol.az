-- 1. Force remove all data from public tables (This cleans up the blockers)
truncate table public.ratings cascade;
truncate table public.football_fields cascade;
truncate table public.messages cascade;
truncate table public.match_requests cascade;
truncate table public.matches cascade;
truncate table public.teams cascade;
truncate table public.users cascade;
-- 2. Modify the users table to allow deletion from Auth to cascade to Public profile
alter table public.users drop constraint if exists users_id_fkey,
    add constraint users_id_fkey foreign key (id) references auth.users(id) on delete cascade;