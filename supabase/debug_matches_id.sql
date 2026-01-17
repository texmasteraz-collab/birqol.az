-- Check column types for matches table
select column_name,
    data_type,
    udt_name
from information_schema.columns
where table_name = 'matches'
    and column_name = 'id';
-- Check actual ID values
select id,
    id::text
from matches
order by created_at desc
limit 5;