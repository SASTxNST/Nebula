"use client";

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
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
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('email', email);
                    router.push('/contribution-ranks');
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

    return (
        <div className="relative flex flex-row items-center justify-center min-h-screen p-4 overflow-hidden bg-gradient-to-br from-gray-900 to-black font-inter">
            <div className="absolute bg-blue-600 rounded-full top-1/4 left-1/4 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bg-purple-600 rounded-full top-1/2 right-1/4 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bg-pink-600 rounded-full bottom-1/4 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className={`fixed left-1/2 top-5 -translate-x-1/2 ${message.includes('success') ? 'bg-green-600' : 'bg-red-600'} text-white py-3 px-6 rounded-lg shadow-lg z-50 transition-all duration-300 ${showMessageBox ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                {message}
            </div>

            <div className="flex flex-col overflow-hidden bg-[#0E0E2F] rounded-2xl shadow-2xl md:flex-row max-w-5xl w-full backdrop-blur-sm bg-opacity-80 border border-gray-700 relative z-10">
                <div className="flex flex-col items-center justify-center p-8 md:p-12 text-white bg-gradient-to-br from-[#0088CC] to-[#00B2FF] md:w-1/2 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                    <h2 className="mb-4 text-4xl font-bold text-center text-white md:text-5xl drop-shadow-lg">
                        {isLogin ? 'Welcome Back!' : 'Join Us!'}
                    </h2>
                    <p className="mb-6 text-lg text-center opacity-90">
                        {isLogin ? 'Sign in to continue your journey.' : 'Create an account and start your adventure.'}
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
                        className="mt-4 px-8 py-3 bg-white text-[#00B2FF] font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    >
                        {isLogin ? 'Create an Account' : 'Already have an account?'}
                    </button>
                </div>

                {/* Right panel: Login / Signup Form - Updated for better contrast */}
                <div className="flex flex-col items-center justify-center p-8 md:p-12 md:w-1/2 bg-white/5 backdrop-blur-2xl rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
                    <h3 className="mb-8 text-3xl font-bold text-white">
                        {isLogin ? 'Login' : 'Signup'}
                    </h3>

                    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6 text-white">
                        {!isLogin && (
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-semibold text-white">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full px-4 py-3 leading-tight text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00B2FF] focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                    placeholder="Your username"
                                    value={username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 leading-tight text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00B2FF] focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div>
                                <label htmlFor="githubId" className="block mb-2 text-sm font-semibold text-white">
                                    GitHub ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    id="githubId"
                                    className="w-full px-4 py-3 leading-tight text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00B2FF] focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                    placeholder="Your GitHub ID"
                                    value={githubId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGithubId(e.target.value)}
                                />
                            </div>
                        )}

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-white">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-3 leading-tight text-gray-800 bg-gray-100 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#00B2FF] focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                placeholder="********"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-[#00B2FF] to-[#0088CC] shadow-lg hover:from-[#0099CC] hover:to-[#0077BB] transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00B2FF] focus:ring-offset-2 focus:ring-offset-white"
                        >
                            {isLogin ? 'Login' : 'Signup'}
                        </button>
                    </form>
                </div>
            </div>
            {/* Custom CSS for blob animation */}
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

export default Page;
