import { useState } from 'react';
import { Lock, User, Eye, EyeOff, GraduationCap } from 'lucide-react';

interface AdminLoginProps {
    onLogin: (username: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate authentication (replace with real authentication)
        setTimeout(() => {
            if (formData.username === 'admin' && formData.password === 'admin123') {
                onLogin(formData.username);
            } else {
                setError('Invalid username or password');
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-royal-700 to-royal-800 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
                    <div className="text-center mb-6 sm:mb-8">
                        <div className="bg-gradient-to-br from-royal-600 to-royal-700 w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-royal-800 mb-1 sm:mb-2">Admin Portal</h1>
                        <p className="text-sm sm:text-base text-gray-600">Fountain Gate Academy</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors text-sm sm:text-base"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-2 border-red-500 text-red-700 p-3 sm:p-4 rounded-xl">
                                <p className="text-xs sm:text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-royal-600 to-royal-700 hover:from-royal-700 hover:to-royal-800 text-white px-6 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-4 sm:mt-6 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            Demo credentials: admin / admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
