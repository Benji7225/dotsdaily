/*
  # Add custom theme fields

  1. Changes
    - Add `theme_type` column to store theme type (dark, light, custom, image)
    - Add `custom_color` column to store custom background color
    - Add `background_image` column to store background image data URL
  
  2. Notes
    - These columns are optional to maintain backward compatibility
    - theme_type defaults to matching the theme column for existing records
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'theme_type'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN theme_type text DEFAULT 'dark';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'custom_color'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN custom_color text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'background_image'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN background_image text;
  END IF;
END $$;