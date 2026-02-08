/*
  # Add background_image_url field to wallpaper_configs

  1. Changes
    - Add new column `background_image_url` (text, nullable) to store Supabase Storage URLs
    - This will gradually replace the `background_image` base64 field for better performance
    - The base64 field will remain for backwards compatibility during transition

  2. Performance Impact
    - Storage URLs are much smaller than base64 data (~100 bytes vs 1-10MB)
    - This will eliminate statement timeout errors when loading configs
    - Dramatically improves API response times for wallpaper generation
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'background_image_url'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN background_image_url text;
  END IF;
END $$;
