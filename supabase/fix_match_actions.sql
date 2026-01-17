-- Fix Match Actions (Edit & Delete)
-- 1. Enable UPDATE for match creators
create policy "Enable update for match owners" on matches for
update using (
        exists (
            select 1
            from teams
            where teams.id = matches.team_creator_id
                and teams.owner_id = auth.uid()
        )
    );
-- 2. Enable DELETE for match creators
create policy "Enable delete for match owners" on matches for delete using (
    exists (
        select 1
        from teams
        where teams.id = matches.team_creator_id
            and teams.owner_id = auth.uid()
    )
);