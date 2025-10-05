-- Ensure role_permissions has the expected schema (role_id column and defaults)

-- Add missing columns if they don't exist
alter table if exists public.role_permissions
  add column if not exists role_id uuid,
  add column if not exists menu text,
  add column if not exists feature text,
  add column if not exists allowed boolean default true;

-- Try migrate data from a legacy column named "role" to "role_id" if present and formatted like uuid
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'role_permissions' and column_name = 'role'
  ) then
    -- Only update rows where legacy role looks like a uuid and role_id is currently null
    update public.role_permissions
      set role_id = (case when role ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then role::uuid else role_id end)
    where role_id is null;
  end if;
end
$$;

-- Add the foreign key constraint if it doesn't exist
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints tc
    where tc.table_schema = 'public'
      and tc.table_name = 'role_permissions'
      and tc.constraint_type = 'FOREIGN KEY'
      and tc.constraint_name = 'role_permissions_role_id_fkey'
  ) then
    alter table public.role_permissions
      add constraint role_permissions_role_id_fkey
      foreign key (role_id) references public.roles(id) on delete cascade;
  end if;
end
$$;
