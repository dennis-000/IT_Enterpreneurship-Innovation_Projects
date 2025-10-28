/*
  # Fountain Gate Academy Database Schema

  ## Overview
  Creates tables for managing school website content including news posts, events, 
  gallery items, and admission inquiries.

  ## New Tables
  
  ### `news_posts`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `content` (text) - Post content
  - `excerpt` (text) - Short summary for listings
  - `image_url` (text) - Featured image URL
  - `published_date` (date) - Publication date
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `events`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `event_date` (date) - Date of the event
  - `location` (text) - Event location
  - `image_url` (text) - Event image URL
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `gallery_items`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Item title
  - `media_url` (text) - URL to photo or video
  - `media_type` (text) - Either 'photo' or 'video'
  - `category` (text) - Category for grouping
  - `created_at` (timestamptz) - Record creation timestamp
  
  ### `admission_inquiries`
  - `id` (uuid, primary key) - Unique identifier
  - `parent_name` (text) - Parent/guardian name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `student_name` (text) - Prospective student name
  - `student_age` (text) - Student age
  - `grade_level` (text) - Desired grade level (Creche/Primary/JHS)
  - `message` (text) - Additional message
  - `status` (text) - Inquiry status (default: 'pending')
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for news_posts, events, and gallery_items
  - Authenticated write access for content tables
  - Public insert access for admission_inquiries
  - Only authenticated users can view admission inquiries
*/

-- Create news_posts table
CREATE TABLE IF NOT EXISTS news_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  image_url text,
  published_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published news posts"
  ON news_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert news posts"
  ON news_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news posts"
  ON news_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news posts"
  ON news_posts FOR DELETE
  TO authenticated
  USING (true);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  location text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update events"
  ON events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete events"
  ON events FOR DELETE
  TO authenticated
  USING (true);

-- Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('photo', 'video')),
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery items"
  ON gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert gallery items"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery items"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery items"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (true);

-- Create admission_inquiries table
CREATE TABLE IF NOT EXISTS admission_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  student_name text NOT NULL,
  student_age text NOT NULL,
  grade_level text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admission_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit admission inquiries"
  ON admission_inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view admission inquiries"
  ON admission_inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inquiry status"
  ON admission_inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_news_posts_published_date ON news_posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_admission_inquiries_created_at ON admission_inquiries(created_at DESC);