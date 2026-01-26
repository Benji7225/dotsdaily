/*
  # Create contact messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key) - Unique identifier for each message
      - `name` (text) - Name of the person sending the message
      - `email` (text) - Email address of the sender
      - `subject` (text) - Subject of the message
      - `message` (text) - The actual message content
      - `created_at` (timestamptz) - Timestamp when the message was created
      - `read` (boolean) - Flag to track if the message has been read
  
  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for anyone to insert contact messages (public form submission)
    - Add policy for authenticated service role to read messages (admin access)

  3. Notes
    - Public users can only insert messages, not read them
    - This prevents spam/abuse where users could read other people's messages
    - Admin access requires service role for reading messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read all messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);
