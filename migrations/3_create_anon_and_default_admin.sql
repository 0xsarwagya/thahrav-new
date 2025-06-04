/*
  # Default Users Creation
  
  1. Purpose
    - Creates default anonymous and admin users in the system
    - Only executes if the users table exists in next_auth schema
  
  2. Users Created
    - Anonymous User:
      - ID: 65825bc0-3c5e-4be2-892f-3b9b2da756ab
      - Email: anon@thahrav.shop
      - Admin: false
    
    - Admin User:
      - ID: 65825bc0-3c5e-4be2-892f-3b9b2da756ac
      - Email: admin@thahrav.shop
      - Admin: true
  
  3. Safety
    - Checks for table existence before insertion
    - Uses DO block for transaction safety
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'next_auth' AND table_name = 'users'
  ) THEN
    INSERT INTO next_auth.users (id, email, name, is_admin) 
    VALUES 
      ('65825bc0-3c5e-4be2-892f-3b9b2da756ab', 'anon@thahrav.shop', 'Anonymous User', false),
      ('65825bc0-3c5e-4be2-892f-3b9b2da756ac', 'admin@thahrav.shop', 'Admin User', true);
  END IF;
END$$;