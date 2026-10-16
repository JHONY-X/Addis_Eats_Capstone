do $$
declare
  affected_profiles integer;
begin
  insert into public.profiles (id, full_name, role)
  select
    id,
    coalesce(
      nullif(raw_user_meta_data ->> 'full_name', ''),
      nullif(raw_user_meta_data ->> 'name', ''),
      split_part(email, '@', 1),
      'Customer'
    ),
    'staff'
  from auth.users
  where lower(email) = lower('johnyjon1221@gmail.com')
  on conflict (id) do update
  set role = 'staff';

  get diagnostics affected_profiles = row_count;

  if affected_profiles <> 1 then
    raise exception 'No Supabase Auth user found for johnyjon1221@gmail.com. Create that user under Authentication > Users first.';
  end if;
end;
$$;