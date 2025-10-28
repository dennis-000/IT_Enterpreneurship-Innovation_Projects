import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, Video, Save, X, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface GalleryItem {
    id?: string;
    title: string;
    media_url: string;
    media_type: 'photo' | 'video';
    category: string;
    created_at?: string;
}

interface GalleryManagerProps { }

export default function GalleryManager({ }: GalleryManagerProps) {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [formData, setFormData] = useState<GalleryItem>({
        title: '',
        media_url: '',
        media_type: 'photo',
        category: ''
    });
    const [filter, setFilter] = useState<'all' | 'photo' | 'video'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', ...Array.from(new Set(items.map(item => item.category)))];

    const filteredItems = items.filter(item => {
        const matchesType = filter === 'all' || item.media_type === filter;
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        return matchesType && matchesCategory;
    });

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery_items')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error('Error fetching gallery items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingItem) {
                // Update existing item
                const { error } = await supabase
                    .from('gallery_items')
                    .update(formData)
                    .eq('id', editingItem.id);

                if (error) throw error;
            } else {
                // Create new item
                const { error } = await supabase
                    .from('gallery_items')
                    .insert([formData]);

                if (error) throw error;
            }

            // Reset form and refresh data
            setFormData({
                title: '',
                media_url: '',
                media_type: 'photo',
                category: ''
            });
            setShowForm(false);
            setEditingItem(null);
            fetchItems();
        } catch (error) {
            console.error(`Error ${editingItem ? 'updating' : 'creating'} gallery item:`, error);
        }
    };

    const handleEdit = (item: GalleryItem) => {
        setEditingItem(item);
        setFormData(item);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gallery item?')) return;

        try {
            const { error } = await supabase
                .from('gallery_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error('Error deleting gallery item:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            media_url: '',
            media_type: 'photo',
            category: ''
        });
        setShowForm(false);
        setEditingItem(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Manage Gallery</h2>
                    <p className="text-gray-600">{items.length} items total</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all' ? 'bg-royal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Media
                        </button>
                        <button
                            onClick={() => setFilter('photo')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filter === 'photo' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Image className="w-4 h-4" />
                            <span>Photos</span>
                        </button>
                        <button
                            onClick={() => setFilter('video')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filter === 'video' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Video className="w-4 h-4" />
                            <span>Videos</span>
                        </button>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:border-royal-500 focus:outline-none"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingItem ? 'Edit' : 'Add'} Gallery Item
                            </h3>
                            <button
                                onClick={resetForm}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                    placeholder="Enter item title"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Media Type</label>
                                <select
                                    value={formData.media_type}
                                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value as 'photo' | 'video' })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                >
                                    <option value="photo">Photo</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Media URL</label>
                                <input
                                    type="url"
                                    value={formData.media_url}
                                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                    placeholder="Enter media URL"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                    placeholder="Enter category (e.g., Events, Sports, Academics)"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2 transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    <span>{editingItem ? 'Update' : 'Create'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Gallery Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filteredItems.map((item, index) => (
                            <div key={item.id || index} className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                    {item.media_type === 'photo' ? (
                                        <img
                                            src={item.media_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.nextElementSibling!.style.display = 'flex';
                                            }}
                                        />
                                    ) : (
                                        <video
                                            src={item.media_url}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    )}
                                    <div className="hidden w-full h-full items-center justify-center text-gray-400">
                                        <Image className="w-12 h-12" />
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                                        <div className="flex items-center space-x-1">
                                            {item.media_type === 'photo' ? (
                                                <Image className="w-4 h-4 text-blue-600" />
                                            ) : (
                                                <Video className="w-4 h-4 text-green-600" />
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                                    <p className="text-xs text-gray-500 mb-3">{formatDate(item.created_at!)}</p>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id!)}
                                            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center justify-center space-x-1 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Image className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No gallery items found</h3>
                        <p className="text-gray-500 mb-4">
                            {filter === 'all' && selectedCategory === 'all'
                                ? 'Get started by adding your first gallery item.'
                                : 'Try adjusting your filters to see more items.'
                            }
                        </p>
                        {(filter === 'all' && selectedCategory === 'all') && (
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 mx-auto transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Add Item</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
