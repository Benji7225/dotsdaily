/*
  # Create wallpaper configurations table

  1. New Tables
    - `wallpaper_configs`
      - `id` (text, primary key) - Short unique ID for the wallpaper
      - `mode` (text) - year, month, life, or countdown
      - `granularity` (text) - day, week, month, or year
      - `grouping` (text) - none, week, month, quarter, or year
      - `theme` (text) - dark or light
      - `target_date` (date) - Target date for countdown mode
      - `start_date` (date) - Start date for countdown mode
      - `birth_date` (date) - Birth date for life mode
      - `life_expectancy` (int) - Life expectancy for life mode
      - `width` (int) - Screen width
      - `height` (int) - Screen height
      - `safe_top` (int) - Safe area top
      - `safe_bottom` (int) - Safe area bottom
      - `safe_left` (int) - Safe area left
      - `safe_right` (int) - Safe area right
      - `created_at` (timestamptz) - Creation timestamp
      
  2. Security
    - Enable RLS on `wallpaper_configs` table
    - Add policy for anyone to read configurations (public wallpapers)
    - Add policy for anyone to insert configurations (no auth required)
*/

CREATE TABLE IF NOT EXISTS wallpaper_configs (
  id text PRIMARY KEY,
  mode text NOT NULL,
  granularity text NOT NULL,
  grouping text DEFAULT 'none',
  theme text DEFAULT 'dark',
  target_date date,
  start_date date,
  birth_date date,
  life_expectancy int,
  width int NOT NULL,
  height int NOT NULL,
  safe_top int NOT NULL,
  safe_bottom int NOT NULL,
  safe_left int NOT NULL,
  safe_right int NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wallpaper_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read wallpaper configs"
  ON wallpaper_configs
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create wallpaper configs"
  ON wallpaper_configs
  FOR INSERT
  WITH CHECK (true);