-- Check if the teams actually exist
select *
from teams
where id in (
        '02cbdf63-31cf-4882-a411-603cd37b3753',
        -- Creator Team ID from prev screenshot
        '38550ead-b62a-42dc-b011-8283da93a2bd' -- Opponent Team ID from prev screenshot
    );