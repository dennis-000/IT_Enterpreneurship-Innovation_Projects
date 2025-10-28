import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, User, Heart, Target, Eye, History } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface AboutContent {
    mission_text: string;
    vision_text: string;
    history_paragraph_1: string;
    history_paragraph_2: string;
    history_paragraph_3: string;
}

interface CoreValue {
    id: string;
    icon: string;
    title: string;
    description: string;
    order_index: number;
}

interface StaffMember {
    id: string;
    name: string;
    position: string;
    image_url: string;
    bio: string;
    order_index: number;
}

export default function AboutPageManager() {
    const [content, setContent] = useState<AboutContent>({
        mission_text: '',
        vision_text: '',
        history_paragraph_1: '',
        history_paragraph_2: '',
        history_paragraph_3: ''
    });
    const [values, setValues] = useState<CoreValue[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'content' | 'values' | 'staff'>('content');
    const [editingValue, setEditingValue] = useState<CoreValue | null>(null);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [contentRes, valuesRes, staffRes] = await Promise.all([
                supabase.from('site_content').select('*').in('key', [
                    'mission_text', 'vision_text',
                    'history_paragraph_1', 'history_paragraph_2', 'history_paragraph_3'
                ]),
                supabase.from('core_values').select('*').order('order_index'),
                supabase.from('staff_members').select('*').order('order_index')
            ]);

            // Parse content
            const contentMap: Record<string, string> = {};
            contentRes.data?.forEach(item => {
                contentMap[item.key] = item.value;
            });

            setContent({
                mission_text: contentMap.mission_text || '',
                vision_text: contentMap.vision_text || '',
                history_paragraph_1: contentMap.history_paragraph_1 || '',
                history_paragraph_2: contentMap.history_paragraph_2 || '',
                history_paragraph_3: contentMap.history_paragraph_3 || ''
            });

            setValues(valuesRes.data || []);
            setStaff(staffRes.data || []);
        } catch (error) {
            console.error('Error fetching about page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveContent = async () => {
        try {
            const updates = [
                { key: 'mission_text', value: content.mission_text, section: 'mission', type: 'textarea' },
                { key: 'vision_text', value: content.vision_text, section: 'vision', type: 'textarea' },
                { key: 'history_paragraph_1', value: content.history_paragraph_1, section: 'history', type: 'textarea' },
                { key: 'history_paragraph_2', value: content.history_paragraph_2, section: 'history', type: 'textarea' },
                { key: 'history_paragraph_3', value: content.history_paragraph_3, section: 'history', type: 'textarea' }
            ];

            for (const update of updates) {
                await supabase.from('site_content').upsert(update, { onConflict: 'key' });
            }
            alert('Content updated successfully!');
        } catch (error) {
            console.error('Error saving content:', error);
        }
    };

    const saveValue = async (value: Partial<CoreValue>) => {
        try {
            if (value.id) {
                await supabase.from('core_values').update(value).eq('id', value.id);
            } else {
                await supabase.from('core_values').insert([{ ...value, order_index: values.length }]);
            }
            fetchAllData();
            setEditingValue(null);
        } catch (error) {
            console.error('Error saving value:', error);
        }
    };

    const deleteValue = async (id: string) => {
        if (!confirm('Delete this core value?')) return;
        await supabase.from('core_values').delete().eq('id', id);
        fetchAllData();
    };

    const saveStaff = async (member: Partial<StaffMember>) => {
        try {
            if (member.id) {
                await supabase.from('staff_members').update(member).eq('id', member.id);
            } else {
                await supabase.from('staff_members').insert([{ ...member, order_index: staff.length }]);
            }
            fetchAllData();
            setEditingStaff(null);
        } catch (error) {
            console.error('Error saving staff member:', error);
        }
    };

    const deleteStaff = async (id: string) => {
        if (!confirm('Delete this staff member?')) return;
        await supabase.from('staff_members').delete().eq('id', id);
        fetchAllData();
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
                <h2 className="text-2xl font-bold text-gray-800">About Page Management</h2>
                <p className="text-gray-600">Manage all content on the About Us page</p>
            </div>

            {/* Section Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 p-2">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'content', label: 'Mission/Vision/History', count: 5 },
                        { id: 'values', label: 'Core Values', count: values.length },
                        { id: 'staff', label: 'Staff/Leadership', count: staff.length }
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

            {/* Mission/Vision/History Section */}
            {activeSection === 'content' && (
                <div className="space-y-6">
                    {/* Mission */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-royal-100 p-3 rounded-xl">
                                <Target className="w-6 h-6 text-royal-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Mission Statement</h3>
                        </div>
                        <textarea
                            value={content.mission_text}
                            onChange={(e) => setContent({ ...content, mission_text: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            placeholder="Enter your school's mission statement..."
                        />
                    </div>

                    {/* Vision */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-tomato-100 p-3 rounded-xl">
                                <Eye className="w-6 h-6 text-tomato-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Vision Statement</h3>
                        </div>
                        <textarea
                            value={content.vision_text}
                            onChange={(e) => setContent({ ...content, vision_text: e.target.value })}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            placeholder="Enter your school's vision statement..."
                        />
                    </div>

                    {/* History */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="bg-blue-100 p-3 rounded-xl">
                                <History className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">School History</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Paragraph</label>
                                <textarea
                                    value={content.history_paragraph_1}
                                    onChange={(e) => setContent({ ...content, history_paragraph_1: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Second Paragraph</label>
                                <textarea
                                    value={content.history_paragraph_2}
                                    onChange={(e) => setContent({ ...content, history_paragraph_2: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Third Paragraph</label>
                                <textarea
                                    value={content.history_paragraph_3}
                                    onChange={(e) => setContent({ ...content, history_paragraph_3: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={saveContent}
                        className="px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>Save All Content</span>
                    </button>
                </div>
            )}

            {/* Core Values Section */}
            {activeSection === 'values' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Core Values</h3>
                        <button
                            onClick={() => setEditingValue({ id: '', icon: 'Heart', title: '', description: '', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Value</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {values.map((value) => (
                            <div key={value.id} className="border border-gray-200 rounded-xl p-4">
                                <div className="bg-tomato-100 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
                                    <Heart className="w-6 h-6 text-tomato-600" />
                                </div>
                                <h4 className="font-semibold text-gray-800 mb-2">{value.title}</h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{value.description}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingValue(value)}
                                        className="flex-1 text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => deleteValue(value.id)}
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

            {/* Staff Section */}
            {activeSection === 'staff' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Staff & Leadership</h3>
                        <button
                            onClick={() => setEditingStaff({ id: '', name: '', position: '', image_url: '', bio: '', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Staff Member</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {staff.map((member) => (
                            <div key={member.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                                    {member.image_url ? (
                                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-24 h-24 text-gray-400" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-800">{member.name}</h4>
                                    <p className="text-sm text-royal-600 font-semibold mb-2">{member.position}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{member.bio}</p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingStaff(member)}
                                            className="flex-1 text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                        >
                                            <Edit className="w-4 h-4 mx-auto" />
                                        </button>
                                        <button
                                            onClick={() => deleteStaff(member.id)}
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

            {/* Edit Value Modal */}
            {editingValue && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingValue.id ? 'Edit Value' : 'Add Value'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={editingValue.title}
                                onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <textarea
                                placeholder="Description"
                                value={editingValue.description}
                                onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingValue(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveValue(editingValue)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Staff Modal */}
            {editingStaff && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{editingStaff.id ? 'Edit Staff Member' : 'Add Staff Member'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={editingStaff.name}
                                onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Position"
                                value={editingStaff.position}
                                onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="url"
                                placeholder="Image URL"
                                value={editingStaff.image_url}
                                onChange={(e) => setEditingStaff({ ...editingStaff, image_url: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <textarea
                                placeholder="Bio"
                                value={editingStaff.bio}
                                onChange={(e) => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingStaff(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveStaff(editingStaff)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

