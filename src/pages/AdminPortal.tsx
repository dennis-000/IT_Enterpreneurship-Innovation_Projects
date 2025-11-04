import { FormEvent, useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Home as HomeIcon,
  Info,
  GraduationCap,
  ClipboardList,
  Newspaper,
  Image as ImageIcon,
  Phone,
  CalendarDays,
  PlusCircle,
  Save,
  Trash2,
  ShieldCheck,
  Lock,
  LogOut,
  Pencil,
  XCircle,
} from 'lucide-react';
import { useAppData, EventPayload, NewsPayload } from '../context/AppDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';

type AdminSection =
  | 'dashboard'
  | 'news'
  | 'home'
  | 'about'
  | 'academics'
  | 'admissions'
  | 'gallery'
  | 'contact';

interface AdminNavItem {
  id: AdminSection;
  label: string;
  description: string;
  icon: LucideIcon;
}

type NewsFormState = Omit<NewsPayload, 'imageUrl'> & { imageUrl: string };
type EventFormState = Omit<EventPayload, 'imageUrl'> & { imageUrl: string };

const adminNavItems: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Content insights and quick stats',
    icon: LayoutDashboard,
  },
  {
    id: 'news',
    label: 'News & Events',
    description: 'Publish announcements and plan events',
    icon: Newspaper,
  },
  {
    id: 'home',
    label: 'Homepage',
    description: 'Hero banners and community highlights',
    icon: HomeIcon,
  },
  {
    id: 'about',
    label: 'About',
    description: 'Mission, vision, and leadership stories',
    icon: Info,
  },
  {
    id: 'academics',
    label: 'Academics',
    description: 'Programs, curriculum, and faculty',
    icon: GraduationCap,
  },
  {
    id: 'admissions',
    label: 'Admissions',
    description: 'Requirements, timelines, and FAQs',
    icon: ClipboardList,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Campus life and event highlights',
    icon: ImageIcon,
  },
  {
    id: 'contact',
    label: 'Contact',
    description: 'Locations, phone numbers, and support',
    icon: Phone,
  },
];

const formatDate = (value: string | undefined) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getInitials = (value: string) => {
  const letters = value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase());
  if (letters.length === 0) return 'AD';
  if (letters.length === 1) return letters[0];
  return `${letters[0]}${letters[letters.length - 1]}`;
};

const createEmptyNewsForm = (): NewsFormState => ({
  title: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  publishedDate: new Date().toISOString().slice(0, 10),
});

const createEmptyEventForm = (): EventFormState => ({
  title: '',
  description: '',
  location: '',
  imageUrl: '',
  eventDate: new Date().toISOString().slice(0, 10),
});

function AdminPortal() {
  const { news, events, addNews, updateNews, deleteNews, addEvent, updateEvent, deleteEvent } = useAppData();
  const { isAuthenticated, user, login, logout } = useAdminAuth();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

  const [newsForm, setNewsForm] = useState<NewsFormState>(() => createEmptyNewsForm());
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);

  const [eventForm, setEventForm] = useState<EventFormState>(() => createEmptyEventForm());
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const latestNews = useMemo(() => (news.length > 0 ? news[0] : null), [news]);

  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.filter((item) => {
      const eventDate = new Date(item.eventDate);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() >= today.getTime();
    });
  }, [events]);

  const nextEvent = useMemo(() => {
    if (upcomingEvents.length > 0) {
      return upcomingEvents[0];
    }
    return events.length > 0 ? events[0] : null;
  }, [upcomingEvents, events]);

  const displayName = user?.name ?? 'Administrator';
  const emailAddress = user?.email ?? 'admin@fga.local';
  const userInitials = useMemo(() => getInitials(displayName), [displayName]);

  const resetNewsForm = () => {
    setNewsForm(createEmptyNewsForm());
    setEditingNewsId(null);
  };

  const resetEventForm = () => {
    setEventForm(createEmptyEventForm());
    setEditingEventId(null);
  };

  const handleLoginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setLoginError(null);

    try {
      const success = await login(credentials.email, credentials.password);
      if (success) {
        setCredentials({ email: '', password: '' });
        setActiveSection('dashboard');
        resetNewsForm();
        resetEventForm();
      } else {
        setLoginError('Invalid credentials. Please verify the email and password and try again.');
      }
    } catch (error) {
      console.error('[AdminPortal] Failed to sign in', error);
      setLoginError('Unable to sign in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startNewsEdit = (id: string) => {
    const entry = news.find((item) => item.id === id);
    if (!entry) return;
    setEditingNewsId(id);
    setNewsForm({
      title: entry.title,
      excerpt: entry.excerpt,
      content: entry.content,
      imageUrl: entry.imageUrl ?? '',
      publishedDate: entry.publishedDate,
    });
    setActiveSection('news');
  };

  const startEventEdit = (id: string) => {
    const entry = events.find((item) => item.id === id);
    if (!entry) return;
    setEditingEventId(id);
    setEventForm({
      title: entry.title,
      description: entry.description,
      location: entry.location,
      imageUrl: entry.imageUrl ?? '',
      eventDate: entry.eventDate,
    });
    setActiveSection('news');
  };

  const handleNewsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: NewsPayload = {
      title: newsForm.title,
      excerpt: newsForm.excerpt,
      content: newsForm.content,
      imageUrl: newsForm.imageUrl.trim() ? newsForm.imageUrl.trim() : undefined,
      publishedDate: newsForm.publishedDate,
    };

    if (editingNewsId) {
      updateNews(editingNewsId, payload);
    } else {
      addNews(payload);
    }

    resetNewsForm();
  };

  const handleEventSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: EventPayload = {
      title: eventForm.title,
      description: eventForm.description,
      location: eventForm.location,
      imageUrl: eventForm.imageUrl.trim() ? eventForm.imageUrl.trim() : undefined,
      eventDate: eventForm.eventDate,
    };

    if (editingEventId) {
      updateEvent(editingEventId, payload);
    } else {
      addEvent(payload);
    }

    resetEventForm();
  };

  const handleLogout = () => {
    resetNewsForm();
    resetEventForm();
    setActiveSection('dashboard');
    logout();
  };

  const renderPlaceholder = (title: string, description: string) => (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-10 text-center space-y-4">
      <h2 className="text-2xl font-semibold text-royal-700">{title}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-royal-50 text-royal-600 border border-royal-100">
        Content management tools coming soon
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Published News</p>
              <p className="text-3xl font-bold text-royal-700 mt-2">{news.length}</p>
            </div>
            <Newspaper className="w-10 h-10 text-royal-500" />
          </div>
          <p className="text-xs text-gray-500 mt-4">Keep families informed with timely announcements.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-3xl font-bold text-tomato-600 mt-2">{upcomingEvents.length}</p>
            </div>
            <CalendarDays className="w-10 h-10 text-tomato-500" />
          </div>
          <p className="text-xs text-gray-500 mt-4">Plan ahead and keep the community engaged.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Last Update</p>
              <p className="text-lg font-semibold text-royal-700 mt-2">
                {latestNews ? formatDate(latestNews.publishedDate) : '—'}
              </p>
            </div>
            <ShieldCheck className="w-10 h-10 text-emerald-500" />
          </div>
          <p className="text-xs text-gray-500 mt-4">Review the latest content changes at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-royal-700">Latest Announcement</h2>
            <Newspaper className="w-6 h-6 text-royal-500" />
          </div>
          {latestNews ? (
            <div className="space-y-2 text-left">
              <p className="text-sm uppercase tracking-wide text-gray-400">{formatDate(latestNews.publishedDate)}</p>
              <h3 className="text-2xl font-bold text-royal-800">{latestNews.title}</h3>
              <p className="text-gray-600">{latestNews.excerpt}</p>
            </div>
          ) : (
            <p className="text-gray-500">No news published yet. Head to the News &amp; Events section to share an update.</p>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-royal-700">Next Event</h2>
            <CalendarDays className="w-6 h-6 text-tomato-500" />
          </div>
          {nextEvent ? (
            <div className="space-y-2 text-left">
              <p className="text-sm uppercase tracking-wide text-gray-400">{formatDate(nextEvent.eventDate)}</p>
              <h3 className="text-2xl font-bold text-royal-800">{nextEvent.title}</h3>
              <p className="text-gray-600">{nextEvent.description}</p>
              <p className="text-sm text-gray-500">Location: {nextEvent.location}</p>
            </div>
          ) : (
            <p className="text-gray-500">You have no upcoming events. Add one to keep families in the loop.</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderNewsManager = () => (
    <div className="space-y-10">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <header className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-royal-600 to-royal-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">News Manager</h2>
                <p className="text-sm text-white/80">Create announcements and spotlight achievements.</p>
              </div>
              <PlusCircle className="w-8 h-8" />
            </div>
          </header>

          <form onSubmit={handleNewsSubmit} className="px-8 py-6 space-y-5">
            <div>
              <label htmlFor="news-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="news-title"
                type="text"
                required
                value={newsForm.title}
                onChange={(event) => setNewsForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-royal-500"
                placeholder="Enter headline"
              />
            </div>

            <div>
              <label htmlFor="news-excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Short Excerpt
              </label>
              <textarea
                id="news-excerpt"
                required
                value={newsForm.excerpt}
                onChange={(event) => setNewsForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-royal-500"
                placeholder="Brief summary displayed on the listing"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="news-content" className="block text-sm font-medium text-gray-700 mb-2">
                Full Content
              </label>
              <textarea
                id="news-content"
                required
                value={newsForm.content}
                onChange={(event) => setNewsForm((prev) => ({ ...prev, content: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-royal-500"
                placeholder="Detailed news content"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="news-image" className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  id="news-image"
                  type="url"
                  value={newsForm.imageUrl}
                  onChange={(event) => setNewsForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-royal-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label htmlFor="news-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Published Date
                </label>
                <input
                  id="news-date"
                  type="date"
                  required
                  value={newsForm.publishedDate}
                  onChange={(event) => setNewsForm((prev) => ({ ...prev, publishedDate: event.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-royal-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              {editingNewsId && (
                <button
                  type="button"
                  onClick={resetNewsForm}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-600 text-white font-semibold shadow-sm hover:bg-royal-700"
              >
                <Save className="w-4 h-4" />
                {editingNewsId ? 'Update News' : 'Publish News'}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-100">
            <h3 className="px-8 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Posts</h3>
            <ul className="divide-y divide-gray-100">
              {news.map((item) => (
                <li key={item.id} className="px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-royal-700">{item.title}</p>
                    <p className="text-sm text-gray-500">Published: {formatDate(item.publishedDate)}</p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => startNewsEdit(item.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteNews(item.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {news.length === 0 && (
                <li className="px-8 py-6 text-sm text-gray-500">No news posts yet. Add your first announcement above.</li>
              )}
            </ul>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <header className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-tomato-500 to-amber-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Events Manager</h2>
                <p className="text-sm text-white/80">Plan campus life and keep families informed.</p>
              </div>
              <PlusCircle className="w-8 h-8" />
            </div>
          </header>

          <form onSubmit={handleEventSubmit} className="px-8 py-6 space-y-5">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                id="event-title"
                type="text"
                required
                value={eventForm.title}
                onChange={(event) => setEventForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tomato-500"
                placeholder="Event name"
              />
            </div>

            <div>
              <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="event-description"
                required
                value={eventForm.description}
                onChange={(event) => setEventForm((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tomato-500"
                placeholder="What should attendees expect?"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  id="event-location"
                  type="text"
                  required
                  value={eventForm.location}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, location: event.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tomato-500"
                  placeholder="Venue"
                />
              </div>
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Date
                </label>
                <input
                  id="event-date"
                  type="date"
                  required
                  value={eventForm.eventDate}
                  onChange={(event) => setEventForm((prev) => ({ ...prev, eventDate: event.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tomato-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="event-image" className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                id="event-image"
                type="url"
                value={eventForm.imageUrl}
                onChange={(event) => setEventForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-tomato-500"
                placeholder="https://example.com/event.jpg"
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-end pt-2">
              {editingEventId && (
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-tomato-500 text-white font-semibold shadow-sm hover:bg-tomato-600"
              >
                <Save className="w-4 h-4" />
                {editingEventId ? 'Update Event' : 'Add Event'}
              </button>
            </div>
          </form>

          <div className="border-t border-gray-100">
            <h3 className="px-8 py-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">Upcoming &amp; Planned</h3>
            <ul className="divide-y divide-gray-100">
              {events.map((item) => (
                <li key={item.id} className="px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-tomato-600">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(item.eventDate)} · {item.location}
                    </p>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => startEventEdit(item.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEvent(item.id)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {events.length === 0 && (
                <li className="px-8 py-6 text-sm text-gray-500">No events scheduled yet. Add an event to get started.</li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'news':
        return renderNewsManager();
      case 'home':
        return renderPlaceholder(
          'Home Page Controls',
          'Manage the hero carousel, featured highlights, and call-to-action banners that appear on the public homepage.'
        );
      case 'about':
        return renderPlaceholder(
          'About Page Controls',
          'Update mission and vision statements, leadership bios, and core values showcased to families.'
        );
      case 'academics':
        return renderPlaceholder(
          'Academics Page Controls',
          'Organize academic programs, curriculum highlights, and facility spotlights for each level.'
        );
      case 'admissions':
        return renderPlaceholder(
          'Admissions Page Controls',
          'Configure enrollment requirements, timelines, downloadable forms, and FAQs.'
        );
      case 'gallery':
        return renderPlaceholder(
          'Gallery Page Controls',
          'Curate photo collections and featured albums that tell the school story.'
        );
      case 'contact':
        return renderPlaceholder(
          'Contact Page Controls',
          'Maintain contact information, office hours, and campus location details.'
        );
      default:
        return renderDashboard();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-royal-900 via-royal-800 to-royal-700 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-royal-100 flex items-center justify-center">
              <Lock className="w-8 h-8 text-royal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-royal-800">Admin Portal Access</h1>
              <p className="text-sm text-gray-600 mt-2">
                Enter the administrator credentials to manage school content.
              </p>
            </div>
          </div>

          {loginError && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={credentials.email}
                onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-royal-500"
                placeholder="admin@fga.local"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                value={credentials.password}
                onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-royal-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-royal-600 text-white font-semibold shadow-lg hover:bg-royal-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <ShieldCheck className="w-5 h-5" />
              {isSubmitting ? 'Signing In…' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            For demo purposes use <span className="font-semibold">admin@fga.local</span> / <span className="font-semibold">SecurePass123</span>
          </p>
        </div>
      </div>
    );
  }

  const currentSection = adminNavItems.find((item) => item.id === activeSection) ?? adminNavItems[0];

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full lg:w-72 bg-royal-900 text-white lg:min-h-screen p-6 lg:p-8 space-y-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Administration</p>
            <h2 className="text-2xl font-semibold mt-3">Fountain Gate CMS</h2>
          </div>

          <nav className="space-y-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                    isActive ? 'bg-white text-royal-800 shadow-lg' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-9 h-9 rounded-xl ${
                      isActive ? 'bg-royal-100 text-royal-700' : 'bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </span>
                  <span>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-white/60">{item.description}</p>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex-1 min-h-screen bg-slate-50">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-400">{currentSection.description}</p>
                <h1 className="text-3xl font-bold text-royal-800">{currentSection.label}</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-2">
                  <div className="w-10 h-10 rounded-2xl bg-royal-600 text-white flex items-center justify-center font-semibold">
                    {userInitials}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-royal-800">{displayName}</p>
                    <p className="text-gray-500">{emailAddress}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-6 py-10 space-y-10">
            {renderActiveSection()}
          </main>
        </section>
      </div>
    </div>
  );
}

export { AdminPortal };
export default AdminPortal;
