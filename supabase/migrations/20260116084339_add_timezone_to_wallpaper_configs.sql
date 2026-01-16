/*
  # Add timezone support to wallpaper configurations

  1. Changes
    - Add `timezone` column to `wallpaper_configs` table
    - Default value is 'UTC'
    - This will be used to calculate cache expiration until midnight in user's timezone

  2. Notes
    - Timezone format: IANA timezone identifier (e.g., 'America/New_York', 'Europe/Paris')
    - Used for intelligent cache control headers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'timezone'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN timezone text DEFAULT 'UTC';
  END IF;
END $$;