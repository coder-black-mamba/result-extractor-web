import React, { useState  } from 'react';
import { useNavigate } from 'react-router';

const ReportAuth = ({ data, setData, setIsAuthenticated }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('https://rpi-cs-all.it-is-the-black-mamba.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const result = await response.json();

            if (result.error) {
                setError(result.error || 'Invalid password. Please try again.');
                setIsAuthenticated(false);
            } else {
                setData(result);
                setIsAuthenticated(true);
            }
        } catch (error) {
            setError('Failed to connect to the server. Please check your connection and try again.');
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
            setPassword('');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-500 border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite] mb-4"></div>
                    <h2 className="text-xl font-semibold text-white">Verifying Access</h2>
                    <p className="text-gray-400 mt-2">Please wait while we authenticate your credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen   flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                            Secure Access
                        </h1>
                        <p className="text-gray-400">Enter your password to view the report</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-900/30 border border-red-800/50 text-red-200 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                                    placeholder="Enter your access key"
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !password.trim()}
                            className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                loading || !password.trim()
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-emerald-500/20'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                'Access Report'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportAuth;