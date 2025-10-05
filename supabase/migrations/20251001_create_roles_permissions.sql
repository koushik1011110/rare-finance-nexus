-- Create roles and permissions schema
-- Tables: roles, role_permissions
-- roles: id (pk), name (unique), label
-- role_permissions: id, role_id (fk), menu text, feature text nullable, allowed boolean

create extension if not exists pgcrypto;

create table if not exists roles (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  label text
);

create table if not exists role_permissions (
  id uuid default gen_random_uuid() primary key,
  role_id uuid references roles(id) on delete cascade,
  menu text not null,
  feature text,
  allowed boolean default true,
  created_at timestamptz default now()
);

-- Seed common roles if not exists
insert into roles (name, label)
select r.name, r.label from (values
  ('admin','Administrator'),
  ('agent','Agent'),
  ('hostel_team','Hostel Team'),
  ('finance','Finance'),
  ('staff','Staff'),
  ('office','Office'),
  ('office_user','Office User')
) as r(name,label)
where not exists (select 1 from roles where name = r.name);
