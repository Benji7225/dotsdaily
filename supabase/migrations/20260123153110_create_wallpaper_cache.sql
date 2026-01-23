/*
  # Create wallpaper cache table

  1. New Tables
    - `wallpaper_cache`
      - `id` (text, primary key) - Composite key: wallpaper_id + date
      - `png_data` (bytea) - Cached PNG image data
      - `expires_at` (timestamptz) - Cache expiration time
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on `wallpaper_cache` table
    - Add policy for anyone to read cached images (public wallpapers)
    - Add policy for system to insert/update cache entries
*/

CREATE TABLE IF NOT EXISTS wallpaper_cache (
  id text PRIMARY KEY,
  png_data bytea NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallpaper_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached wallpapers"
  ON wallpaper_cache
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create cached wallpapers"
  ON wallpaper_cache
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update cached wallpapers"
  ON wallpaper_cache
  FOR UPDATE
  USING (true)
  WITH CHECK (true);