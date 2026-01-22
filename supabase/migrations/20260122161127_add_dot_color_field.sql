/*
  # Add dot color field

  1. Changes
    - Add `dot_color` column to store custom dot color
  
  2. Notes
    - This column is optional (defaults to NULL for default orange color)
    - Stores hex color values like '#ff6b35'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'dot_color'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN dot_color text;
  END IF;
END $$;