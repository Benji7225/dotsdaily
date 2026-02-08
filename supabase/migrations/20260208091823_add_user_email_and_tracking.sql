/*
  # Add user email and usage tracking to wallpaper configs

  1. New Columns
    - `user_email` (text) - Email of the user who created the config for easy identification
    - `last_accessed_at` (timestamptz) - Last time the wallpaper was accessed/generated
    
  2. Purpose
    - `user_email`: Makes it easy to identify config ownership in database queries
    - `last_accessed_at`: Helps detect inactive automations (e.g., user removed shortcut)
    
  3. Notes
    - Email is populated when config is created
    - last_accessed_at is updated each time wallpaper is generated
    - Helps identify users who haven't accessed their wallpaper in 7+ days
*/

-- Add user_email column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'user_email'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN user_email text;
  END IF;
END $$;

-- Add last_accessed_at column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'last_accessed_at'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN last_accessed_at timestamptz;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_wallpaper_configs_user_email ON wallpaper_configs(user_email);
CREATE INDEX IF NOT EXISTS idx_wallpaper_configs_last_accessed ON wallpaper_configs(last_accessed_at);