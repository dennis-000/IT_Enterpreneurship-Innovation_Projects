import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Calendar, FileText, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NewsPost {
    id?: string;
    title: string;
    excerpt: string;
    content: string;
    image_url: string | null;
    published_date: string;
    created_at?: string;
}

interface Event {
    id?: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    image_url: string | null;
    created_at?: string;
}

interface NewsEventsManagerProps {
    type: 'news' | 'events';
}

export default function NewsEventsManager({ type }: NewsEventsManagerProps) {
    const [items, setItems] = useState<(NewsPost | Event)[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState<NewsPost | Event | null>(null);
    const [formData, setFormData] = useState<NewsPost | Event>({
        title: '',
        excerpt: '',
        content: '',
        image_url: '',
        published_date: new Date().toISOString().split('T')[0],
        description: '',
        event_date: new Date().toISOString().split('T')[0],
        location: ''
    } as NewsPost | Event);

    useEffect(() => {
        fetchItems();
    }, [type]);

    const fetchItems = async () => {
        try {
            const tableName = type === 'news' ? 'news_posts' : 'events';
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const tableName = type === 'news' ? 'news_posts' : 'events';

            if (editingItem) {
                // Update existing item
                const { error } = await supabase
                    .from(tableName)
                    .update(formData)
                    .eq('id', editingItem.id);

                if (error) throw error;
            } else {
                // Create new item
                const { error } = await supabase
                    .from(tableName)
                    .insert([formData]);

                if (error) throw error;
            }

            // Reset form and refresh data
            setFormData({
                title: '',
                excerpt: '',
                content: '',
                image_url: '',
                published_date: new Date().toISOString().split('T')[0],
                description: '',
                event_date: new Date().toISOString().split('T')[0],
                location: ''
            } as NewsPost | Event);
            setShowForm(false);
            setEditingItem(null);
            fetchItems();
        } catch (error) {
            console.error(`Error ${editingItem ? 'updating' : 'creating'} ${type}:`, error);
        }
    };

    const handleEdit = (item: NewsPost | Event) => {
        setEditingItem(item);
        setFormData(item);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            const tableName = type === 'news' ? 'news_posts' : 'events';
            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchItems();
        } catch (error) {
            console.error(`Error deleting ${type}:`, error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            excerpt: '',
            content: '',
            image_url: '',
            published_date: new Date().toISOString().split('T')[0],
            description: '',
            event_date: new Date().toISOString().split('T')[0],
            location: ''
        } as NewsPost | Event);
        setShowForm(false);
        setEditingItem(null);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
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
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        Manage {type === 'news' ? 'News Posts' : 'Events'}
                    </h2>
                    <p className="text-gray-600">
                        {items.length} {type === 'news' ? 'posts' : 'events'} total
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add {type === 'news' ? 'News' : 'Event'}</span>
                </button>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingItem ? 'Edit' : 'Add'} {type === 'news' ? 'News Post' : 'Event'}
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
                                    placeholder={`Enter ${type === 'news' ? 'news' : 'event'} title`}
                                />
                            </div>

                            {type === 'news' ? (
                                <>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Excerpt</label>
                                        <textarea
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                            required
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none resize-none"
                                            placeholder="Enter news excerpt"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Content</label>
                                        <textarea
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none resize-none"
                                            placeholder="Enter news content"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Published Date</label>
                                        <input
                                            type="date"
                                            value={formData.published_date}
                                            onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            required
                                            rows={4}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none resize-none"
                                            placeholder="Enter event description"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Event Date</label>
                                            <input
                                                type="date"
                                                value={formData.event_date}
                                                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                required
                                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                                placeholder="Enter event location"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image_url || ''}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none"
                                    placeholder="Enter image URL (optional)"
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

            {/* Items List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {items.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {items.map((item, index) => (
                            <div key={item.id || index} className="p-6 hover:bg-gray-50">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            {type === 'news' ? (
                                                <FileText className="w-5 h-5 text-royal-600" />
                                            ) : (
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            )}
                                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                        </div>

                                        <p className="text-gray-600 mb-2">
                                            {type === 'news' ? item.excerpt : item.description}
                                        </p>

                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            <span>
                                                {type === 'news' ? 'Published' : 'Event Date'}: {formatDate(
                                                    type === 'news' ? item.published_date : item.event_date
                                                )}
                                            </span>
                                            {type === 'events' && (
                                                <span>Location: {item.location}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id!)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {type === 'news' ? (
                                <FileText className="w-8 h-8 text-gray-400" />
                            ) : (
                                <Calendar className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            No {type === 'news' ? 'news posts' : 'events'} yet
                        </h3>
                        <p className="text-gray-500 mb-4">
                            Get started by adding your first {type === 'news' ? 'news post' : 'event'}.
                        </p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 mx-auto transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add {type === 'news' ? 'News' : 'Event'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
