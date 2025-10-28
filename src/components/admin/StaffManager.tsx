import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface StaffMember {
    id: string;
    name: string;
    position: string;
    image_url: string;
    bio: string;
    order_index: number;
}

export default function StaffManager() {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const { data, error } = await supabase
                .from('staff_members')
                .select('*')
                .order('order_index');

            if (error) throw error;
            setStaff(data || []);
        } catch (error) {
            console.error('Error fetching staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveStaff = async (member: Partial<StaffMember>) => {
        try {
            if (member.id) {
                const { error } = await supabase
                    .from('staff_members')
                    .update(member)
                    .eq('id', member.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('staff_members')
                    .insert([{ ...member, order_index: staff.length }]);
                if (error) throw error;
            }
            fetchStaff();
            setEditingStaff(null);
        } catch (error) {
            console.error('Error saving staff member:', error);
            alert('Error saving staff member. Please try again.');
        }
    };

    const deleteStaff = async (id: string) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const { error } = await supabase
                .from('staff_members')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchStaff();
        } catch (error) {
            console.error('Error deleting staff member:', error);
            alert('Error deleting staff member. Please try again.');
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
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
                    <p className="text-gray-600">{staff.length} staff members</p>
                </div>
                <button
                    onClick={() => setEditingStaff({ id: '', name: '', position: '', image_url: '', bio: '', order_index: 0 })}
                    className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Staff Member</span>
                </button>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <div key={member.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                            {member.image_url ? (
                                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-24 h-24 text-gray-400" />
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-800 mb-1">{member.name}</h3>
                            <p className="text-sm text-royal-600 font-semibold mb-2">{member.position}</p>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-3">{member.bio}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setEditingStaff(member)}
                                    className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center space-x-1"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span className="text-sm">Edit</span>
                                </button>
                                <button
                                    onClick={() => deleteStaff(member.id)}
                                    className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {staff.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No staff members yet</h3>
                        <p className="text-gray-500">Add your first staff member to get started.</p>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingStaff && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingStaff.id ? 'Edit Staff Member' : 'Add Staff Member'}
                            </h3>
                            <button
                                onClick={() => setEditingStaff(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={editingStaff.name}
                                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="Enter staff member name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                                <input
                                    type="text"
                                    value={editingStaff.position}
                                    onChange={(e) => setEditingStaff({ ...editingStaff, position: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="e.g., Principal, Vice Principal, Teacher"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    value={editingStaff.image_url}
                                    onChange={(e) => setEditingStaff({ ...editingStaff, image_url: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="Enter image URL"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                                <textarea
                                    value={editingStaff.bio}
                                    onChange={(e) => setEditingStaff({ ...editingStaff, bio: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                    placeholder="Enter staff member biography"
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingStaff(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveStaff(editingStaff)}
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

