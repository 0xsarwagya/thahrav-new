/*
  # Create address table and link to users

  1. New Tables
    - `address`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to next_auth.users)
      - `line1` (text)
      - `line2` (text, nullable)
      - `state` (text)
      - `country` (text)
      - `zip` (text)
      - `is_default` (boolean)
      - `is_shipping` (boolean)
      - `is_billing` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `address` table
    - Add policies for authenticated users to:
      - Read their own addresses
      - Create new addresses
      - Update their own addresses
      - Delete their own addresses

  3. Constraints
    - Foreign key constraint to next_auth.users
    - Default timestamps for created_at and updated_at
    - NOT NULL constraints on required fields
*/

CREATE TABLE IF NOT EXISTS public.address (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    line1 text NOT NULL,
    line2 text,
    state text NOT NULL,
    country text NOT NULL,
    zip text NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    is_shipping boolean NOT NULL DEFAULT false,
    is_billing boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.address ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own addresses"
    ON public.address
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create addresses"
    ON public.address
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
    ON public.address
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
    ON public.address
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create an index on user_id for better query performance
CREATE INDEX IF NOT EXISTS idx_address_user_id ON public.address(user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_address_updated_at
    BEFORE UPDATE ON public.address
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column(); 