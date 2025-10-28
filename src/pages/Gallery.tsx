import { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, X } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabase';

interface GalleryItem {
  id: string;
  title: string;
  media_url: string;
  media_type: 'photo' | 'video';
  category: string;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

  const filteredItems = items.filter(item => {
    const matchesType = filter === 'all' || item.media_type === filter;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="animate-fade-in">
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60 z-10" />
        <img
          src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Gallery at Fountain Gate Academy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Gallery</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Explore moments from our vibrant school community
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setFilter('all')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${filter === 'all'
                  ? 'bg-royal-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-royal-50 border-2 border-gray-200'
                  }`}
              >
                All Media
              </button>
              <button
                onClick={() => setFilter('photo')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${filter === 'photo'
                  ? 'bg-royal-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-royal-50 border-2 border-gray-200'
                  }`}
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Photos
              </button>
              <button
                onClick={() => setFilter('video')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center ${filter === 'video'
                  ? 'bg-royal-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-royal-50 border-2 border-gray-200'
                  }`}
              >
                <Video className="w-5 h-5 mr-2" />
                Videos
              </button>
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-semibold focus:border-royal-500 focus:outline-none transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  onClick={() => setSelectedItem(item)}
                >
                  {item.media_type === 'photo' ? (
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-royal-900">
                      <img
                        src={item.media_url}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-4 group-hover:scale-110 transition-transform">
                          <Video className="w-8 h-8 text-royal-700" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg">{item.title}</h3>
                      <p className="text-gray-200 text-sm capitalize">{item.category}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-tomato-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {item.media_type === 'photo' ? 'Photo' : 'Video'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No items found for the selected filters.</p>
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="max-w-6xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.media_type === 'photo' ? (
              <img
                src={selectedItem.media_url}
                alt={selectedItem.title}
                className="w-full h-auto max-h-[90vh] object-contain rounded-2xl"
              />
            ) : (
              <video
                src={selectedItem.media_url}
                controls
                className="w-full h-auto max-h-[90vh] rounded-2xl"
                autoPlay
              />
            )}
            <div className="text-center mt-4">
              <h3 className="text-white text-2xl font-bold mb-2">{selectedItem.title}</h3>
              <p className="text-gray-300 capitalize">{selectedItem.category}</p>
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Capture the Moments"
            subtitle="Our gallery showcases the vibrant life at Fountain Gate Academy"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-royal-50 to-blue-50 p-8 rounded-2xl border-2 border-royal-200">
              <ImageIcon className="w-12 h-12 text-royal-600 mb-4" />
              <h3 className="text-2xl font-bold text-royal-800 mb-3">Academic Life</h3>
              <p className="text-gray-700">
                See our students engaged in learning activities, experiments, and classroom experiences.
              </p>
            </div>
            <div className="bg-gradient-to-br from-tomato-50 to-amber-50 p-8 rounded-2xl border-2 border-tomato-200">
              <Video className="w-12 h-12 text-tomato-600 mb-4" />
              <h3 className="text-2xl font-bold text-tomato-800 mb-3">Events & Activities</h3>
              <p className="text-gray-700">
                Highlights from our sports days, cultural celebrations, and special events.
              </p>
            </div>
            <div className="bg-gradient-to-br from-royal-50 to-blue-50 p-8 rounded-2xl border-2 border-royal-200">
              <ImageIcon className="w-12 h-12 text-royal-600 mb-4" />
              <h3 className="text-2xl font-bold text-royal-800 mb-3">Campus Life</h3>
              <p className="text-gray-700">
                Explore our facilities, classrooms, and the beautiful campus environment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
