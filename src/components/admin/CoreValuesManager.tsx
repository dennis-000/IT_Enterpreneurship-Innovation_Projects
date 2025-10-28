import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CoreValue {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
}

const availableIcons = [
    { name: 'Heart', label: 'Heart' },
    { name: 'Star', label: 'Star' },
    { name: 'Award', label: 'Award' },
    { name: 'Target', label: 'Target' },
    { name: 'Shield', label: 'Shield' },
    { name: 'Users', label: 'Community' },
    { name: 'BookOpen', label: 'Knowledge' },
    { name: 'Lightbulb', label: 'Innovation' }
];

export default function CoreValuesManager() {
    const [values, setValues] = useState<CoreValue[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null);

    useEffect(() => {
        fetchValues();
    }, []);

    const fetchValues = async () => {
        try {
            const { data, error } = await supabase
                .from('core_values')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setValues(data || []);
        } catch (error) {
            console.error('Error fetching values:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveValue = async (value: Partial<CoreValue>) => {
        try {
            if (value.id) {
                const { error } = await supabase
                    .from('core_values')
                    .update(value)
                    .eq('id', value.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('core_values')
                    .insert([{ ...value, order_index: values.length }]);
                if (error) throw error;
            }
            fetchValues();
            setEditingValue(null);
        } catch (error) {
            console.error('Error saving value:', error);
            alert('Error saving value. Please try again.');
        }
    };

    const deleteValue = async (id: string) => {
        if (!confirm('Are you sure you want to delete this core value?')) return;

        try {
            const { error } = await supabase
                .from('core_values')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchValues();
        } catch (error) {
            console.error('Error deleting value:', error);
            alert('Error deleting value. Please try again.');
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
                    <h2 className="text-2xl font-bold text-gray-800">Core Values</h2>
                    <p className="text-gray-600">{values.length} values displayed on About page</p>
                </div>
                <button
                    onClick={() => setEditingValue({ id: '', icon: 'Heart', title: '', description: '', order_index: 0 })}
                    className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Value</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value) => (
                    <div key={value.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="bg-tomato-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                            <Heart className="w-8 h-8 text-tomato-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{value.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{value.description}</p>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setEditingValue(value)}
                                className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => deleteValue(value.id)}
                                className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {values.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No core values yet</h3>
                        <p className="text-gray-500">Add your first core value to get started.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingValue && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingValue.id ? 'Edit Core Value' : 'Add Core Value'}
                            </h3>
                            <button
                                onClick={() => setEditingValue(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                <select
                                    value={editingValue.icon}
                                    onChange={(e) => setEditingValue({ ...editingValue, icon: e.target.value })}
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
                                    value={editingValue.title}
                                    onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="e.g., Integrity, Excellence, Respect"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingValue.description}
                                    onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="Describe this core value and what it means to your school"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingValue(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveValue(editingValue)}
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

