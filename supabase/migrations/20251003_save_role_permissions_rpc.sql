-- RPC to save role permissions atomically and bypass RLS via SECURITY DEFINER
-- Creates/updates function: public.save_role_permissions(uuid, jsonb)
-- Params:
--   p_role_id: role id (uuid)
--   p_permissions: jsonb array of objects [{ menu, feature, allowed }]

create extension if not exists pgcrypto;

create or replace function public.save_role_permissions(
  p_role_id uuid,
  p_permissions jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Remove existing permissions for the role
  delete from public.role_permissions where role_id = p_role_id;

  -- Insert new permissions if provided
  if p_permissions is not null and jsonb_typeof(p_permissions) = 'array' and jsonb_array_length(p_permissions) > 0 then
    insert into public.role_permissions (role_id, menu, feature, allowed)
    select
      p_role_id,
      (elem->>'menu')::text,
      nullif(elem->>'feature','')::text,
      coalesce((elem->>'allowed')::boolean, true)
    from jsonb_array_elements(p_permissions) as elem;
  end if;
end;
$$;

-- Allow anon/authenticated to call this function (the function runs with definer privileges)
grant execute on function public.save_role_permissions(uuid, jsonb) to anon, authenticated;
