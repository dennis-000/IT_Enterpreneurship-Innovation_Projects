import { useState, useEffect } from 'react';
import { Eye, Trash2, Mail, Phone, MessageSquare, Calendar, User, Download, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ContactInquiry {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    created_at: string;
    status: 'new' | 'read' | 'responded';
}

export default function ContactInquiriesManager() {
    const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'responded'>('all');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            const { data, error } = await supabase
                .from('contact_inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            console.error('Error fetching contact inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: ContactInquiry['status']) => {
        try {
            const { error } = await supabase
                .from('contact_inquiries')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchInquiries();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return;

        try {
            const { error } = await supabase
                .from('contact_inquiries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchInquiries();
            if (selectedInquiry?.id === id) setSelectedInquiry(null);
        } catch (error) {
            console.error('Error deleting inquiry:', error);
        }
    };

    const filteredInquiries = inquiries.filter(inquiry =>
        statusFilter === 'all' || inquiry.status === statusFilter
    );

    const getStatusColor = (status: ContactInquiry['status']) => {
        switch (status) {
            case 'new': return 'bg-yellow-100 text-yellow-800';
            case 'read': return 'bg-blue-100 text-blue-800';
            case 'responded': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Message', 'Status', 'Date'];
        const csvContent = [
            headers.join(','),
            ...inquiries.map(inquiry => [
                inquiry.name,
                inquiry.email,
                inquiry.phone,
                `"${inquiry.message.replace(/"/g, '""')}"`,
                inquiry.status,
                formatDate(inquiry.created_at)
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Contact Inquiries</h2>
                    <p className="text-sm sm:text-base text-gray-600">{inquiries.length} total inquiries</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
                >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* Status Filter */}
            <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200">
                <div className="flex flex-wrap gap-2">
                    {[
                        { value: 'all', label: 'All', count: inquiries.length },
                        { value: 'new', label: 'New', count: inquiries.filter(i => i.status === 'new').length },
                        { value: 'read', label: 'Read', count: inquiries.filter(i => i.status === 'read').length },
                        { value: 'responded', label: 'Responded', count: inquiries.filter(i => i.status === 'responded').length }
                    ].map(filter => (
                        <button
                            key={filter.value}
                            onClick={() => setStatusFilter(filter.value as any)}
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${statusFilter === filter.value
                                ? 'bg-royal-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Inquiries List */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {filteredInquiries.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {filteredInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="p-4 sm:p-6 hover:bg-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                                            <div className="flex items-center space-x-2 sm:space-x-3">
                                                <div className="bg-royal-100 p-2 rounded-lg flex-shrink-0">
                                                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-royal-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">{inquiry.name}</h3>
                                                    <p className="text-xs sm:text-sm text-gray-600">{inquiry.email}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start ${getStatusColor(inquiry.status)}`}>
                                                {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-3">
                                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                <span className="truncate">{inquiry.email}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                <span>{inquiry.phone}</span>
                                            </div>
                                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 col-span-full">
                                                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                                <span className="text-xs">{formatDate(inquiry.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                                            <div className="flex items-start space-x-2">
                                                <MessageSquare className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                                <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">
                                                    {inquiry.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 sm:ml-4">
                                        <button
                                            onClick={() => setSelectedInquiry(inquiry)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>

                                        <select
                                            value={inquiry.status}
                                            onChange={(e) => updateStatus(inquiry.id, e.target.value as ContactInquiry['status'])}
                                            className="text-xs px-2 py-1.5 border border-gray-300 rounded-lg focus:border-royal-500 focus:outline-none flex-1 sm:flex-none"
                                        >
                                            <option value="new">New</option>
                                            <option value="read">Read</option>
                                            <option value="responded">Responded</option>
                                        </select>

                                        <button
                                            onClick={() => handleDelete(inquiry.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Inquiry"
                                        >
                                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No inquiries found</h3>
                        <p className="text-gray-500">
                            {statusFilter === 'all'
                                ? 'No contact inquiries yet.'
                                : `No ${statusFilter} inquiries.`}
                        </p>
                    </div>
                )}
            </div>

            {/* Inquiry Details Modal */}
            {selectedInquiry && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Contact Inquiry Details</h3>
                            <button
                                onClick={() => setSelectedInquiry(null)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Contact Information</h4>
                                    <div className="space-y-2 text-xs sm:text-sm">
                                        <p className="break-words"><span className="font-medium">Name:</span> {selectedInquiry.name}</p>
                                        <p className="break-all"><span className="font-medium">Email:</span> {selectedInquiry.email}</p>
                                        <p><span className="font-medium">Phone:</span> {selectedInquiry.phone}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Message</h4>
                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                    <p className="text-gray-700 text-xs sm:text-sm whitespace-pre-wrap">{selectedInquiry.message}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <div className="text-xs sm:text-sm text-gray-600">
                                    Submitted: {formatDate(selectedInquiry.created_at)}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <select
                                        value={selectedInquiry.status}
                                        onChange={(e) => updateStatus(selectedInquiry.id, e.target.value as ContactInquiry['status'])}
                                        className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:border-royal-500 focus:outline-none text-sm"
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="responded">Responded</option>
                                    </select>
                                    <button
                                        onClick={() => setSelectedInquiry(null)}
                                        className="px-4 sm:px-6 py-2 bg-royal-600 hover:bg-royal-700 text-white rounded-lg transition-colors text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

