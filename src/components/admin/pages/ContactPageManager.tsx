import { useState, useEffect } from 'react';
import { Save, Mail, Eye, Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ContactInfo {
    address_line_1: string;
    address_line_2: string;
    address_line_3: string;
    phone_primary: string;
    phone_secondary: string;
    email_primary: string;
    email_secondary: string;
    office_hours: string;
    facebook_url: string;
    twitter_url: string;
    instagram_url: string;
    youtube_url: string;
}

interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: string;
    created_at: string;
}

export default function ContactPageManager() {
    const [info, setInfo] = useState<ContactInfo>({
        address_line_1: '',
        address_line_2: '',
        address_line_3: '',
        phone_primary: '',
        phone_secondary: '',
        email_primary: '',
        email_secondary: '',
        office_hours: '',
        facebook_url: '',
        twitter_url: '',
        instagram_url: '',
        youtube_url: ''
    });
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'info' | 'inquiries'>('info');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [contentRes, inquiriesRes] = await Promise.all([
                supabase.from('site_content').select('*').in('section', ['contact_info', 'social_media']),
                supabase.from('contact_inquiries').select('*').order('created_at', { ascending: false })
            ]);

            const contentMap: Record<string, string> = {};
            contentRes.data?.forEach(item => {
                contentMap[item.key] = item.value;
            });

            setInfo({
                address_line_1: contentMap.address_line_1 || '',
                address_line_2: contentMap.address_line_2 || '',
                address_line_3: contentMap.address_line_3 || '',
                phone_primary: contentMap.phone_primary || '',
                phone_secondary: contentMap.phone_secondary || '',
                email_primary: contentMap.email_primary || '',
                email_secondary: contentMap.email_secondary || '',
                office_hours: contentMap.office_hours || '',
                facebook_url: contentMap.facebook_url || '',
                twitter_url: contentMap.twitter_url || '',
                instagram_url: contentMap.instagram_url || '',
                youtube_url: contentMap.youtube_url || ''
            });

            setInquiries(inquiriesRes.data || []);
        } catch (error) {
            console.error('Error fetching contact page data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveInfo = async () => {
        try {
            const updates = [
                { key: 'address_line_1', value: info.address_line_1, section: 'contact_info', type: 'text' },
                { key: 'address_line_2', value: info.address_line_2, section: 'contact_info', type: 'text' },
                { key: 'address_line_3', value: info.address_line_3, section: 'contact_info', type: 'text' },
                { key: 'phone_primary', value: info.phone_primary, section: 'contact_info', type: 'text' },
                { key: 'phone_secondary', value: info.phone_secondary, section: 'contact_info', type: 'text' },
                { key: 'email_primary', value: info.email_primary, section: 'contact_info', type: 'text' },
                { key: 'email_secondary', value: info.email_secondary, section: 'contact_info', type: 'text' },
                { key: 'office_hours', value: info.office_hours, section: 'contact_info', type: 'text' },
                { key: 'facebook_url', value: info.facebook_url, section: 'social_media', type: 'url' },
                { key: 'twitter_url', value: info.twitter_url, section: 'social_media', type: 'url' },
                { key: 'instagram_url', value: info.instagram_url, section: 'social_media', type: 'url' },
                { key: 'youtube_url', value: info.youtube_url, section: 'social_media', type: 'url' }
            ];

            for (const update of updates) {
                await supabase.from('site_content').upsert(update, { onConflict: 'key' });
            }
            alert('Contact information updated successfully!');
        } catch (error) {
            console.error('Error saving contact info:', error);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        await supabase.from('contact_inquiries').update({ status }).eq('id', id);
        fetchAllData();
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...inquiries.map(inq => [
                inq.name,
                inq.email,
                inq.phone,
                `"${inq.message.replace(/"/g, '""')}"`,
                inq.status,
                new Date(inq.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contact-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const filteredInquiries = statusFilter === 'all'
        ? inquiries
        : inquiries.filter(inq => inq.status === statusFilter);

    if (loading) {
        return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Contact Page Management</h2>
                <p className="text-gray-600">Manage contact information and inquiries</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveSection('info')}
                        className={`px-4 py-2 rounded-lg font-medium ${activeSection === 'info' ? 'bg-royal-600 text-white' : 'bg-gray-100'}`}
                    >
                        Contact Info
                    </button>
                    <button
                        onClick={() => setActiveSection('inquiries')}
                        className={`px-4 py-2 rounded-lg font-medium ${activeSection === 'inquiries' ? 'bg-royal-600 text-white' : 'bg-gray-100'}`}
                    >
                        Inquiries ({inquiries.length})
                    </button>
                </div>
            </div>

            {activeSection === 'info' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4">Address</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Address Line 1"
                                value={info.address_line_1}
                                onChange={(e) => setInfo({ ...info, address_line_1: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Address Line 2"
                                value={info.address_line_2}
                                onChange={(e) => setInfo({ ...info, address_line_2: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="City/Region"
                                value={info.address_line_3}
                                onChange={(e) => setInfo({ ...info, address_line_3: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4">Phone & Email</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="tel"
                                placeholder="Primary Phone"
                                value={info.phone_primary}
                                onChange={(e) => setInfo({ ...info, phone_primary: e.target.value })}
                                className="px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="tel"
                                placeholder="Secondary Phone"
                                value={info.phone_secondary}
                                onChange={(e) => setInfo({ ...info, phone_secondary: e.target.value })}
                                className="px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="email"
                                placeholder="Primary Email"
                                value={info.email_primary}
                                onChange={(e) => setInfo({ ...info, email_primary: e.target.value })}
                                className="px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="email"
                                placeholder="Secondary Email"
                                value={info.email_secondary}
                                onChange={(e) => setInfo({ ...info, email_secondary: e.target.value })}
                                className="px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="text"
                                placeholder="Office Hours"
                                value={info.office_hours}
                                onChange={(e) => setInfo({ ...info, office_hours: e.target.value })}
                                className="px-4 py-2 border rounded-xl col-span-full"
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold mb-4">Social Media Links</h3>
                        <div className="space-y-3">
                            <input
                                type="url"
                                placeholder="Facebook URL"
                                value={info.facebook_url}
                                onChange={(e) => setInfo({ ...info, facebook_url: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="url"
                                placeholder="Twitter URL"
                                value={info.twitter_url}
                                onChange={(e) => setInfo({ ...info, twitter_url: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="url"
                                placeholder="Instagram URL"
                                value={info.instagram_url}
                                onChange={(e) => setInfo({ ...info, instagram_url: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                            <input
                                type="url"
                                placeholder="YouTube URL"
                                value={info.youtube_url}
                                onChange={(e) => setInfo({ ...info, youtube_url: e.target.value })}
                                className="w-full px-4 py-2 border rounded-xl"
                            />
                        </div>
                    </div>

                    <button
                        onClick={saveInfo}
                        className="px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white rounded-xl flex items-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>Save All Information</span>
                    </button>
                </div>
            )}

            {activeSection === 'inquiries' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            {['all', 'new', 'read', 'responded'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 rounded-lg text-sm ${statusFilter === status ? 'bg-royal-600 text-white' : 'bg-gray-100'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button onClick={exportToCSV} className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>Export CSV</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                        {filteredInquiries.map(inq => (
                            <div key={inq.id} className="p-4 border-b last:border-b-0">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{inq.name}</h4>
                                        <p className="text-sm text-gray-600">{inq.email} | {inq.phone}</p>
                                        <p className="text-sm text-gray-700 mt-2">{inq.message}</p>
                                    </div>
                                    <select
                                        value={inq.status}
                                        onChange={(e) => updateStatus(inq.id, e.target.value)}
                                        className="px-3 py-1 border rounded-lg text-sm"
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="responded">Responded</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

