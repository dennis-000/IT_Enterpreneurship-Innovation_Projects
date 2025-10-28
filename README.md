# 🎓 Fountain Gate Academy - School Management System

A modern, full-featured school website and content management system built for **Fountain Gate Academy**, a prestigious educational institution in Ghana offering quality education from Creche to Junior High School (Ages 1 year and above).

![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.4.2-purple?logo=vite)
![Supabase](https://img.shields.io/badge/Supabase-2.57.4-green?logo=supabase)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Usage](#-usage)
- [Admin Portal](#-admin-portal)
- [Database Schema](#-database-schema)
- [Pages Overview](#-pages-overview)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🌐 Public Website (7 Pages)

1. **Home Page**
   - Hero carousel with auto-rotating slides
   - Welcome section with school overview
   - Statistics showcase (Years of Excellence, Student Count, Success Rate)
   - Feature highlights (4 key features)
   - Call-to-action section

2. **About Us Page**
   - Mission statement
   - Vision statement
   - School history (detailed narrative)
   - Leadership team showcase
   - Core values display

3. **Academics Page**
   - 5 Academic programs (Creche, Nursery, KG, Primary, JHS)
   - Detailed curriculum for each level
   - Key features per program
   - Facilities showcase
   - Academic excellence statistics

4. **Admissions Page**
   - 4-step admission process
   - Required documents checklist
   - Online inquiry form
   - Contact information
   - Real-time form submission to database

5. **News & Events Page**
   - Latest news posts with images
   - Upcoming events calendar
   - Detailed news article modal
   - Event date and location information
   - Newsletter subscription

6. **Gallery Page**
   - Photo and video gallery
   - Category filtering
   - Media type filtering
   - Lightbox view for media
   - Responsive grid layout

7. **Contact Page**
   - Contact information display
   - Contact form with validation
   - Google Maps integration
   - Social media links
   - Office hours display

### 🔐 Admin Portal (Comprehensive CMS)

**Authentication Features:**
- Secure login system
- Session persistence (24-hour sessions)
- Auto-logout on session expiry
- Protected routes

**Page-Based Management:**

1. **Home Page Manager**
   - Hero carousel slides (add/edit/delete)
   - Statistics management
   - Features management
   - Welcome section editing
   - CTA section editing

2. **About Page Manager**
   - Mission/Vision text editing
   - School history management (3 paragraphs)
   - Staff/Leadership (add/edit/delete with photos)
   - Core values management

3. **Academics Page Manager**
   - Academic programs (add/edit/delete)
   - Features & curriculum lists
   - Facilities management
   - Excellence stats editing

4. **Admissions Page Manager**
   - Admission steps management
   - Required documents list
   - Contact info editing
   - Inquiry management (view/export)

5. **News & Events Manager**
   - News posts (create/edit/delete)
   - Events management
   - Image upload support
   - Publication date control

6. **Gallery Manager**
   - Photo/video upload
   - Category assignment
   - Bulk operations
   - Media type filtering

7. **Contact Page Manager**
   - Contact information editing
   - Social media links management
   - Inquiry viewing and management
   - CSV export functionality

**Dashboard Features:**
- Real-time statistics
- Recent contact inquiries
- Quick action buttons
- Notification system
- Mobile-responsive design

---

## 🛠 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.5.3** - Type safety
- **Vite 5.4.2** - Build tool & dev server
- **React Router DOM 7.9.4** - Client-side routing
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Lucide React 0.344.0** - Beautiful icon library

### Backend & Database
- **Supabase 2.57.4** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication (ready for expansion)
  - Storage (for future image uploads)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📁 Project Structure

```
fountaingate/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── pages/
│   │   │   │   ├── HomePageManager.tsx
│   │   │   │   ├── AboutPageManager.tsx
│   │   │   │   ├── AcademicsPageManager.tsx
│   │   │   │   ├── AdmissionsPageManager.tsx
│   │   │   │   └── ContactPageManager.tsx
│   │   │   ├── AdmissionsManager.tsx
│   │   │   ├── GalleryManager.tsx
│   │   │   ├── NewsEventsManager.tsx
│   │   │   └── NotificationSystem.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   └── SectionHeader.tsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminPortal.tsx
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Academics.tsx
│   │   ├── Admissions.tsx
│   │   ├── NewsEvents.tsx
│   │   ├── Gallery.tsx
│   │   └── Contact.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Git
- Supabase account (free tier available)

### Clone the Repository

```bash
git clone https://github.com/dennis-000/IT_Enterpreneurship-Innovation_Projects.git
cd IT_Enterpreneurship-Innovation_Projects
```

### Install Dependencies

```bash
npm install
# or
yarn install
```

---

## ⚙️ Environment Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your project URL and anon key

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run these SQL commands in your Supabase SQL Editor to create all required tables:

```sql
-- Carousel Slides
CREATE TABLE carousel_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Homepage Stats
CREATE TABLE homepage_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL,
  label TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Homepage Features
CREATE TABLE homepage_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Core Values
CREATE TABLE core_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Staff Members
CREATE TABLE staff_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  image_url TEXT,
  bio TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Academic Programs
CREATE TABLE academic_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT NOT NULL,
  color_from TEXT NOT NULL,
  color_to TEXT NOT NULL,
  bg_color_from TEXT NOT NULL,
  bg_color_to TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL,
  curriculum TEXT[] NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Academic Facilities
CREATE TABLE academic_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Admission Steps
CREATE TABLE admission_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Required Documents
CREATE TABLE required_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  document_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Admission Inquiries
CREATE TABLE admission_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  student_name TEXT NOT NULL,
  student_age TEXT NOT NULL,
  grade_level TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Contact Inquiries
CREATE TABLE contact_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- News Posts
CREATE TABLE news_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  published_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Events
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Gallery Items
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('photo', 'video')),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Site Content (for flexible content storage)
CREATE TABLE site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  section TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE required_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE admission_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create policies (allow public read, authenticated write)
-- Public read policies
CREATE POLICY "Public can view carousel" ON carousel_slides FOR SELECT USING (true);
CREATE POLICY "Public can view stats" ON homepage_stats FOR SELECT USING (true);
CREATE POLICY "Public can view features" ON homepage_features FOR SELECT USING (true);
CREATE POLICY "Public can view values" ON core_values FOR SELECT USING (true);
CREATE POLICY "Public can view staff" ON staff_members FOR SELECT USING (true);
CREATE POLICY "Public can view programs" ON academic_programs FOR SELECT USING (true);
CREATE POLICY "Public can view facilities" ON academic_facilities FOR SELECT USING (true);
CREATE POLICY "Public can view steps" ON admission_steps FOR SELECT USING (true);
CREATE POLICY "Public can view documents" ON required_documents FOR SELECT USING (true);
CREATE POLICY "Public can view news" ON news_posts FOR SELECT USING (true);
CREATE POLICY "Public can view events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can view gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public can view content" ON site_content FOR SELECT USING (true);

-- Public insert policies (for form submissions)
CREATE POLICY "Anyone can submit admission inquiry" ON admission_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit contact inquiry" ON contact_inquiries FOR INSERT WITH CHECK (true);

-- Allow all operations (for development - tighten in production)
CREATE POLICY "Enable all for authenticated users" ON carousel_slides FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON homepage_stats FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON homepage_features FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON core_values FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON staff_members FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON academic_programs FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON academic_facilities FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON admission_steps FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON required_documents FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON admission_inquiries FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON contact_inquiries FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON news_posts FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON events FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON gallery_items FOR ALL USING (true);
CREATE POLICY "Enable all for authenticated users" ON site_content FOR ALL USING (true);
```

---

## 💻 Usage

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Type Checking

```bash
npm run typecheck
# or
yarn typecheck
```

---

## 🔐 Admin Portal

### Access the Admin Portal

Navigate to: `http://localhost:5173/admin`

### Demo Credentials

- **Username:** `admin`
- **Password:** `admin123`

### Features

- **Session Duration:** 24 hours
- **Auto-logout:** On session expiry
- **Persistent Sessions:** Survives page refresh
- **Secure:** LocalStorage-based session management

### Admin Dashboard

- Real-time statistics for all content
- Recent contact inquiries
- Quick action buttons
- Mobile-responsive interface
- Notification system

---

## 🗄 Database Schema

### Tables Overview

| Table | Purpose | Records |
|-------|---------|---------|
| `carousel_slides` | Homepage hero carousel | Slides |
| `homepage_stats` | Statistics display | Stats |
| `homepage_features` | Feature highlights | Features |
| `core_values` | School values | Values |
| `staff_members` | Leadership team | Staff |
| `academic_programs` | Programs (Creche-JHS) | Programs |
| `academic_facilities` | School facilities | Facilities |
| `admission_steps` | Admission process | Steps |
| `required_documents` | Document checklist | Documents |
| `admission_inquiries` | Admission forms | Inquiries |
| `contact_inquiries` | Contact forms | Messages |
| `news_posts` | News articles | Posts |
| `events` | School events | Events |
| `gallery_items` | Photos & videos | Media |
| `site_content` | Dynamic content | Settings |

---

## 📄 Pages Overview

### Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with carousel, stats, features |
| `/about` | About Us | Mission, vision, history, team, values |
| `/academics` | Academics | Programs, curriculum, facilities, stats |
| `/admissions` | Admissions | Process, requirements, inquiry form |
| `/news` | News & Events | Latest news and upcoming events |
| `/gallery` | Gallery | Photo and video gallery |
| `/contact` | Contact | Contact form, info, map |

### Admin Pages

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Login | Admin authentication |
| `/admin` | Dashboard | Statistics & quick actions |
| `/admin` | Home Manager | Manage homepage content |
| `/admin` | About Manager | Manage about page content |
| `/admin` | Academics Manager | Manage academic programs |
| `/admin` | Admissions Manager | Manage admissions content |
| `/admin` | News Manager | Manage news posts |
| `/admin` | Events Manager | Manage school events |
| `/admin` | Gallery Manager | Manage media gallery |
| `/admin` | Contact Manager | Manage contact info & inquiries |

---

## 🎨 Design Features

- **Color Scheme:**
  - Primary: Royal Blue (#4169E1)
  - Secondary: Tomato (#F1592A)
  - Neutral: Gray shades

- **Typography:** System font stack with fallbacks
- **Animations:** Smooth transitions and hover effects
- **Icons:** Lucide React icon library
- **Responsive:** Mobile-first design
- **Accessibility:** WCAG compliant (in progress)

---

## 🔄 Future Enhancements

- [ ] Student/Parent portal
- [ ] Online fee payment
- [ ] E-learning platform integration
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Dennis**
- GitHub: [@dennis-000](https://github.com/dennis-000)

## 👨‍💻 Collaborators
**Theo**
- GitHub: [@dennis-000](https://github.com/Theo-Sam)

---

## 🙏 Acknowledgments

- React Team for the amazing framework
- Supabase for the backend infrastructure
- Tailwind CSS for the utility-first CSS framework
- Lucide for beautiful icons
- All contributors and supporters

---

## 📞 Support

For support, email asiedudennis30@example.com or open an issue in the repository.

---

## 🌟 Star This Project

If you find this project helpful, please give it a ⭐️!

---

**Built with ❤️ for Fountain Gate Academy**
