import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, GraduationCap } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AcademicProgram {
    id: string;
    name: string;
    description: string;
    age_range: string;
    icon: string;
    features: string[];
    order_index: number;
}

export default function AcademicProgramsManager() {
    const [programs, setPrograms] = useState<AcademicProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingProgram, setEditingProgram] = useState<AcademicProgram | null>(null);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const { data, error } = await supabase
                .from('academic_programs')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setPrograms(data || []);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveProgram = async (program: Partial<AcademicProgram>) => {
        try {
            if (program.id) {
                const { error } = await supabase
                    .from('academic_programs')
                    .update(program)
                    .eq('id', program.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('academic_programs')
                    .insert([{ ...program, order_index: programs.length }]);
                if (error) throw error;
            }
            fetchPrograms();
            setEditingProgram(null);
        } catch (error) {
            console.error('Error saving program:', error);
            alert('Error saving program. Please try again.');
        }
    };

    const deleteProgram = async (id: string) => {
        if (!confirm('Are you sure you want to delete this program?')) return;

        try {
            const { error } = await supabase
                .from('academic_programs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPrograms();
        } catch (error) {
            console.error('Error deleting program:', error);
            alert('Error deleting program. Please try again.');
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
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Academic Programs</h2>
                    <p className="text-sm sm:text-base text-gray-600">{programs.length} programs</p>
                </div>
                <button
                    onClick={() => setEditingProgram({
                        id: '',
                        name: '',
                        description: '',
                        age_range: '',
                        icon: '',
                        features: [],
                        order_index: 0
                    })}
                    className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Add Program</span>
                </button>
            </div>

            {/* Programs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {programs.map((program) => (
                    <div key={program.id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-royal-100 p-3 rounded-xl">
                                    <GraduationCap className="w-6 h-6 text-royal-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{program.name}</h3>
                                    <p className="text-sm text-royal-600">{program.age_range}</p>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">{program.description}</p>

                        {program.features && program.features.length > 0 && (
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-700 mb-2">Features:</p>
                                <ul className="space-y-1">
                                    {program.features.slice(0, 3).map((feature, idx) => (
                                        <li key={idx} className="text-xs text-gray-600 flex items-start">
                                            <span className="text-royal-600 mr-2">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setEditingProgram(program)}
                                className="flex-1 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                            <button
                                onClick={() => deleteProgram(program.id)}
                                className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {programs.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No programs yet</h3>
                        <p className="text-gray-500">Add your first academic program to get started.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingProgram && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                                {editingProgram.id ? 'Edit Program' : 'Add Program'}
                            </h3>
                            <button
                                onClick={() => setEditingProgram(null)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Program Name</label>
                                <input
                                    type="text"
                                    value={editingProgram.name}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="e.g., Creche, Nursery, Primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Age Range</label>
                                <input
                                    type="text"
                                    value={editingProgram.age_range}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, age_range: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="e.g., Ages 1-2 years"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingProgram.description}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="Describe the program"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Features (one per line)
                                </label>
                                <textarea
                                    value={editingProgram.features?.join('\n') || ''}
                                    onChange={(e) => setEditingProgram({
                                        ...editingProgram,
                                        features: e.target.value.split('\n').filter(f => f.trim())
                                    })}
                                    rows={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent text-sm sm:text-base"
                                    placeholder="Enter each feature on a new line"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                                <button
                                    onClick={() => setEditingProgram(null)}
                                    className="px-4 sm:px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveProgram(editingProgram)}
                                    className="px-4 sm:px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm"
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

