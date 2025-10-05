-- Add a permissions jsonb column to roles to store role permissions inline
-- This avoids dependence on role_permissions table schema variations

alter table if exists public.roles
  add column if not exists permissions jsonb not null default '[]'::jsonb;

-- Ensure existing rows have a json array (not null)
update public.roles set permissions = '[]'::jsonb where permissions is null;
