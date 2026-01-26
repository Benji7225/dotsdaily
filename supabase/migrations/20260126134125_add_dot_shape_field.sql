/*
  # Add dot_shape field to wallpaper_configs

  1. Changes
    - Add `dot_shape` column to `wallpaper_configs` table
      - Type: text with check constraint for allowed values
      - Default: 'circle'
      - Allowed values: 'circle', 'square', 'heart'

  2. Notes
    - Square and heart shapes are premium features
    - Circle is the default free shape
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'dot_shape'
  ) THEN
    ALTER TABLE wallpaper_configs 
    ADD COLUMN dot_shape text DEFAULT 'circle' CHECK (dot_shape IN ('circle', 'square', 'heart'));
  END IF;
END $$;