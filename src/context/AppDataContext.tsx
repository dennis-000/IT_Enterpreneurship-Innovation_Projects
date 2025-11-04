import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  publishedDate: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  imageUrl?: string;
}

export type NewsPayload = Omit<NewsPost, 'id'>;
export type EventPayload = Omit<EventItem, 'id'>;

interface AppDataContextValue {
  news: NewsPost[];
  events: EventItem[];
  addNews: (payload: NewsPayload) => void;
  updateNews: (id: string, payload: NewsPayload) => void;
  deleteNews: (id: string) => void;
  addEvent: (payload: EventPayload) => void;
  updateEvent: (id: string, payload: EventPayload) => void;
  deleteEvent: (id: string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(undefined);

const initialNews: NewsPost[] = [
  {
    id: 'news-1',
    title: 'New Science Laboratory Commissioned',
    excerpt: 'Our modern science laboratory is now open, offering hands-on learning experiences for students across all levels.',
    content:
      'We are excited to announce the commissioning of our new science laboratory equipped with state-of-the-art apparatus. This facility will enable students from Creche to JHS to explore scientific concepts through practical experiments, fostering curiosity and innovation.',
    imageUrl: 'https://images.pexels.com/photos/3825571/pexels-photo-3825571.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedDate: '2025-10-15',
  },
  {
    id: 'news-2',
    title: 'Fountain Gate Students Excel in BECE',
    excerpt: 'Congratulations to our JHS graduates for achieving a 100% pass rate in the 2025 BECE examinations!',
    content:
      'The Fountain Gate Academy JHS class of 2025 has achieved outstanding results in the BECE examinations, with all students securing admission into top Category A senior high schools. Their success reflects the dedication of our teachers, students, and supportive parents.',
    imageUrl: 'https://images.pexels.com/photos/4449511/pexels-photo-4449511.jpeg?auto=compress&cs=tinysrgb&w=800',
    publishedDate: '2025-09-28',
  },
];

const initialEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'Open House & Campus Tour',
    description: 'Prospective parents and students are invited to tour our facilities, meet teachers, and experience life at Fountain Gate Academy.',
    eventDate: '2025-11-15',
    location: 'Fountain Gate Academy Campus',
    imageUrl: 'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 'event-2',
    title: 'Cultural Day Celebration',
    description: 'A vibrant celebration of Ghanaian culture featuring performances, exhibitions, and traditional cuisine prepared by students.',
    eventDate: '2026-01-20',
    location: 'School Assembly Hall',
    imageUrl: 'https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const STORAGE_KEYS = {
  news: 'fga-news',
  events: 'fga-events',
};

const isBrowser = typeof window !== 'undefined';

const loadCollection = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) return fallback;
    const parsed = JSON.parse(stored);
    return parsed as T;
  } catch (error) {
    console.warn(`[AppDataContext] Failed to parse local storage for key "${key}"`, error);
    return fallback;
  }
};

const persistCollection = (key: string, value: unknown) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[AppDataContext] Failed to write local storage for key "${key}"`, error);
  }
};

const generateId = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const sanitizeNewsPayload = (payload: NewsPayload): NewsPayload => ({
  ...payload,
  imageUrl: payload.imageUrl?.trim() ? payload.imageUrl.trim() : undefined,
  title: payload.title.trim(),
  excerpt: payload.excerpt.trim(),
  content: payload.content.trim(),
  publishedDate: payload.publishedDate,
});

const sanitizeEventPayload = (payload: EventPayload): EventPayload => ({
  ...payload,
  imageUrl: payload.imageUrl?.trim() ? payload.imageUrl.trim() : undefined,
  title: payload.title.trim(),
  description: payload.description.trim(),
  location: payload.location.trim(),
  eventDate: payload.eventDate,
});

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsPost[]>(() => loadCollection(STORAGE_KEYS.news, initialNews));
  const [events, setEvents] = useState<EventItem[]>(() => loadCollection(STORAGE_KEYS.events, initialEvents));

  useEffect(() => {
    persistCollection(STORAGE_KEYS.news, news);
  }, [news]);

  useEffect(() => {
    persistCollection(STORAGE_KEYS.events, events);
  }, [events]);

  const addNews = (payload: NewsPayload) => {
    const normalized = sanitizeNewsPayload(payload);
    const entry: NewsPost = {
      id: generateId('news'),
      ...normalized,
    };
    setNews((prev) => sortNewsByDate([entry, ...prev]));
  };

  const updateNews = (id: string, payload: NewsPayload) => {
    const normalized = sanitizeNewsPayload(payload);
    setNews((prev) => sortNewsByDate(prev.map((item) => (item.id === id ? { ...item, ...normalized } : item))));
  };

  const deleteNews = (id: string) => {
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  const addEvent = (payload: EventPayload) => {
    const normalized = sanitizeEventPayload(payload);
    const entry: EventItem = {
      id: generateId('event'),
      ...normalized,
    };
    setEvents((prev) => sortEventsByDate([entry, ...prev]));
  };

  const updateEvent = (id: string, payload: EventPayload) => {
    const normalized = sanitizeEventPayload(payload);
    setEvents((prev) => sortEventsByDate(prev.map((item) => (item.id === id ? { ...item, ...normalized } : item))));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((item) => item.id !== id));
  };

  const value = useMemo(
    () => ({ news, events, addNews, updateNews, deleteNews, addEvent, updateEvent, deleteEvent }),
    [news, events]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

const sortNewsByDate = (collection: NewsPost[]) =>
  [...collection].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

const sortEventsByDate = (collection: EventItem[]) =>
  [...collection].sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

// eslint-disable-next-line react-refresh/only-export-components
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};
