import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const SESSION_KEY = 'admin_session';
const SESSION_EXPIRY_KEY = 'admin_session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default function AdminPortal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        const checkSession = () => {
            try {
                const sessionData = localStorage.getItem(SESSION_KEY);
                const expiryTime = localStorage.getItem(SESSION_EXPIRY_KEY);

                if (sessionData && expiryTime) {
                    const now = new Date().getTime();
                    const expiry = parseInt(expiryTime, 10);

                    if (now < expiry) {
                        // Session is still valid
                        const parsedData = JSON.parse(sessionData);
                        setUsername(parsedData.username);
                        setIsLoggedIn(true);
                    } else {
                        // Session expired, clear it
                        localStorage.removeItem(SESSION_KEY);
                        localStorage.removeItem(SESSION_EXPIRY_KEY);
                    }
                }
            } catch (error) {
                console.error('Error checking session:', error);
                // Clear potentially corrupted data
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem(SESSION_EXPIRY_KEY);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const handleLogin = (user: string) => {
        const sessionData = {
            username: user,
            loginTime: new Date().getTime()
        };
        const expiryTime = new Date().getTime() + SESSION_DURATION;

        // Store session in localStorage
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
        localStorage.setItem(SESSION_EXPIRY_KEY, expiryTime.toString());

        setUsername(user);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        // Clear session from localStorage
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(SESSION_EXPIRY_KEY);

        setUsername('');
        setIsLoggedIn(false);
    };

    // Show loading state while checking session
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-royal-700 to-royal-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            {isLoggedIn ? (
                <AdminDashboard username={username} onLogout={handleLogout} />
            ) : (
                <AdminLogin onLogin={handleLogin} />
            )}
        </>
    );
}
