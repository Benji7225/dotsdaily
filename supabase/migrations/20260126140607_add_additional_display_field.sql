/*
  # Add additional_display field to wallpaper_configs

  1. Changes
    - Add `additional_display` column to `wallpaper_configs` table
      - Type: text with check constraint for valid values
      - Values: 'percentage', 'timeRemaining', 'none'
      - Default: 'percentage'
      - Nullable: true for backwards compatibility
  
  2. Notes
    - This field controls what additional information is displayed on the wallpaper
    - 'percentage' shows completion percentage (free feature)
    - 'timeRemaining' shows time remaining (premium feature)
    - 'none' shows no additional information
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'wallpaper_configs' AND column_name = 'additional_display'
  ) THEN
    ALTER TABLE wallpaper_configs 
    ADD COLUMN additional_display text 
    CHECK (additional_display IN ('percentage', 'timeRemaining', 'none'));
  END IF;
END $$;