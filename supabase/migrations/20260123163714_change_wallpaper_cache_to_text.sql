/*
  # Change wallpaper_cache png_data to text type

  1. Changes
    - Alter png_data column from bytea to text to properly store base64 encoded PNG data
    - This fixes the issue where Supabase JS client couldn't properly insert/retrieve binary data
  
  2. Notes
    - Existing cached data will be cleared as we're changing the data type
    - New data will be stored as base64 text which is fully compatible with Supabase JS
*/

ALTER TABLE wallpaper_cache
ALTER COLUMN png_data TYPE text
USING png_data::text;
