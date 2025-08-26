-- Create an admin user (you'll need to sign up first, then run this with your user ID)
-- Replace 'your-user-id-here' with the actual UUID from auth.users after signing up

-- Example: UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@example.com';
-- This script should be run after creating your admin account

-- You can also create a function to promote users to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE email = user_email;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Usage: SELECT promote_to_admin('your-email@example.com');
