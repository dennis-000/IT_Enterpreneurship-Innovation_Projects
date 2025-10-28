import { useState, useEffect } from 'react';
import { Bell, Mail, X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Notification {
    id: string;
    type: 'contact' | 'admission' | 'info';
    title: string;
    message: string;
    read: boolean;
    created_at: string;
    data?: any;
}

interface NotificationSystemProps {
    onNotificationCountChange?: (count: number) => void;
}

export default function NotificationSystem({ onNotificationCountChange }: NotificationSystemProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();

        // Set up real-time subscription for new notifications
        const channel = supabase
            .channel('notifications')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'contact_inquiries' },
                () => {
                    fetchNotifications();
                }
            )
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'admission_inquiries' },
                () => {
                    fetchNotifications();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        const count = notifications.filter(n => !n.read).length;
        setUnreadCount(count);
        onNotificationCountChange?.(count);
    }, [notifications, onNotificationCountChange]);

    const fetchNotifications = async () => {
        try {
            // Fetch recent contact inquiries
            const { data: contactData } = await supabase
                .from('contact_inquiries')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            // Fetch recent admission inquiries
            const { data: admissionData } = await supabase
                .from('admission_inquiries')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10);

            // Combine and format notifications
            const contactNotifications: Notification[] = (contactData || []).map(inquiry => ({
                id: `contact-${inquiry.id}`,
                type: 'contact',
                title: 'New Contact Inquiry',
                message: `${inquiry.name} sent a message: "${inquiry.subject}"`,
                read: false,
                created_at: inquiry.created_at,
                data: inquiry
            }));

            const admissionNotifications: Notification[] = (admissionData || []).map(inquiry => ({
                id: `admission-${inquiry.id}`,
                type: 'admission',
                title: 'New Admission Inquiry',
                message: `${inquiry.parent_name} is interested in enrolling ${inquiry.student_name}`,
                read: false,
                created_at: inquiry.created_at,
                data: inquiry
            }));

            // Combine and sort by date
            const allNotifications = [...contactNotifications, ...admissionNotifications]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 20); // Limit to 20 most recent

            setNotifications(allNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'contact':
                return <Mail className="w-5 h-5 text-blue-600" />;
            case 'admission':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'info':
                return <Info className="w-5 h-5 text-gray-600" />;
            default:
                return <Bell className="w-5 h-5 text-gray-600" />;
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-tomato-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-royal-600 hover:text-royal-700"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''
                                            }`}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'
                                                        }`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className="text-xs text-gray-500">
                                                        {formatTimeAgo(notification.created_at)}
                                                    </span>
                                                </div>
                                                <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-600'
                                                    }`}>
                                                    {notification.message}
                                                </p>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="w-full text-center text-sm text-royal-600 hover:text-royal-700"
                            >
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Overlay to close dropdown when clicking outside */}
            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                />
            )}
        </div>
    );
}
