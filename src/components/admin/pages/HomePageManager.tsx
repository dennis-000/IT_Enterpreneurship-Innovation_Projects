import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, BarChart3, Star } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface CarouselSlide {
    id: string;
    title: string;
    description: string;
    image_url: string;
    order_index: number;
}

interface Stat {
    id: string;
    value: string;
    label: string;
    order_index: number;
}

interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
    order_index: number;
}

interface WelcomeContent {
    heading: string;
    paragraph_1: string;
    paragraph_2: string;
    image_url: string;
}

interface CTAContent {
    heading: string;
    subheading: string;
}

export default function HomePageManager() {
    const [carousel, setCarousel] = useState<CarouselSlide[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [features, setFeatures] = useState<Feature[]>([]);
    const [welcome, setWelcome] = useState<WelcomeContent>({
        heading: '',
        paragraph_1: '',
        paragraph_2: '',
        image_url: ''
    });
    const [cta, setCTA] = useState<CTAContent>({
        heading: '',
        subheading: ''
    });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'carousel' | 'stats' | 'features' | 'welcome' | 'cta'>('carousel');
    const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
    const [editingStat, setEditingStat] = useState<Stat | null>(null);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [carouselRes, statsRes, featuresRes, contentRes] = await Promise.all([
                supabase.from('carousel_slides').select('*').order('order_index'),
                supabase.from('homepage_stats').select('*').order('order_index'),
                supabase.from('homepage_features').select('*').order('order_index'),
                supabase.from('site_content').select('*').in('key', [
                    'welcome_heading', 'welcome_paragraph_1', 'welcome_paragraph_2', 'welcome_image_url',
                    'cta_heading', 'cta_subheading'
                ])
            ]);

            setCarousel(carouselRes.data || []);
            setStats(statsRes.data || []);
            setFeatures(featuresRes.data || []);

            // Parse welcome content
            const contentMap: Record<string, string> = {};
            contentRes.data?.forEach(item => {
                contentMap[item.key] = item.value;
            });

            setWelcome({
                heading: contentMap.welcome_heading || '',
                paragraph_1: contentMap.welcome_paragraph_1 || '',
                paragraph_2: contentMap.welcome_paragraph_2 || '',
                image_url: contentMap.welcome_image_url || ''
            });

            setCTA({
                heading: contentMap.cta_heading || '',
                subheading: contentMap.cta_subheading || ''
            });
        } catch (error) {
            console.error('Error fetching home page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSlide = async (slide: Partial<CarouselSlide>) => {
        try {
            if (slide.id) {
                await supabase.from('carousel_slides').update(slide).eq('id', slide.id);
            } else {
                await supabase.from('carousel_slides').insert([{ ...slide, order_index: carousel.length }]);
            }
            fetchAllData();
            setEditingSlide(null);
        } catch (error) {
            console.error('Error saving slide:', error);
        }
    };

    const deleteSlide = async (id: string) => {
        if (!confirm('Delete this slide?')) return;
        await supabase.from('carousel_slides').delete().eq('id', id);
        fetchAllData();
    };

    const saveStat = async (stat: Partial<Stat>) => {
        try {
            if (stat.id) {
                await supabase.from('homepage_stats').update(stat).eq('id', stat.id);
            } else {
                await supabase.from('homepage_stats').insert([{ ...stat, order_index: stats.length }]);
            }
            fetchAllData();
            setEditingStat(null);
        } catch (error) {
            console.error('Error saving stat:', error);
        }
    };

    const deleteStat = async (id: string) => {
        if (!confirm('Delete this stat?')) return;
        await supabase.from('homepage_stats').delete().eq('id', id);
        fetchAllData();
    };

    const saveFeature = async (feature: Partial<Feature>) => {
        try {
            if (feature.id) {
                await supabase.from('homepage_features').update(feature).eq('id', feature.id);
            } else {
                await supabase.from('homepage_features').insert([{ ...feature, order_index: features.length }]);
            }
            fetchAllData();
            setEditingFeature(null);
        } catch (error) {
            console.error('Error saving feature:', error);
        }
    };

    const deleteFeature = async (id: string) => {
        if (!confirm('Delete this feature?')) return;
        await supabase.from('homepage_features').delete().eq('id', id);
        fetchAllData();
    };

    const saveWelcome = async () => {
        try {
            const updates = [
                { key: 'welcome_heading', value: welcome.heading, section: 'welcome', type: 'text' },
                { key: 'welcome_paragraph_1', value: welcome.paragraph_1, section: 'welcome', type: 'textarea' },
                { key: 'welcome_paragraph_2', value: welcome.paragraph_2, section: 'welcome', type: 'textarea' },
                { key: 'welcome_image_url', value: welcome.image_url, section: 'welcome', type: 'url' }
            ];

            for (const update of updates) {
                await supabase.from('site_content').upsert(update, { onConflict: 'key' });
            }
            alert('Welcome section updated successfully!');
        } catch (error) {
            console.error('Error saving welcome content:', error);
        }
    };

    const saveCTA = async () => {
        try {
            const updates = [
                { key: 'cta_heading', value: cta.heading, section: 'cta', type: 'text' },
                { key: 'cta_subheading', value: cta.subheading, section: 'cta', type: 'textarea' }
            ];

            for (const update of updates) {
                await supabase.from('site_content').upsert(update, { onConflict: 'key' });
            }
            alert('CTA section updated successfully!');
        } catch (error) {
            console.error('Error saving CTA content:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Home Page Management</h2>
                    <p className="text-gray-600">Manage all content on the homepage</p>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 p-2">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'carousel', label: 'Hero Carousel', count: carousel.length },
                        { id: 'stats', label: 'Statistics', count: stats.length },
                        { id: 'features', label: 'Features', count: features.length },
                        { id: 'welcome', label: 'Welcome Section', count: 1 },
                        { id: 'cta', label: 'Call to Action', count: 1 }
                    ].map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeSection === section.id
                                    ? 'bg-royal-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {section.label} ({section.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Hero Carousel Section */}
            {activeSection === 'carousel' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Hero Carousel Slides</h3>
                        <button
                            onClick={() => setEditingSlide({ id: '', title: '', description: '', image_url: '', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Slide</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {carousel.map((slide) => (
                            <div key={slide.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                {slide.image_url && (
                                    <img src={slide.image_url} alt={slide.title} className="w-full h-48 object-cover" />
                                )}
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800 mb-1">{slide.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{slide.description}</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingSlide(slide)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteSlide(slide.id)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistics Section */}
            {activeSection === 'stats' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Homepage Statistics</h3>
                        <button
                            onClick={() => setEditingStat({ id: '', value: '', label: '', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Stat</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.map((stat) => (
                            <div key={stat.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-royal-700 mb-1">{stat.value}</p>
                                    <p className="text-sm text-gray-600 mb-3">{stat.label}</p>
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => setEditingStat(stat)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteStat(stat.id)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Features Section */}
            {activeSection === 'features' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Homepage Features</h3>
                        <button
                            onClick={() => setEditingFeature({ id: '', icon: 'Star', title: '', description: '', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Feature</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((feature) => (
                            <div key={feature.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="bg-royal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                                    <Star className="w-6 h-6 text-royal-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">{feature.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingFeature(feature)}
                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg flex-1"
                                    >
                                        <Edit className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => deleteFeature(feature.id)}
                                        className="text-red-600 hover:bg-red-50 p-2 rounded-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Welcome Section */}
            {activeSection === 'welcome' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Welcome Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                            <input
                                type="text"
                                value={welcome.heading}
                                onChange={(e) => setWelcome({ ...welcome, heading: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Paragraph</label>
                            <textarea
                                value={welcome.paragraph_1}
                                onChange={(e) => setWelcome({ ...welcome, paragraph_1: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Second Paragraph</label>
                            <textarea
                                value={welcome.paragraph_2}
                                onChange={(e) => setWelcome({ ...welcome, paragraph_2: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                            <input
                                type="url"
                                value={welcome.image_url}
                                onChange={(e) => setWelcome({ ...welcome, image_url: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <button
                            onClick={saveWelcome}
                            className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Welcome Section</span>
                        </button>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            {activeSection === 'cta' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Call to Action Section</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                            <input
                                type="text"
                                value={cta.heading}
                                onChange={(e) => setCTA({ ...cta, heading: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subheading</label>
                            <textarea
                                value={cta.subheading}
                                onChange={(e) => setCTA({ ...cta, subheading: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <button
                            onClick={saveCTA}
                            className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save CTA Section</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Modals for editing */}
            {editingSlide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">{editingSlide.id ? 'Edit Slide' : 'Add Slide'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={editingSlide.title}
                                onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={editingSlide.description}
                                onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="url"
                                placeholder="Image URL"
                                value={editingSlide.image_url}
                                onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingSlide(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveSlide(editingSlide)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingStat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">{editingStat.id ? 'Edit Stat' : 'Add Stat'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Value (e.g., 15+)"
                                value={editingStat.value}
                                onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Label"
                                value={editingStat.label}
                                onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingStat(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveStat(editingStat)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingFeature && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingFeature.id ? 'Edit Feature' : 'Add Feature'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={editingFeature.title}
                                onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <textarea
                                placeholder="Description"
                                value={editingFeature.description}
                                onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingFeature(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveFeature(editingFeature)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

