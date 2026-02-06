/*
  # Create user_draft_configs table

  1. New Tables
    - `user_draft_configs`
      - `user_id` (uuid, primary key, references auth.users)
      - `config` (jsonb) - stores the entire wallpaper configuration
      - `updated_at` (timestamptz) - last update timestamp
  
  2. Security
    - Enable RLS on `user_draft_configs` table
    - Add policy for users to read their own draft
    - Add policy for users to insert their own draft
    - Add policy for users to update their own draft
*/

CREATE TABLE IF NOT EXISTS user_draft_configs (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  config jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_draft_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own draft"
  ON user_draft_configs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own draft"
  ON user_draft_configs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft"
  ON user_draft_configs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);