"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormPopupProps {
    onClose: () => void;
    onLoginSuccess: (token:any,email:string) => void;
}

const LoginFormPopup: React.FC<LoginFormPopupProps> = ({ onClose, onLoginSuccess }) => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [githubId, setGithubId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showMessageBox, setShowMessageBox] = useState<boolean>(false);

    const showMessage = (msg: string, type: 'success' | 'error' | 'info' = 'success'): void => {
        setMessage(msg);
        setShowMessageBox(true);
        setTimeout(() => {
            setShowMessageBox(false);
            setMessage('');
        }, 3000);
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setMessage('');
        setShowMessageBox(false);

        if (isLogin) {
            if (!email || !password) {
                showMessage('Please fill in all login fields.', 'error');
                return;
            }
            showMessage('Logging in..', 'info');
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message || 'Login successful!');
                    onLoginSuccess(data.token,email);
                } else {
                    showMessage(data.message || 'Login failed.', 'error');
                }
            } catch (error: any) {
                showMessage('An error occurred during login.', 'error');
                console.error('Login error:', error);
            }
        } else {
            if (!username || !email || !password) {
                showMessage('Please fill in all signup fields.', 'error');
                return;
            }
            showMessage('Signup attempt (check console)', 'info');
            try {
                const response = await fetch('/api/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, githubId, password }),
                });
                const data = await response.json();
                if (response.ok) {
                    showMessage(data.message || 'Signup successful! Please log in.');
                    setIsLogin(true);
                } else {
                    showMessage(data.message || 'Signup failed.', 'error');
                }
            } catch (error: any) {
                showMessage('An error occurred during signup.', 'error');
                console.error('Signup error:', error);
            }
        }
    };

    const getMessageStyles = (msg: string) => {
        if (msg.includes('successful') || msg.includes('Login successful')) {
            return 'bg-emerald-600 border-emerald-500';
        } else if (msg.includes('error') || msg.includes('failed')) {
            return 'bg-red-600 border-red-500';
        } else {
            return 'bg-blue-600 border-blue-500';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            {/* Animated background blobs */}
            <div className="absolute rounded-full bg-blue-600/20 top-1/4 left-1/4 w-72 h-72 mix-blend-screen filter blur-xl animate-blob"></div>
            <div className="absolute rounded-full bg-cyan-600/20 top-1/2 right-1/4 w-72 h-72 mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute rounded-full bg-blue-400/20 bottom-1/4 left-1/2 w-72 h-72 mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>

            {/* Message Box */}
            <div className={`fixed left-1/2 top-8 -translate-x-1/2 ${getMessageStyles(message)} text-white py-3 px-6 rounded-xl shadow-2xl z-[60] transition-all duration-300 border ${showMessageBox ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    {message}
                </div>
            </div>

            {/* Main Popup Container */}
            <div className="relative z-50 flex flex-row w-[60%] overflow-hidden border shadow-2xl bg-gray-900/95 rounded-3xl backdrop-blur-xl border-gray-700/50">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute z-[60] text-2xl text-gray-400 transition-all duration-200 top-6 right-6 hover:text-white hover:bg-gray-700/50 rounded-full w-8 h-8 flex items-center justify-center hover:rotate-90"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Left Panel - Welcome Section */}
                <div className="relative flex flex-col items-center justify-center w-full p-8 overflow-hidden text-white bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-t-3xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent"></div>
                    <div className="absolute w-32 h-32 rounded-full -top-10 -right-10 bg-blue-500/10 blur-2xl"></div>
                    <div className="absolute w-40 h-40 rounded-full -bottom-10 -left-10 bg-purple-500/10 blur-2xl"></div>
                    
                    <div className="relative z-10 text-center">
                        <div className="mb-6">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl">
                                <span className="text-2xl">🚀</span>
                            </div>
                        </div>
                        
                        <h2 className="mb-4 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                            {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
                        </h2>
                        <p className="max-w-xs mb-6 text-sm leading-relaxed text-gray-300">
                            {isLogin 
                                ? 'Ready to dive back into your projects? Sign in to continue your coding journey.' 
                                : 'Start your development adventure with us. Create your account in seconds.'}
                        </p>
                        
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setUsername('');
                                setEmail('');
                                setGithubId('');
                                setPassword('');
                                setMessage('');
                                setShowMessageBox(false);
                            }}
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 border border-blue-500/20 text-sm"
                        >
                            {isLogin ? '✨ Create New Account' : '👋 Back to Login'}
                        </button>
                    </div>
                </div>

                {/* Right Panel - Form Section */}
                <div className="relative flex flex-col items-center justify-center w-full p-8 bg-gray-900/80 backdrop-blur-xl rounded-b-3xl">
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 via-transparent to-gray-800/20 rounded-b-3xl"></div>
                    
                    <div className="relative z-10 w-full max-w-xs">
                        <div className="mb-6 text-center">
                            <h3 className="mb-1 text-2xl font-bold text-white">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {isLogin ? 'Enter your credentials below' : 'Fill in your details to get started'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="space-y-2">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 border border-gray-600 shadow-sm bg-gray-800/50 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-800/70"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 border border-gray-600 shadow-sm bg-gray-800/50 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-800/70"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <label htmlFor="githubId" className="block text-sm font-medium text-gray-300">
                                        GitHub Username <span className="text-xs text-gray-500">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="githubId"
                                        className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 border border-gray-600 shadow-sm bg-gray-800/50 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-800/70"
                                        placeholder="your-github-username"
                                        value={githubId}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithubId(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 border border-gray-600 shadow-sm bg-gray-800/50 rounded-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-800/70"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-xl hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-95 border border-blue-500/20"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    {isLogin ? '🔓 Sign In' : '🚀 Create Account'}
                                </span>
                            </button>

                            {isLogin && (
                                <div className="text-center">
                                    <a href="#" className="text-sm text-blue-400 transition-colors hover:text-blue-300">
                                        Forgot your password?
                                    </a>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Custom CSS for animations */}
            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite cubic-bezier(0.6, 0.01, 0.3, 0.9);
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default LoginFormPopup;