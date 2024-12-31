/*
  # Add image support to reviews

  1. Changes
    - Add `image_url` column to reviews table
    - Add storage bucket for review images
    - Update policies for image uploads

  2. Security
    - Enable public access to review images bucket
    - Allow public uploads to review images bucket
*/

-- Add image_url to reviews
ALTER TABLE reviews ADD COLUMN image_url text;

-- Create a bucket for review images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review-images', 'review-images', true);

-- Allow public access to review images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'review-images');

-- Allow public uploads to review images
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'review-images');