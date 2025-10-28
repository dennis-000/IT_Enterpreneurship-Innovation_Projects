import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, BookOpen, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Program {
    id: string;
    title: string;
    icon: string;
    color_from: string;
    color_to: string;
    bg_color_from: string;
    bg_color_to: string;
    description: string;
    features: string[];
    curriculum: string[];
    order_index: number;
}

interface Facility {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
}

interface ExcellenceStats {
    bece_pass_rate: string;
    category_a_rate: string;
    awards_won: string;
}

export default function AcademicsPageManager() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [stats, setStats] = useState<ExcellenceStats>({
        bece_pass_rate: '98%',
        category_a_rate: '85%',
        awards_won: '50+'
    });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'programs' | 'facilities' | 'stats'>('programs');
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [programsRes, facilitiesRes, statsRes] = await Promise.all([
                supabase.from('academic_programs').select('*').order('order_index'),
                supabase.from('academic_facilities').select('*').order('order_index'),
                supabase.from('site_content').select('*').in('key', ['bece_pass_rate', 'category_a_rate', 'awards_won'])
            ]);

            setPrograms(programsRes.data || []);
            setFacilities(facilitiesRes.data || []);

            const statsMap: Record<string, string> = {};
            statsRes.data?.forEach(item => {
                statsMap[item.key] = item.value;
            });

            setStats({
                bece_pass_rate: statsMap.bece_pass_rate || '98%',
                category_a_rate: statsMap.category_a_rate || '85%',
                awards_won: statsMap.awards_won || '50+'
            });
        } catch (error) {
            console.error('Error fetching academics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveProgram = async (program: Partial<Program>) => {
        try {
            if (program.id) {
                await supabase.from('academic_programs').update(program).eq('id', program.id);
            } else {
                await supabase.from('academic_programs').insert([{ ...program, order_index: programs.length }]);
            }
            fetchAllData();
            setEditingProgram(null);
        } catch (error) {
            console.error('Error saving program:', error);
        }
    };

    const deleteProgram = async (id: string) => {
        if (!confirm('Delete this program?')) return;
        await supabase.from('academic_programs').delete().eq('id', id);
        fetchAllData();
    };

    const saveFacility = async (facility: Partial<Facility>) => {
        try {
            if (facility.id) {
                await supabase.from('academic_facilities').update(facility).eq('id', facility.id);
            } else {
                await supabase.from('academic_facilities').insert([{ ...facility, order_index: facilities.length }]);
            }
            fetchAllData();
            setEditingFacility(null);
        } catch (error) {
            console.error('Error saving facility:', error);
        }
    };

    const deleteFacility = async (id: string) => {
        if (!confirm('Delete this facility?')) return;
        await supabase.from('academic_facilities').delete().eq('id', id);
        fetchAllData();
    };

    const saveStats = async () => {
        try {
            const updates = [
                { key: 'bece_pass_rate', value: stats.bece_pass_rate, section: 'academics', type: 'text' },
                { key: 'category_a_rate', value: stats.category_a_rate, section: 'academics', type: 'text' },
                { key: 'awards_won', value: stats.awards_won, section: 'academics', type: 'text' }
            ];

            for (const update of updates) {
                await supabase.from('site_content').upsert(update, { onConflict: 'key' });
            }
            alert('Academic excellence stats updated successfully!');
        } catch (error) {
            console.error('Error saving stats:', error);
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
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Academics Page Management</h2>
                <p className="text-gray-600">Manage all content on the Academics page</p>
            </div>

            {/* Section Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 p-2">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'programs', label: 'Academic Programs', count: programs.length },
                        { id: 'facilities', label: 'Facilities', count: facilities.length },
                        { id: 'stats', label: 'Excellence Stats', count: 3 }
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

            {/* Programs Section */}
            {activeSection === 'programs' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Academic Programs</h3>
                        <button
                            onClick={() => setEditingProgram({
                                id: '',
                                title: '',
                                icon: 'BookOpen',
                                color_from: 'pink-500',
                                color_to: 'rose-500',
                                bg_color_from: 'pink-50',
                                bg_color_to: 'rose-50',
                                description: '',
                                features: [],
                                curriculum: [],
                                order_index: 0
                            })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Program</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {programs.map((program) => (
                            <div key={program.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-800 mb-2">{program.title}</h4>
                                        <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Features ({program.features.length}):</p>
                                                <ul className="text-xs text-gray-600">
                                                    {program.features.slice(0, 3).map((f, i) => (
                                                        <li key={i} className="truncate">• {f}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Curriculum ({program.curriculum.length}):</p>
                                                <ul className="text-xs text-gray-600">
                                                    {program.curriculum.slice(0, 3).map((c, i) => (
                                                        <li key={i} className="truncate">• {c}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => setEditingProgram(program)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteProgram(program.id)}
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

            {/* Facilities Section */}
            {activeSection === 'facilities' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Academic Facilities</h3>
                        <button
                            onClick={() => setEditingFacility({ id: '', title: '', description: '', icon: 'BookOpen', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Facility</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {facilities.map((facility) => (
                            <div key={facility.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="bg-royal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                                    <BookOpen className="w-6 h-6 text-royal-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">{facility.title}</h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{facility.description}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingFacility(facility)}
                                        className="flex-1 text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => deleteFacility(facility.id)}
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

            {/* Excellence Stats Section */}
            {activeSection === 'stats' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Academic Excellence Statistics</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">BECE Pass Rate</label>
                            <input
                                type="text"
                                value={stats.bece_pass_rate}
                                onChange={(e) => setStats({ ...stats, bece_pass_rate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                placeholder="e.g., 98%"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category A Schools Placement</label>
                            <input
                                type="text"
                                value={stats.category_a_rate}
                                onChange={(e) => setStats({ ...stats, category_a_rate: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                placeholder="e.g., 85%"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Awards Won</label>
                            <input
                                type="text"
                                value={stats.awards_won}
                                onChange={(e) => setStats({ ...stats, awards_won: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                placeholder="e.g., 50+"
                            />
                        </div>
                        <button
                            onClick={saveStats}
                            className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Stats</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Program Modal */}
            {editingProgram && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{editingProgram.id ? 'Edit Program' : 'Add Program'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title (e.g., Creche, Primary School)"
                                value={editingProgram.title}
                                onChange={(e) => setEditingProgram({ ...editingProgram, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <textarea
                                placeholder="Description"
                                value={editingProgram.description}
                                onChange={(e) => setEditingProgram({ ...editingProgram, description: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                                <textarea
                                    placeholder="Enter features, one per line"
                                    value={editingProgram.features.join('\n')}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, features: e.target.value.split('\n').filter(f => f.trim()) })}
                                    rows={5}
                                    className="w-full px-4 py-2 border rounded-xl"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Curriculum (one per line)</label>
                                <textarea
                                    placeholder="Enter curriculum items, one per line"
                                    value={editingProgram.curriculum.join('\n')}
                                    onChange={(e) => setEditingProgram({ ...editingProgram, curriculum: e.target.value.split('\n').filter(c => c.trim()) })}
                                    rows={5}
                                    className="w-full px-4 py-2 border rounded-xl"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingProgram(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveProgram(editingProgram)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Facility Modal */}
            {editingFacility && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingFacility.id ? 'Edit Facility' : 'Add Facility'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={editingFacility.title}
                                onChange={(e) => setEditingFacility({ ...editingFacility, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <textarea
                                placeholder="Description"
                                value={editingFacility.description}
                                onChange={(e) => setEditingFacility({ ...editingFacility, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingFacility(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveFacility(editingFacility)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

