import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ClipboardList, FileCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdmissionStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
}

interface Requirement {
    id: string;
    requirement: string;
    order_index: number;
}

const availableIcons = [
    { name: 'FileText', label: 'Document' },
    { name: 'Calendar', label: 'Calendar' },
    { name: 'UserPlus', label: 'Add User' },
    { name: 'CheckCircle', label: 'Check Circle' },
    { name: 'Clipboard', label: 'Clipboard' },
    { name: 'Send', label: 'Send' }
];

export default function AdmissionsContentManager() {
    const [steps, setSteps] = useState<AdmissionStep[]>([]);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStep, setEditingStep] = useState<AdmissionStep | null>(null);
    const [editingRequirement, setEditingRequirement] = useState<Requirement | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [stepsRes, reqsRes] = await Promise.all([
                supabase.from('admission_steps').select('*').order('order_index'),
                supabase.from('admission_requirements').select('*').order('order_index')
            ]);

            setSteps(stepsRes.data || []);
            setRequirements(reqsRes.data || []);
        } catch (error) {
            console.error('Error fetching admissions content:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveStep = async (step: Partial<AdmissionStep>) => {
        try {
            if (step.id) {
                const { error } = await supabase
                    .from('admission_steps')
                    .update(step)
                    .eq('id', step.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('admission_steps')
                    .insert([{ ...step, order_index: steps.length }]);
                if (error) throw error;
            }
            fetchData();
            setEditingStep(null);
        } catch (error) {
            console.error('Error saving step:', error);
            alert('Error saving step. Please try again.');
        }
    };

    const deleteStep = async (id: string) => {
        if (!confirm('Delete this step?')) return;
        try {
            const { error } = await supabase.from('admission_steps').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error('Error deleting step:', error);
        }
    };

    const saveRequirement = async (req: Partial<Requirement>) => {
        try {
            if (req.id) {
                const { error } = await supabase
                    .from('admission_requirements')
                    .update(req)
                    .eq('id', req.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('admission_requirements')
                    .insert([{ ...req, order_index: requirements.length }]);
                if (error) throw error;
            }
            fetchData();
            setEditingRequirement(null);
        } catch (error) {
            console.error('Error saving requirement:', error);
            alert('Error saving requirement. Please try again.');
        }
    };

    const deleteRequirement = async (id: string) => {
        if (!confirm('Delete this requirement?')) return;
        try {
            const { error } = await supabase.from('admission_requirements').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error('Error deleting requirement:', error);
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
        <div className="space-y-8">
            {/* Admission Steps */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Admission Process Steps</h2>
                        <p className="text-gray-600">{steps.length} steps</p>
                    </div>
                    <button
                        onClick={() => setEditingStep({ id: '', icon: 'FileText', title: '', description: '', order_index: 0 })}
                        className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Step</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 relative">
                            <div className="absolute -top-2 -left-2 bg-royal-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>
                            <div className="bg-royal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-3 mx-auto">
                                <ClipboardList className="w-6 h-6 text-royal-600" />
                            </div>
                            <h3 className="font-bold text-center mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-600 text-center mb-3">{step.description}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setEditingStep(step)}
                                    className="flex-1 px-2 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                                >
                                    <Edit className="w-3 h-3 mx-auto" />
                                </button>
                                <button
                                    onClick={() => deleteStep(step.id)}
                                    className="px-2 py-1 text-xs text-red-600 border border-red-600 rounded hover:bg-red-50"
                                >
                                    <Trash2 className="w-3 h-3 mx-auto" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Required Documents */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Required Documents</h2>
                        <p className="text-gray-600">{requirements.length} requirements</p>
                    </div>
                    <button
                        onClick={() => setEditingRequirement({ id: '', requirement: '', order_index: 0 })}
                        className="bg-tomato-600 hover:bg-tomato-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Requirement</span>
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <ul className="space-y-3">
                        {requirements.map((req) => (
                            <li key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                                <div className="flex items-center space-x-3">
                                    <FileCheck className="w-5 h-5 text-tomato-600 flex-shrink-0" />
                                    <span className="text-gray-700">{req.requirement}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingRequirement(req)}
                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteRequirement(req.id)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Edit Step Modal */}
            {editingStep && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingStep.id ? 'Edit Step' : 'Add Step'}
                            </h3>
                            <button onClick={() => setEditingStep(null)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                <select
                                    value={editingStep.icon}
                                    onChange={(e) => setEditingStep({ ...editingStep, icon: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
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
                                    value={editingStep.title}
                                    onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={editingStep.description}
                                    onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingStep(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveStep(editingStep)}
                                    className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Requirement Modal */}
            {editingRequirement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingRequirement.id ? 'Edit Requirement' : 'Add Requirement'}
                            </h3>
                            <button onClick={() => setEditingRequirement(null)} className="text-gray-500 hover:text-gray-700">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Requirement</label>
                                <input
                                    type="text"
                                    value={editingRequirement.requirement}
                                    onChange={(e) => setEditingRequirement({ ...editingRequirement, requirement: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                                    placeholder="e.g., Birth certificate of the child"
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setEditingRequirement(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => saveRequirement(editingRequirement)}
                                    className="px-6 py-2 bg-tomato-600 hover:bg-tomato-700 text-white rounded-xl flex items-center space-x-2"
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

