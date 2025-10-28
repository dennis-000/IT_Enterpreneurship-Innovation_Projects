-- =====================================================
-- FOUNTAIN GATE ACADEMY - COMPLETE DATABASE SCHEMA
-- All tables needed for the admin portal
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CONTACT INQUIRIES
-- =====================================================
CREATE TABLE contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_inquiries(status);
CREATE INDEX idx_contact_created ON contact_inquiries(created_at DESC);

-- =====================================================
-- 2. ADMISSION INQUIRIES
-- =====================================================
CREATE TABLE admission_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_age TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'enrolled')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admission_status ON admission_inquiries(status);
CREATE INDEX idx_admission_created ON admission_inquiries(created_at DESC);

-- =====================================================
-- 3. NEWS POSTS
-- =====================================================
CREATE TABLE news_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    published_date DATE NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_news_published ON news_posts(published_date DESC);
CREATE INDEX idx_news_featured ON news_posts(is_featured);

-- =====================================================
-- 4. EVENTS
-- =====================================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_date TIMESTAMP NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_events_date ON events(event_date DESC);
CREATE INDEX idx_events_featured ON events(is_featured);

-- =====================================================
-- 5. GALLERY ITEMS
-- =====================================================
CREATE TABLE gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    media_url TEXT NOT NULL,
    media_type TEXT CHECK (media_type IN ('image', 'video')),
    category TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_gallery_category ON gallery_items(category);
CREATE INDEX idx_gallery_created ON gallery_items(created_at DESC);

-- =====================================================
-- 6. STAFF MEMBERS
-- =====================================================
CREATE TABLE staff_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    image_url TEXT,
    bio TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_staff_order ON staff_members(order_index);

-- =====================================================
-- 7. ACADEMIC PROGRAMS
-- =====================================================
CREATE TABLE academic_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    age_range TEXT NOT NULL,
    icon TEXT,
    features TEXT[],
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_programs_order ON academic_programs(order_index);

-- =====================================================
-- 8. SITE CONTENT (NEW!)
-- For all text content across the site
-- =====================================================
CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    section TEXT NOT NULL,
    type TEXT DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'html', 'url', 'json')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_content_section ON site_content(section);
CREATE UNIQUE INDEX idx_content_key ON site_content(key);

-- Insert default content
INSERT INTO site_content (key, value, section, type) VALUES
-- Mission & Vision
('mission_text', 'To provide quality, affordable, and accessible education that nurtures academic excellence, character development, and leadership skills in every child.', 'mission', 'textarea'),
('vision_text', 'To be the leading basic school in Ghana, recognized for academic excellence, moral integrity, and holistic child development.', 'vision', 'textarea'),

-- History
('history_paragraph_1', 'Fountain Gate Academy was established in 2009 with a vision to transform basic education in Ghana.', 'history', 'textarea'),
('history_paragraph_2', 'Over the years, we have consistently maintained our commitment to academic excellence and character development.', 'history', 'textarea'),
('history_paragraph_3', 'Today, we serve over 500 students from Creche to JHS with a dedicated team of qualified educators.', 'history', 'textarea'),

-- Welcome Section
('welcome_heading', 'Building Tomorrow''s Leaders Today', 'welcome', 'text'),
('welcome_paragraph_1', 'At Fountain Gate Academy, we are committed to providing a nurturing environment where young minds flourish.', 'welcome', 'textarea'),
('welcome_paragraph_2', 'From our Creche program through JHS, we offer a continuous educational journey.', 'welcome', 'textarea'),
('welcome_image_url', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800', 'welcome', 'url'),

-- CTA Section
('cta_heading', 'Ready to Join Our Community?', 'cta', 'text'),
('cta_subheading', 'Take the first step towards your child''s bright future. Apply now or schedule a visit to our campus.', 'cta', 'textarea'),

-- Contact Info
('address_line_1', '123 Education Street', 'contact_info', 'text'),
('address_line_2', 'East Legon, Accra', 'contact_info', 'text'),
('address_line_3', 'Ghana', 'contact_info', 'text'),
('phone_primary', '+233 24 123 4567', 'contact_info', 'text'),
('phone_secondary', '+233 30 234 5678', 'contact_info', 'text'),
('email_primary', 'info@fountaingate.edu.gh', 'contact_info', 'text'),
('email_secondary', 'admissions@fountaingate.edu.gh', 'contact_info', 'text'),
('office_hours', 'Monday - Friday: 8:00 AM - 4:00 PM', 'contact_info', 'text'),

-- Social Media
('facebook_url', '#', 'social_media', 'url'),
('twitter_url', '#', 'social_media', 'url'),
('instagram_url', '#', 'social_media', 'url'),
('youtube_url', '#', 'social_media', 'url');

-- =====================================================
-- 9. CAROUSEL SLIDES (NEW!)
-- =====================================================
CREATE TABLE carousel_slides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_carousel_order ON carousel_slides(order_index);

-- Insert default slides
INSERT INTO carousel_slides (title, description, image_url, order_index) VALUES
('Quality Education', 'Excellence in learning from Creche to JHS', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600', 0),
('Modern Facilities', 'State-of-the-art learning environment', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1600', 1),
('Holistic Development', 'Nurturing minds, building character', 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600', 2);

-- =====================================================
-- 10. HOMEPAGE STATS (NEW!)
-- =====================================================
CREATE TABLE homepage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    value TEXT NOT NULL,
    label TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stats_order ON homepage_stats(order_index);

-- Insert default stats
INSERT INTO homepage_stats (value, label, order_index) VALUES
('15+', 'Years of Excellence', 0),
('500+', 'Happy Students', 1),
('98%', 'Success Rate', 2);

-- =====================================================
-- 11. HOMEPAGE FEATURES (NEW!)
-- =====================================================
CREATE TABLE homepage_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_features_order ON homepage_features(order_index);

-- Insert default features
INSERT INTO homepage_features (icon, title, description, order_index) VALUES
('BookOpen', 'Quality Education', 'Comprehensive curriculum aligned with national standards', 0),
('Users', 'Experienced Teachers', 'Dedicated and qualified educators committed to excellence', 1),
('Award', 'Excellence & Achievement', 'Outstanding academic performance and awards', 2),
('Heart', 'Character Building', 'Instilling values, discipline, and moral principles', 3);

-- =====================================================
-- 12. CORE VALUES (NEW!)
-- =====================================================
CREATE TABLE core_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_values_order ON core_values(order_index);

-- Insert default core values
INSERT INTO core_values (icon, title, description, order_index) VALUES
('Heart', 'Integrity', 'We uphold honesty, transparency, and ethical conduct in all our activities.', 0),
('Star', 'Excellence', 'We strive for the highest standards in teaching, learning, and character development.', 1),
('Users', 'Community', 'We foster a supportive and inclusive environment for students, staff, and parents.', 2),
('Target', 'Innovation', 'We embrace modern teaching methods and technology to enhance learning outcomes.', 3);

-- =====================================================
-- 13. ADMISSION STEPS (NEW!)
-- =====================================================
CREATE TABLE admission_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admission_steps_order ON admission_steps(order_index);

-- Insert default admission steps
INSERT INTO admission_steps (icon, title, description, order_index) VALUES
('FileText', 'Submit Inquiry', 'Fill out our online inquiry form with your details', 0),
('Calendar', 'Schedule Visit', 'Tour our facilities and meet our staff', 1),
('UserPlus', 'Complete Application', 'Submit required documents and application fee', 2),
('CheckCircle', 'Enrollment', 'Receive acceptance and complete enrollment', 3);

-- =====================================================
-- 14. ADMISSION REQUIREMENTS (NEW!)
-- =====================================================
CREATE TABLE admission_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requirement TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requirements_order ON admission_requirements(order_index);

-- Insert default requirements
INSERT INTO admission_requirements (requirement, order_index) VALUES
('Birth certificate of the child', 0),
('Recent passport-sized photographs (4 copies)', 1),
('Immunization records', 2),
('Previous school report cards (if applicable)', 3),
('Parent/Guardian identification', 4),
('Proof of residence', 5);

-- =====================================================
-- ROW LEVEL SECURITY (Optional - enable if needed)
-- =====================================================

-- Enable RLS on all tables
-- ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admission_inquiries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE events ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE academic_programs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE homepage_features ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admission_steps ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE admission_requirements ENABLE ROW LEVEL SECURITY;

-- Create policies as needed for your authentication setup

-- =====================================================
-- SUMMARY
-- =====================================================
-- Total Tables: 14
-- 7 Existing + 7 NEW
-- All tables indexed for performance
-- Default data inserted for new tables
-- Ready for production use!
-- =====================================================

