import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Feature {
    id: string;
    icon: string;
    title: string;
    description: string;
    order_index: number;
}

const availableIcons = [
    { name: 'BookOpen', label: 'Book' },
    { name: 'Users', label: 'Users/People' },
    { name: 'Award', label: 'Award/Trophy' },
    { name: 'Heart', label: 'Heart' },
    { name: 'Star', label: 'Star' },
    { name: 'Target', label: 'Target' },
    { name: 'Zap', label: 'Lightning' },
    { name: 'Shield', label: 'Shield' }
];

export default function FeaturesManager() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const { data, error } = await supabase
                .from('homepage_features')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setFeatures(data || []);
        } catch (error) {
            console.error('Error fetching features:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveFeature = async (feature: Partial<Feature>) => {
        try {
            if (feature.id) {
                const { error } = await supabase
                    .from('homepage_features')
                    .update(feature)
                    .eq('id', feature.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('homepage_features')
                    .insert([{ ...feature, order_index: features.length }]);
                if (error) throw error;
            }
            fetchFeatures();
            setEditingFeature(null);
        } catch (error) {
            console.error('Error saving feature:', error);
            alert('Error saving feature. Please try again.');
        }
    };

    const deleteFeature = async (id: string) => {
        if (!confirm('Are you sure you want to delete this feature?')) return;

        try {
            const { error } = await supabase
                .from('homepage_features')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchFeatures();
        } catch (error) {
            console.error('Error deleting feature:', error);
            alert('Error deleting feature. Please try again.');
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Homepage Features</h2>
                    <p className="text-gray-600">{features.length} features displayed on homepage</p>
                </div>
                <button
                    onClick={() => setEditingFeature({ id: '', icon: 'BookOpen', title: '', description: '', order_index: 0 })}
                    className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Feature</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature) => (
                    <div key={feature.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="bg-royal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                            <Star className="w-8 h-8 text-royal-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setEditingFeature(feature)}
                                className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => deleteFeature(feature.id)}
                                className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {features.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No features yet</h3>
                        <p className="text-gray-500">Add your first homepage feature to get started.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingFeature && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingFeature.id ? 'Edit Feature' : 'Add Feature'}
                            </h3>
                            <button
                                onClick={() => setEditingFeature(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                <select
                                    value={editingFeature.icon}
                                    onChange={(e) => setEditingFeature({ ...editingFeature, icon: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                >
                                    {availableIcons.map(icon => (
                                        <option key={icon.name} value={icon.name}>{icon.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingFeature.title}
                                    onChange={(e) => setEditingFeature({ ...editingFeature, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="e.g., Quality Education"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingFeature.description}
                                    onChange={(e) => setEditingFeature({ ...editingFeature, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="Brief description of this feature"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingFeature(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveFeature(editingFeature)}
                                    className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl transition-colors flex items-center space-x-2"
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

