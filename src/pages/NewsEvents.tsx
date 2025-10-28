import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Newspaper } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabase';

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  published_date: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string | null;
}

export default function NewsEvents() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsPost | null>(null);

  useEffect(() => {
    fetchNewsAndEvents();
  }, []);

  const fetchNewsAndEvents = async () => {
    try {
      const [newsResponse, eventsResponse] = await Promise.all([
        supabase
          .from('news_posts')
          .select('*')
          .order('published_date', { ascending: false })
          .limit(6),
        supabase
          .from('events')
          .select('*')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .limit(6)
      ]);

      if (newsResponse.data) setNews(newsResponse.data);
      if (eventsResponse.data) setEvents(eventsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="animate-fade-in">
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60 z-10" />
        <img
          src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="News & Events at Fountain Gate Academy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">News & Events</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Stay updated with the latest happenings at Fountain Gate Academy
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Latest News"
            subtitle="Recent updates and announcements from our school"
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((post, index) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedNews(post)}
                >
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(post.published_date)}
                    </div>
                    <h3 className="text-xl font-bold text-royal-800 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <button className="text-royal-600 font-semibold hover:text-royal-700 transition-colors flex items-center">
                      Read More
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Upcoming Events"
            subtitle="Join us for these exciting upcoming activities"
          />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div>
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-royal-100 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    {event.image_url && (
                      <div className="md:col-span-1 h-48 md:h-full overflow-hidden">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className={`p-6 ${event.image_url ? 'md:col-span-2' : 'md:col-span-3'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-tomato-100 px-4 py-2 rounded-xl">
                          <p className="text-tomato-700 font-bold text-lg">
                            {new Date(event.event_date).getDate()}
                          </p>
                          <p className="text-tomato-600 text-sm">
                            {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-royal-800 mb-3">{event.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-5 h-5 mr-3 text-royal-600" />
                          {formatDate(event.event_date)}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-5 h-5 mr-3 text-royal-600" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {selectedNews && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedNews.image_url && (
              <div className="h-64 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedNews.image_url}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Newspaper className="w-4 h-4 mr-2" />
                {formatDate(selectedNews.published_date)}
              </div>
              <h2 className="text-3xl font-bold text-royal-800 mb-6">{selectedNews.title}</h2>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                {selectedNews.content}
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="mt-8 bg-royal-600 hover:bg-royal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-gradient-to-br from-royal-700 to-royal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="w-16 h-16 text-tomato-400 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-6">Stay Connected</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about news, events, and important announcements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-tomato-500"
            />
            <button className="bg-tomato-500 hover:bg-tomato-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
