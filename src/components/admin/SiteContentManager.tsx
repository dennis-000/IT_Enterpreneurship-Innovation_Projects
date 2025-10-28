import { useState, useEffect } from 'react';
import { Save, Edit, X, Info, Target, Eye, History, BookOpen, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SiteContent {
    id: string;
    section: string;
    key: string;
    value: string;
    type: 'text' | 'textarea' | 'html' | 'url' | 'json';
}

interface ContentSection {
    title: string;
    icon: any;
    color: string;
    fields: {
        key: string;
        label: string;
        type: 'text' | 'textarea' | 'html' | 'url';
        placeholder?: string;
    }[];
}

const contentSections: Record<string, ContentSection> = {
    mission: {
        title: 'Mission Statement',
        icon: Target,
        color: 'royal',
        fields: [
            { key: 'mission_text', label: 'Mission Statement', type: 'textarea', placeholder: 'Enter your school mission statement...' }
        ]
    },
    vision: {
        title: 'Vision Statement',
        icon: Eye,
        color: 'tomato',
        fields: [
            { key: 'vision_text', label: 'Vision Statement', type: 'textarea', placeholder: 'Enter your school vision statement...' }
        ]
    },
    history: {
        title: 'School History',
        icon: History,
        color: 'blue',
        fields: [
            { key: 'history_paragraph_1', label: 'First Paragraph', type: 'textarea' },
            { key: 'history_paragraph_2', label: 'Second Paragraph', type: 'textarea' },
            { key: 'history_paragraph_3', label: 'Third Paragraph', type: 'textarea' }
        ]
    },
    welcome: {
        title: 'Home - Welcome Section',
        icon: Info,
        color: 'green',
        fields: [
            { key: 'welcome_heading', label: 'Heading', type: 'text', placeholder: 'Building Tomorrow\'s Leaders Today' },
            { key: 'welcome_paragraph_1', label: 'First Paragraph', type: 'textarea' },
            { key: 'welcome_paragraph_2', label: 'Second Paragraph', type: 'textarea' },
            { key: 'welcome_image_url', label: 'Image URL', type: 'url' }
        ]
    },
    cta: {
        title: 'Home - Call to Action',
        icon: BookOpen,
        color: 'purple',
        fields: [
            { key: 'cta_heading', label: 'Heading', type: 'text', placeholder: 'Ready to Join Our Community?' },
            { key: 'cta_subheading', label: 'Subheading', type: 'textarea' }
        ]
    },
    contact_info: {
        title: 'Contact Information',
        icon: Phone,
        color: 'indigo',
        fields: [
            { key: 'address_line_1', label: 'Address Line 1', type: 'text' },
            { key: 'address_line_2', label: 'Address Line 2', type: 'text' },
            { key: 'address_line_3', label: 'City/Region', type: 'text' },
            { key: 'phone_primary', label: 'Primary Phone', type: 'text' },
            { key: 'phone_secondary', label: 'Secondary Phone', type: 'text' },
            { key: 'email_primary', label: 'Primary Email', type: 'text' },
            { key: 'email_secondary', label: 'Secondary Email', type: 'text' },
            { key: 'office_hours', label: 'Office Hours', type: 'text' }
        ]
    },
    social_media: {
        title: 'Social Media Links',
        icon: Facebook,
        color: 'pink',
        fields: [
            { key: 'facebook_url', label: 'Facebook URL', type: 'url' },
            { key: 'twitter_url', label: 'Twitter URL', type: 'url' },
            { key: 'instagram_url', label: 'Instagram URL', type: 'url' },
            { key: 'youtube_url', label: 'YouTube URL', type: 'url' }
        ]
    }
};

export default function SiteContentManager() {
    const [content, setContent] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editData, setEditData] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*');

            if (error) throw error;

            const contentMap: Record<string, string> = {};
            data?.forEach((item: SiteContent) => {
                contentMap[item.key] = item.value;
            });
            setContent(contentMap);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (sectionKey: string) => {
        const section = contentSections[sectionKey];
        const sectionData: Record<string, string> = {};

        section.fields.forEach(field => {
            sectionData[field.key] = content[field.key] || '';
        });

        setEditData(sectionData);
        setEditingSection(sectionKey);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updates = Object.entries(editData).map(([key, value]) => ({
                key,
                value,
                section: editingSection || 'general',
                type: 'text' as const
            }));

            for (const update of updates) {
                const { error } = await supabase
                    .from('site_content')
                    .upsert(update, { onConflict: 'key' });

                if (error) throw error;
            }

            fetchContent();
            setEditingSection(null);
            setEditData({});
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content. Please try again.');
        } finally {
            setSaving(false);
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
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Site Content Management</h2>
                <p className="text-gray-600">Manage all text content across your website</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(contentSections).map(([key, section]) => {
                    const Icon = section.icon;
                    const hasContent = section.fields.some(field => content[field.key]);

                    return (
                        <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className={`bg-${section.color}-100 p-3 rounded-xl`}>
                                        <Icon className={`w-6 h-6 text-${section.color}-600`} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{section.title}</h3>
                                        <p className="text-sm text-gray-500">{section.fields.length} fields</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleEdit(key)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                            </div>

                            {hasContent && (
                                <div className="mt-4 space-y-2">
                                    {section.fields.slice(0, 2).map(field => (
                                        content[field.key] && (
                                            <div key={field.key} className="text-sm">
                                                <p className="text-gray-500 font-medium">{field.label}:</p>
                                                <p className="text-gray-700 line-clamp-2">{content[field.key]}</p>
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Edit Modal */}
            {editingSection && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">
                                Edit {contentSections[editingSection].title}
                            </h3>
                            <button
                                onClick={() => setEditingSection(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {contentSections[editingSection].fields.map(field => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {field.label}
                                    </label>
                                    {field.type === 'textarea' ? (
                                        <textarea
                                            value={editData[field.key] || ''}
                                            onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                            placeholder={field.placeholder}
                                        />
                                    ) : (
                                        <input
                                            type={field.type === 'url' ? 'url' : 'text'}
                                            value={editData[field.key] || ''}
                                            onChange={(e) => setEditData({ ...editData, [field.key]: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-royal-500 focus:border-transparent"
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                </div>
                            ))}

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setEditingSection(null)}
                                    className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-xl transition-colors flex items-center space-x-2 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

