alter table public.orders
  add column if not exists cancelled_at timestamptz;

create or replace function public.cancel_order(p_order_id uuid)
returns setof public.orders
language sql
security definer
set search_path = ''
as $$
  update public.orders as target
  set cancelled_at = now()
  where target.id = p_order_id
    and target.user_id = (select auth.uid())
    and target.cancelled_at is null
    and target.created_at > now() - interval '25 seconds'
  returning target.*;
$$;

revoke all on function public.cancel_order(uuid) from public, anon;
grant execute on function public.cancel_order(uuid) to authenticated;