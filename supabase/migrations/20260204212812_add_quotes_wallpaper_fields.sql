/*
  # Add quotes wallpaper support

  1. Changes
    - Add `wallpaper_type` column to support 'dots' or 'quotes' wallpaper type
    - Add `quote_mode` column for quote selection mode (short, star, custom)
    - Add `quote_text_color` column for text color (black or white)
    - Add `custom_quotes` column to store custom quotes array
    - Set default wallpaper_type to 'dots' for backward compatibility

  2. Notes
    - Existing records will default to 'dots' wallpaper type
    - Quote mode defaults to 'short' for quotes wallpapers
    - Text color defaults to 'white'
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'wallpaper_type'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN wallpaper_type text DEFAULT 'dots' NOT NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'quote_mode'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN quote_mode text DEFAULT 'short';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'quote_text_color'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN quote_text_color text DEFAULT 'white';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'custom_quotes'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN custom_quotes text[];
  END IF;
END $$;
