-- Create role permissions table
CREATE TABLE public.role_permissions (
  id SERIAL PRIMARY KEY,
  role user_role NOT NULL,
  menu_item TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(role, menu_item)
);

-- Enable RLS
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies - only admin can manage role permissions
CREATE POLICY "Admins can manage role permissions" ON public.role_permissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM user_sessions us
    JOIN users u ON us.user_id = u.id
    WHERE us.token = current_setting('app.session_token', true)
    AND us.expires_at > NOW()
    AND u.role = 'admin'
  )
);

-- Insert default permissions for all roles and menu items
INSERT INTO public.role_permissions (role, menu_item, is_enabled) VALUES
-- Admin permissions (all enabled by default)
('admin', 'dashboard', true),
('admin', 'students', true),
('admin', 'agents', true),
('admin', 'universities', true),
('admin', 'invoices', true),
('admin', 'hostels', true),
('admin', 'mess', true),
('admin', 'office', true),
('admin', 'staff', true),
('admin', 'reports', true),
('admin', 'settings', true),
('admin', 'rbac', true),

-- Agent permissions (limited by default)
('agent', 'dashboard', true),
('agent', 'students', true),
('agent', 'agents', false),
('agent', 'universities', true),
('agent', 'invoices', false),
('agent', 'hostels', false),
('agent', 'mess', false),
('agent', 'office', false),
('agent', 'staff', false),
('agent', 'reports', false),
('agent', 'settings', false),
('agent', 'rbac', false),

-- Staff permissions
('staff', 'dashboard', true),
('staff', 'students', true),
('staff', 'agents', false),
('staff', 'universities', true),
('staff', 'invoices', false),
('staff', 'hostels', true),
('staff', 'mess', true),
('staff', 'office', true),
('staff', 'staff', false),
('staff', 'reports', true),
('staff', 'settings', false),
('staff', 'rbac', false),

-- Finance permissions
('finance', 'dashboard', true),
('finance', 'students', true),
('finance', 'agents', false),
('finance', 'universities', false),
('finance', 'invoices', true),
('finance', 'hostels', false),
('finance', 'mess', false),
('finance', 'office', true),
('finance', 'staff', false),
('finance', 'reports', true),
('finance', 'settings', false),
('finance', 'rbac', false),

-- Hostel team permissions
('hostel_team', 'dashboard', true),
('hostel_team', 'students', true),
('hostel_team', 'agents', false),
('hostel_team', 'universities', false),
('hostel_team', 'invoices', false),
('hostel_team', 'hostels', true),
('hostel_team', 'mess', true),
('hostel_team', 'office', false),
('hostel_team', 'staff', false),
('hostel_team', 'reports', false),
('hostel_team', 'settings', false),
('hostel_team', 'rbac', false);

-- Create function to get role permissions
CREATE OR REPLACE FUNCTION public.get_role_permissions(user_role_param user_role)
RETURNS TABLE(menu_item TEXT, is_enabled BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT rp.menu_item, rp.is_enabled
  FROM public.role_permissions rp
  WHERE rp.role = user_role_param;
END;
$$;

-- Create function to update role permission
CREATE OR REPLACE FUNCTION public.update_role_permission(
  user_role_param user_role,
  menu_item_param TEXT,
  is_enabled_param BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.role_permissions (role, menu_item, is_enabled)
  VALUES (user_role_param, menu_item_param, is_enabled_param)
  ON CONFLICT (role, menu_item)
  DO UPDATE SET
    is_enabled = is_enabled_param,
    updated_at = NOW();
END;
$$;