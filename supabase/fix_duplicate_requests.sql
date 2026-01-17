-- 1. Remove duplicate requests (Keep the first one)
delete from match_requests
where id in (
        select id
        from (
                select id,
                    row_number() over (
                        partition by match_id,
                        requesting_team_id
                        order by created_at asc
                    ) as rnum
                from match_requests
            ) t
        where t.rnum > 1
    );
-- 2. Add Unique Constraint so it never happens again
alter table match_requests
add constraint match_requests_unique_team_per_match unique (match_id, requesting_team_id);