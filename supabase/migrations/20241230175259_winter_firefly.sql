/*
  # Create venues and reviews tables

  1. New Tables
    - `venues`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `address` (text)
      - `type` (text)
      - `created_at` (timestamp)
    - `reviews`
      - `id` (uuid, primary key)
      - `venue_id` (uuid, foreign key)
      - `rating` (integer)
      - `comment` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Public read access for venues
    - Public create access for reviews
*/

-- Create venues table
CREATE TABLE venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  address text NOT NULL,
  type text NOT NULL CHECK (type IN ('bar', 'brewery')),
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid REFERENCES venues(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Venues policies (public read)
CREATE POLICY "Allow public read access"
  ON venues
  FOR SELECT
  TO public
  USING (true);

-- Reviews policies (public read and create)
CREATE POLICY "Allow public read access"
  ON reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public create access"
  ON reviews
  FOR INSERT
  TO public
  WITH CHECK (true);