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
