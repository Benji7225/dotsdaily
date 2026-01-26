/*
  # Add language field to wallpaper_configs

  1. Changes
    - Add `language` column to `wallpaper_configs` table (defaults to 'en')
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'language'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN language text DEFAULT 'en';
  END IF;
END $$;