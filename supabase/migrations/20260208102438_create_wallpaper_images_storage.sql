/*
  # Create Supabase Storage Bucket for Wallpaper Images

  1. Storage Setup
    - Create a new storage bucket 'wallpaper-images' for storing user background images
    - Enable public access for the bucket (needed for wallpaper URLs to work)
    - Set file size limits and allowed MIME types

  2. Security
    - Add RLS policies to allow authenticated users to upload their own images
    - Allow public read access for generated wallpapers to work via URLs
    - Prevent unauthorized deletions

  3. Changes
    - Creates storage bucket with proper configuration
    - Adds upload policy for authenticated users
    - Adds public read access policy
    - Adds delete policy for image owners
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'wallpaper-images',
  'wallpaper-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'wallpaper-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Public read access for wallpaper images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'wallpaper-images');

CREATE POLICY "Users can delete their own images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'wallpaper-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'wallpaper-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
