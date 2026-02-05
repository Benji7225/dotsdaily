/*
  # Add quote categories field

  1. Changes
    - Add `quote_categories` column to support category-based quote selection
    - Stores an array of selected category keys (discipline, self_respect, confidence, calm, heartbreak, love, ambition, gym, focus, memento_mori)

  2. Notes
    - Users can select one or multiple categories
    - If null or empty, all categories are used by default
    - Custom quotes take precedence over category selection
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'quote_categories'
  ) THEN
    ALTER TABLE wallpaper_configs ADD COLUMN quote_categories text[];
  END IF;
END $$;