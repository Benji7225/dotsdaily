/*
  # Add custom text field

  1. Changes
    - Add `custom_text` column to store custom text displayed next to percentage
  
  2. Notes
    - This column is optional
    - Text will be displayed to the left of the percentage with the current dot color
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'custom_text'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN custom_text text;
  END IF;
END $$;
