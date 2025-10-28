import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, FileText } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import AdmissionsManager from '../AdmissionsManager';

interface AdmissionStep {
    id: string;
    title: string;
    description: string;
    icon: string;
    order_index: number;
}

interface RequiredDocument {
    id: string;
    document_name: string;
    order_index: number;
}

interface ContactInfo {
    phone: string;
    email: string;
}

export default function AdmissionsPageManager() {
    const [steps, setSteps] = useState<AdmissionStep[]>([]);
    const [documents, setDocuments] = useState<RequiredDocument[]>([]);
    const [contactInfo, setContactInfo] = useState<ContactInfo>({ phone: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'steps' | 'documents' | 'contact' | 'inquiries'>('steps');
    const [inquiriesCount, setInquiriesCount] = useState(0);
    const [editingStep, setEditingStep] = useState<AdmissionStep | null>(null);
    const [editingDoc, setEditingDoc] = useState<RequiredDocument | null>(null);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [stepsRes, docsRes, contactRes, inquiriesRes] = await Promise.all([
                supabase.from('admission_steps').select('*').order('order_index'),
                supabase.from('required_documents').select('*').order('order_index'),
                supabase.from('site_content').select('*').in('key', ['admissions_phone', 'admissions_email']),
                supabase.from('admission_inquiries').select('*', { count: 'exact', head: true })
            ]);

            setSteps(stepsRes.data || []);
            setDocuments(docsRes.data || []);
            setInquiriesCount(inquiriesRes.count || 0);

            const contactMap: Record<string, string> = {};
            contactRes.data?.forEach(item => {
                contactMap[item.key] = item.value;
            });

            setContactInfo({
                phone: contactMap.admissions_phone || '+233 24 123 4567',
                email: contactMap.admissions_email || 'admissions@fountaingate.edu.gh'
            });
        } catch (error) {
            console.error('Error fetching admissions data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveStep = async (step: Partial<AdmissionStep>) => {
        try {
            if (step.id) {
                await supabase.from('admission_steps').update(step).eq('id', step.id);
            } else {
                await supabase.from('admission_steps').insert([{ ...step, order_index: steps.length }]);
            }
            fetchAllData();
            setEditingStep(null);
        } catch (error) {
            console.error('Error saving step:', error);
        }
    };

    const deleteStep = async (id: string) => {
        if (!confirm('Delete this step?')) return;
        await supabase.from('admission_steps').delete().eq('id', id);
        fetchAllData();
    };

    const saveDocument = async (doc: Partial<RequiredDocument>) => {
        try {
            if (doc.id) {
                await supabase.from('required_documents').update(doc).eq('id', doc.id);
            } else {
                await supabase.from('required_documents').insert([{ ...doc, order_index: documents.length }]);
            }
            fetchAllData();
            setEditingDoc(null);
        } catch (error) {
            console.error('Error saving document:', error);
        }
    };

    const deleteDocument = async (id: string) => {
        if (!confirm('Delete this document?')) return;
        await supabase.from('required_documents').delete().eq('id', id);
        fetchAllData();
    };

    const saveContact = async () => {
        try {
            const updates = [
                { key: 'admissions_phone', value: contactInfo.phone, section: 'admissions', type: 'text' },
                { key: 'admissions_email', value: contactInfo.email, section: 'admissions', type: 'text' }
            ];

            for (const update of updates) {
                await supabase.from('site_content').upsert(update, { onConflict: 'key' });
            }
            alert('Contact information updated successfully!');
        } catch (error) {
            console.error('Error saving contact info:', error);
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
                <h2 className="text-2xl font-bold text-gray-800">Admissions Page Management</h2>
                <p className="text-gray-600">Manage all content on the Admissions page</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-2">
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'steps', label: 'Admission Steps', count: steps.length },
                        { id: 'documents', label: 'Required Documents', count: documents.length },
                        { id: 'contact', label: 'Contact Info', count: 2 },
                        { id: 'inquiries', label: 'Inquiries', count: inquiriesCount }
                    ].map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`px-4 py-2 rounded-lg font-medium ${activeSection === section.id ? 'bg-royal-600 text-white' : 'bg-gray-100'
                                }`}
                        >
                            {section.label} ({section.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Admission Steps */}
            {activeSection === 'steps' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Admission Process Steps</h3>
                        <button
                            onClick={() => setEditingStep({ id: '', title: '', description: '', icon: 'FileText', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Step</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {steps.map((step, index) => (
                            <div key={step.id} className="border border-gray-200 rounded-xl p-4 relative">
                                <div className="absolute -top-3 -left-3 bg-tomato-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    {index + 1}
                                </div>
                                <h4 className="font-semibold text-gray-800 mt-2 mb-2">{step.title}</h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{step.description}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingStep(step)}
                                        className="flex-1 text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => deleteStep(step.id)}
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

            {/* Required Documents */}
            {activeSection === 'documents' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Required Documents</h3>
                        <button
                            onClick={() => setEditingDoc({ id: '', document_name: '', order_index: 0 })}
                            className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add Document</span>
                        </button>
                    </div>

                    <div className="space-y-2">
                        {documents.map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3">
                                    <FileText className="w-5 h-5 text-tomato-600" />
                                    <span className="text-gray-700">{doc.document_name}</span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setEditingDoc(doc)}
                                        className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteDocument(doc.id)}
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

            {/* Contact Info */}
            {activeSection === 'contact' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Admissions Contact Information</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={contactInfo.email}
                                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500"
                            />
                        </div>
                        <button
                            onClick={saveContact}
                            className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Contact Info</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Inquiries */}
            {activeSection === 'inquiries' && <AdmissionsManager />}

            {/* Edit Step Modal */}
            {editingStep && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingStep.id ? 'Edit Step' : 'Add Step'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={editingStep.title}
                                onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <textarea
                                placeholder="Description"
                                value={editingStep.description}
                                onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingStep(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveStep(editingStep)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Document Modal */}
            {editingDoc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">{editingDoc.id ? 'Edit Document' : 'Add Document'}</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Document name (e.g., Birth certificate of the child)"
                                value={editingDoc.document_name}
                                onChange={(e) => setEditingDoc({ ...editingDoc, document_name: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <div className="flex space-x-3">
                                <button onClick={() => setEditingDoc(null)} className="px-4 py-2 border rounded-xl">Cancel</button>
                                <button onClick={() => saveDocument(editingDoc)} className="px-4 py-2 bg-royal-600 text-white rounded-xl">Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
