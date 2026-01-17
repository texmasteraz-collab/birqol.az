-- Function to handle new user signup
create or replace function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = public as $$ begin
insert into public.users (id, name, phone, role)
values (
        new.id,
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'phone',
        new.raw_user_meta_data->>'role'
    );
return new;
end;
$$;
-- Trigger to call the function on new auth.users insert
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();