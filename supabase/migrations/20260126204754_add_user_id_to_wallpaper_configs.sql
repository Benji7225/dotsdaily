/*
  # Add user tracking to wallpaper configurations

  1. Changes
    - Add `user_id` column to `wallpaper_configs` table (nullable for backward compatibility)
    - Add foreign key constraint to auth.users
    - Create index for faster user queries
    - Update RLS policies to allow users to view their own configs
    - Keep public access for shared wallpapers

  2. Security
    - Users can view all configs (public sharing)
    - Only authenticated users can create configs with user_id
*/

-- Add user_id column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN user_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wallpaper_configs_user_id ON wallpaper_configs(user_id);

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can read wallpaper configs" ON wallpaper_configs;
DROP POLICY IF EXISTS "Anyone can create wallpaper configs" ON wallpaper_configs;

-- New policies
CREATE POLICY "Anyone can read wallpaper configs"
  ON wallpaper_configs
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create wallpaper configs"
  ON wallpaper_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can create wallpaper configs"
  ON wallpaper_configs
  FOR INSERT
  TO service_role
  WITH CHECK (true);