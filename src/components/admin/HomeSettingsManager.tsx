import { useState, useEffect } from 'react';
import { Save, Image, Plus, Trash2, Edit } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

export default function HomeSettingsManager() {
    const [carousel, setCarousel] = useState<CarouselSlide[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
    const [editingStat, setEditingStat] = useState<Stat | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [carouselRes, statsRes] = await Promise.all([
                supabase.from('carousel_slides').select('*').order('order_index'),
                supabase.from('homepage_stats').select('*').order('order_index')
            ]);

            setCarousel(carouselRes.data || []);
            setStats(statsRes.data || []);
        } catch (error) {
            console.error('Error fetching home settings:', error);
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
            fetchData();
            setEditingSlide(null);
        } catch (error) {
            console.error('Error saving slide:', error);
        }
    };

    const deleteSlide = async (id: string) => {
        if (!confirm('Delete this slide?')) return;
        try {
            await supabase.from('carousel_slides').delete().eq('id', id);
            fetchData();
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };

    const saveStat = async (stat: Partial<Stat>) => {
        try {
            if (stat.id) {
                await supabase.from('homepage_stats').update(stat).eq('id', stat.id);
            } else {
                await supabase.from('homepage_stats').insert([{ ...stat, order_index: stats.length }]);
            }
            fetchData();
            setEditingStat(null);
        } catch (error) {
            console.error('Error saving stat:', error);
        }
    };

    const deleteStat = async (id: string) => {
        if (!confirm('Delete this stat?')) return;
        try {
            await supabase.from('homepage_stats').delete().eq('id', id);
            fetchData();
        } catch (error) {
            console.error('Error deleting stat:', error);
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
            {/* Carousel Management */}
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

            {/* Stats Management */}
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

            {/* Edit Slide Modal */}
            {editingSlide && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {editingSlide.id ? 'Edit Slide' : 'Add Slide'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editingSlide.title}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={editingSlide.description}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={editingSlide.image_url}
                                    onChange={(e) => setEditingSlide({ ...editingSlide, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingSlide(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveSlide(editingSlide)}
                                    className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg flex items-center space-x-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Stat Modal */}
            {editingStat && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            {editingStat.id ? 'Edit Statistic' : 'Add Statistic'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                                <input
                                    type="text"
                                    value={editingStat.value}
                                    onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                                    placeholder="e.g., 15+"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={editingStat.label}
                                    onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-royal-500"
                                    placeholder="e.g., Years of Excellence"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingStat(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveStat(editingStat)}
                                    className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg flex items-center space-x-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

