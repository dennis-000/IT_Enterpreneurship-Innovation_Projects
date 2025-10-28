import { useState, useEffect } from 'react';
import {
    User,
    FileText,
    Image,
    Mail,
    Calendar,
    GraduationCap,
    TrendingUp,
    LogOut,
    Settings,
    Eye,
    Home,
    BookOpen,
    Info
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import HomePageManager from '../../components/admin/pages/HomePageManager';
import AboutPageManager from '../../components/admin/pages/AboutPageManager';
import ContactPageManager from '../../components/admin/pages/ContactPageManager';
import AdmissionsPageManager from '../../components/admin/pages/AdmissionsPageManager';
import AcademicsPageManager from '../../components/admin/pages/AcademicsPageManager';
import NewsEventsManager from '../../components/admin/NewsEventsManager';
import GalleryManager from '../../components/admin/GalleryManager';
import NotificationSystem from '../../components/admin/NotificationSystem';

interface AdminDashboardProps {
    username: string;
    onLogout: () => void;
}

interface DashboardStats {
    totalContactInquiries: number;
    totalNews: number;
    totalEvents: number;
    totalGalleryItems: number;
    totalAdmissions: number;
}

export default function AdminDashboard({ username, onLogout }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState<DashboardStats>({
        totalContactInquiries: 0,
        totalNews: 0,
        totalEvents: 0,
        totalGalleryItems: 0,
        totalAdmissions: 0
    });
    const [recentInquiries, setRecentInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch stats from different tables
            const [contactRes, newsRes, eventsRes, galleryRes, admissionsRes] = await Promise.all([
                supabase.from('contact_inquiries').select('*', { count: 'exact' }),
                supabase.from('news_posts').select('*', { count: 'exact' }),
                supabase.from('events').select('*', { count: 'exact' }),
                supabase.from('gallery_items').select('*', { count: 'exact' }),
                supabase.from('admission_inquiries').select('*', { count: 'exact' })
            ]);

            setStats({
                totalContactInquiries: contactRes.count || 0,
                totalNews: newsRes.count || 0,
                totalEvents: eventsRes.count || 0,
                totalGalleryItems: galleryRes.count || 0,
                totalAdmissions: admissionsRes.count || 0
            });

            // Fetch recent contact inquiries
            const { data: recentData } = await supabase
                .from('contact_inquiries')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            setRecentInquiries(recentData || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderDashboard = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Contact Inquiries</p>
                            <p className="text-xl sm:text-3xl font-bold text-royal-700">{stats.totalContactInquiries}</p>
                        </div>
                        <div className="bg-royal-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                            <Mail className="w-5 h-5 sm:w-8 sm:h-8 text-royal-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">News Posts</p>
                            <p className="text-xl sm:text-3xl font-bold text-tomato-700">{stats.totalNews}</p>
                        </div>
                        <div className="bg-tomato-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                            <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-tomato-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Events</p>
                            <p className="text-xl sm:text-3xl font-bold text-green-700">{stats.totalEvents}</p>
                        </div>
                        <div className="bg-green-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                            <Calendar className="w-5 h-5 sm:w-8 sm:h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Gallery Items</p>
                            <p className="text-xl sm:text-3xl font-bold text-blue-700">{stats.totalGalleryItems}</p>
                        </div>
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                            <Image className="w-5 h-5 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-gray-600">Admissions</p>
                            <p className="text-xl sm:text-3xl font-bold text-purple-700">{stats.totalAdmissions}</p>
                        </div>
                        <div className="bg-purple-100 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                            <GraduationCap className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Recent Contact Inquiries</h3>
                    <div className="space-y-2 sm:space-y-3">
                        {recentInquiries.length > 0 ? (
                            recentInquiries.map((inquiry, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{inquiry.name}</p>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">{inquiry.email}</p>
                                        <p className="text-xs text-gray-500">{formatDate(inquiry.created_at)}</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('contact')}
                                        className="text-royal-600 hover:text-royal-700 flex-shrink-0"
                                    >
                                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4 text-sm">No recent inquiries</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                            onClick={() => setActiveTab('home')}
                            className="p-3 sm:p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors text-center"
                        >
                            <Home className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 mx-auto mb-1 sm:mb-2" />
                            <p className="text-xs sm:text-sm font-semibold text-indigo-700">Home Page</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className="p-3 sm:p-4 bg-royal-50 hover:bg-royal-100 rounded-xl transition-colors text-center"
                        >
                            <Info className="w-6 h-6 sm:w-8 sm:h-8 text-royal-600 mx-auto mb-1 sm:mb-2" />
                            <p className="text-xs sm:text-sm font-semibold text-royal-700">About Page</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('admissions')}
                            className="p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors text-center"
                        >
                            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-1 sm:mb-2" />
                            <p className="text-xs sm:text-sm font-semibold text-blue-700">Admissions</p>
                        </button>
                        <button
                            onClick={() => setActiveTab('contact')}
                            className="p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
                        >
                            <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-1 sm:mb-2" />
                            <p className="text-xs sm:text-sm font-semibold text-purple-700">Contact Page</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboard();
            case 'home':
                return <HomePageManager />;
            case 'about':
                return <AboutPageManager />;
            case 'academics':
                return <AcademicsPageManager />;
            case 'admissions':
                return <AdmissionsPageManager />;
            case 'news':
                return <NewsEventsManager type="news" />;
            case 'events':
                return <NewsEventsManager type="events" />;
            case 'gallery':
                return <GalleryManager />;
            case 'contact':
                return <ContactPageManager />;
            case 'settings':
                return <div className="bg-white p-6 rounded-2xl shadow-lg"><h3 className="text-xl font-bold">Site Settings - Coming Soon</h3></div>;
            default:
                return renderDashboard();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-royal-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="bg-gradient-to-br from-royal-600 to-royal-700 p-2 rounded-xl">
                                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-base sm:text-xl font-bold text-gray-800">Admin Portal</h1>
                                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Fountain Gate Academy</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <NotificationSystem />
                            <div className="hidden sm:flex items-center space-x-2">
                                <div className="w-8 h-8 bg-royal-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-royal-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{username}</span>
                            </div>
                            <button
                                onClick={onLogout}
                                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-xs sm:text-sm hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
                {/* Navigation */}
                <nav className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2 mb-6 sm:mb-8 overflow-x-auto">
                    <div className="flex space-x-1 min-w-max sm:min-w-0">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                            { id: 'home', label: 'Home Page', icon: Home },
                            { id: 'about', label: 'About Page', icon: Info },
                            { id: 'academics', label: 'Academics Page', icon: BookOpen },
                            { id: 'admissions', label: 'Admissions Page', icon: GraduationCap },
                            { id: 'news', label: 'News', icon: FileText },
                            { id: 'events', label: 'Events', icon: Calendar },
                            { id: 'gallery', label: 'Gallery', icon: Image },
                            { id: 'contact', label: 'Contact Page', icon: Mail },
                            { id: 'settings', label: 'Settings', icon: Settings }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-royal-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Content */}
                {renderTabContent()}
            </div>
        </div>
    );
}
