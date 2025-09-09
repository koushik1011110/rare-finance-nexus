-- Clean up and synchronize role permissions with current navigation structure

-- First, let's see what menu items we have that don't match the current navigation
-- and update them to match the proper slugified versions

-- Update inconsistent menu item names to match navigation structure
UPDATE role_permissions SET menu_item = 'hostel_mess' WHERE menu_item IN ('hostels', 'mess');
UPDATE role_permissions SET menu_item = 'invoice' WHERE menu_item = 'invoices';
UPDATE role_permissions SET menu_item = 'leads' WHERE menu_item = 'lead';
UPDATE role_permissions SET menu_item = 'applicants' WHERE menu_item = 'application';

-- Delete any permissions that don't correspond to actual navigation items
DELETE FROM role_permissions WHERE menu_item NOT IN (
  'dashboard', 'leads', 'applicants', 'students', 'agents', 'invoice', 
  'office_expenses', 'hostel_mess', 'accounts', 'document_management', 
  'visa', 'staff', 'universities', 'salary_management', 'personal_expenses', 
  'reports', 'profile', 'settings'
);

-- Ensure all roles have permissions for all current navigation items
-- This will add missing permissions with default values

DO $$
DECLARE
    role_name text;
    menu_item text;
    menu_items text[] := ARRAY[
        'dashboard', 'leads', 'applicants', 'students', 'agents', 'invoice', 
        'office_expenses', 'hostel_mess', 'accounts', 'document_management', 
        'visa', 'staff', 'universities', 'salary_management', 'personal_expenses', 
        'reports', 'profile', 'settings'
    ];
    roles text[] := ARRAY['admin', 'agent', 'staff', 'finance', 'hostel_team'];
    default_enabled boolean;
BEGIN
    FOREACH role_name IN ARRAY roles
    LOOP
        FOREACH menu_item IN ARRAY menu_items
        LOOP
            -- Set default enabled state based on role
            default_enabled := CASE 
                WHEN role_name = 'admin' THEN true
                WHEN role_name = 'agent' AND menu_item IN ('dashboard', 'students', 'profile') THEN true
                WHEN role_name = 'staff' AND menu_item IN ('dashboard', 'students', 'office_expenses') THEN true
                WHEN role_name = 'finance' AND menu_item IN ('dashboard', 'students', 'invoice', 'office_expenses', 'accounts', 'salary_management', 'personal_expenses', 'reports', 'settings') THEN true
                WHEN role_name = 'hostel_team' AND menu_item IN ('dashboard', 'hostel_mess', 'students', 'settings') THEN true
                ELSE false
            END;
            
            -- Insert if not exists
            INSERT INTO role_permissions (role, menu_item, is_enabled) 
            VALUES (role_name::user_role, menu_item, default_enabled)
            ON CONFLICT (role, menu_item) 
            DO NOTHING; -- Don't overwrite existing permissions
        END LOOP;
    END LOOP;
END $$;