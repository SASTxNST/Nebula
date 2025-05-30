"use client";
import dynamic from "next/dynamic";
import React, { FormEvent, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LeaderboardContest from "./LeaderboardContest";
import Contact from "./Contact";
import FAQ from "./FAQ";
import Profile from './Profile';
import { motion, AnimatePresence } from "framer-motion";

type Repo = {
  owner: string;
  name: string;
};

const fontStyle = {
  fontFamily: "'Inter', sans-serif",
};

interface ProfileProps {
  repositories: Repo[];
}

const RepoTabs = dynamic(() => import('../components/RepoTabs'));
const Leaderboard = dynamic(() => import('@/app/components/Leaderboard'));
const Sidebar = dynamic(() => import('../components/Sidebar'));

const ContributionRanks: React.FC = () => {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const mainRef = useRef<HTMLDivElement>(null);

  const repos: Repo[] = [
    { owner: 'SASTxNST', name: 'Website_SAST' },
    { owner: 'SASTxNST', name: 'Nebula' },
    { owner: 'SASTxNST', name: 'Sensor Data Visualiser' },
  ];
  const router = useRouter();
  const [selectedRepo, setSelectedRepo] = useState<Repo>(repos[0]);
  const [activeSection, setActiveSection] = useState<'home' | 'ranks' | 'contact' | 'faq' | 'login' | 'profile'>('home');
  const [snapshot, setSnapshot] = useState({ contributors: 0, commits: 0, repositories: repos.length });
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler for header effect
  useEffect(() => {
    const handleScroll = () => {
      if (mainRef.current) {
        setIsScrolled(mainRef.current.scrollTop > 50);
      }
    };

    if (mainRef.current) {
      mainRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Nebula Red color palette with enhancements
  const nebulaColors = {
    primary: '#E63946',
    dark: '#0F0F1A',
    accent: '#FF2D75',
    secondary: '#1A1A2E',
    light: '#F8F9FA',
    gradientStart: '#E63946',
    gradientMid: '#FF2D75',
    gradientEnd: '#F15BB5',
    glow: 'rgba(230, 57, 70, 0.7)',
    darkAccent: '#0A0A15',
    panel: 'rgba(15, 15, 26, 0.85)',
    glass: 'rgba(26, 26, 46, 0.25)'
  };

  // Login state management
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [githubId, setGithubId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [showMessageBox, setShowMessageBox] = useState<boolean>(false);

  // ... (rest of your existing useEffect hooks and functions remain the same)

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 30%, ${nebulaColors.darkAccent} 0%, ${nebulaColors.dark} 70%),
          linear-gradient(to bottom, rgba(10,10,21,0.8), rgba(26,26,46,0.9))
        `,
        position: "relative",
        width: "full",
        color: nebulaColors.light,
        ...fontStyle,
        overflow: 'hidden'
      }}
    >
      {/* Animated Nebula Background */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: `radial-gradient(circle, ${i % 3 === 0 ? nebulaColors.primary : i % 2 === 0 ? nebulaColors.accent : nebulaColors.gradientEnd}, transparent 70%)`,
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.2,
              filter: 'blur(1.5px)'
            }}
            animate={{
              y: [0, Math.random() * 100 - 50],
              x: [0, Math.random() * 100 - 50],
              opacity: [Math.random() * 0.4 + 0.2, Math.random() * 0.4 + 0.3]
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Floating Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="flex h-screen w-full relative">
        {/* Enhanced Sidebar */}
        <Sidebar
          setActiveSection={setActiveSection}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((open) => !open)}
          nebulaColors={nebulaColors}
        />

        {/* Main Content Area */}
        <div 
          ref={mainRef}
          className="flex-1 flex flex-col overflow-hidden relative"
          style={{
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {/* Floating Header */}
          <motion.div 
            className="w-full px-8 py-4 flex justify-between items-center z-20"
            style={{
              background: isScrolled ? nebulaColors.panel : 'transparent',
              borderBottom: isScrolled ? `1px solid ${nebulaColors.primary}` : 'none',
              transition: 'all 0.3s ease'
            }}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={nebulaColors.light}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 hover:bg-white/10 transition-all"
                onClick={() => setActiveSection('profile')}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
                  <span className="text-xs font-bold">ME</span>
                </div>
                <span>My Profile</span>
              </button>
            </div>
          </motion.div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {activeSection === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative flex flex-col items-center justify-start w-full min-h-full py-16 px-4 sm:px-8"
                >
                  {/* Hero Section */}
                  <div className="w-full max-w-6xl mx-auto text-center mb-16 relative z-10">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="inline-block mb-8"
                    >
                      <div className="text-xs font-semibold tracking-wider text-red-400 uppercase mb-4">
                        Open Source Collaboration Platform
                      </div>
                      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-pink-500 to-red-400">
                        Build. Collaborate. Innovate.
                      </h1>
                      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Join our open-source journey — collaborate, learn, and grow with a passionate community of developers.
                      </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      {[
                        { value: snapshot.contributors, label: 'Active Contributors' },
                        { value: snapshot.commits, label: 'Total Commits' },
                        { value: snapshot.repositories, label: 'Projects' }
                      ].map((stat, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-br from-red-900/30 to-pink-900/20 p-6 rounded-xl border border-red-900/30 backdrop-blur-sm hover:border-red-500/50 transition-all"
                        >
                          <div className="text-4xl font-bold text-red-400 mb-2">{stat.value}+</div>
                          <div className="text-gray-400">{stat.label}</div>
                        </div>
                      ))}
                    </motion.div>

                    {/* Features */}
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      {[
                        { icon: '👥', title: 'Build Together', desc: 'Collaborate with talented developers' },
                        { icon: '🚀', title: 'Real Projects', desc: 'Work on meaningful open-source projects' },
                        { icon: '📊', title: 'GitHub Growth', desc: 'Enhance your GitHub profile' },
                        { icon: '🌐', title: 'Network', desc: 'Connect with like-minded developers' }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -5, boxShadow: `0 10px 25px -5px ${nebulaColors.glow}` }}
                          className="bg-gradient-to-br from-red-900/20 to-pink-900/10 p-6 rounded-xl border border-red-900/30 backdrop-blur-sm hover:border-red-500/50 transition-all"
                        >
                          <div className="text-3xl mb-4">{feature.icon}</div>
                          <h3 className="text-xl font-semibold mb-2 text-red-400">{feature.title}</h3>
                          <p className="text-gray-400">{feature.desc}</p>
                        </motion.div>
                      ))}
                    </motion.div>

                    {/* Leaderboard Section */}
                    <motion.div
                      className="w-full max-w-6xl mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    >
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-red-400">Project Leaderboard</h2>
                        <div className="flex space-x-2">
                          {repos.map((repo) => (
                            <button
                              key={repo.name}
                              onClick={() => setSelectedRepo(repo)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedRepo.name === repo.name ? 'bg-red-600 text-white' : 'bg-red-900/30 text-gray-300 hover:bg-red-900/50'}`}
                            >
                              {repo.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-red-900/20 to-pink-900/10 rounded-xl border border-red-900/30 backdrop-blur-sm p-6 mb-12">
                        <Leaderboard
                          repoOwner={selectedRepo.owner}
                          repoName={selectedRepo.name}
                          repos={repos}
                          onSelectRepo={setSelectedRepo}
                          nebulaColors={nebulaColors}
                        />
                      </div>

                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-block"
                      >
                        <button
                          className="px-8 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 transition-all shadow-lg hover:shadow-xl hover:shadow-red-900/30 flex items-center space-x-2"
                          onClick={() => window.open("https://github.com/SASTxNST/Nebula", "_blank")}
                        >
                          <span>Contribute on GitHub</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeSection === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center min-h-screen p-4 relative"
                >
                  {/* Floating Nebula Effect */}
                  <div className="absolute inset-0 overflow-hidden z-0">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full"
                        style={{
                          background: `radial-gradient(circle, ${i % 3 === 0 ? nebulaColors.primary : i % 2 === 0 ? nebulaColors.accent : nebulaColors.gradientEnd}, transparent 70%)`,
                          width: `${Math.random() * 20 + 10}px`,
                          height: `${Math.random() * 20 + 10}px`,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.3 + 0.2,
                          filter: 'blur(2px)'
                        }}
                        animate={{
                          y: [0, Math.random() * 100 - 50],
                          x: [0, Math.random() * 100 - 50]
                        }}
                        transition={{
                          duration: Math.random() * 20 + 10,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>

                  {/* Login Card */}
                  <motion.div 
                    className="w-full max-w-md mx-auto relative z-10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    {showMessageBox && (
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className={`mb-6 p-4 rounded-lg text-center font-medium ${message.includes('failed') ? 'bg-red-900/50 border border-red-700' : 'bg-green-900/50 border border-green-700'}`}
                      >
                        {message}
                      </motion.div>
                    )}

                    <div className="bg-gradient-to-br from-red-900/30 to-pink-900/20 backdrop-blur-lg rounded-2xl border border-red-900/30 overflow-hidden shadow-2xl">
                      {/* Card Header */}
                      <div className="bg-gradient-to-r from-red-900 to-pink-900 p-6 text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                        <p className="text-red-200 mt-2">
                          {isLogin ? 'Sign in to continue your journey' : 'Join our developer community'}
                        </p>
                      </div>

                      {/* Card Body */}
                      <div className="p-6">
                        <form onSubmit={handleSubmit}>
                          {!isLogin && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="mb-4 overflow-hidden"
                            >
                              <label className="block text-gray-300 text-sm font-medium mb-2">Username</label>
                              <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-red-300/50"
                                placeholder="Your username"
                                required={!isLogin}
                              />
                            </motion.div>
                          )}

                          <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-red-300/50"
                              placeholder="you@example.com"
                              required
                            />
                          </div>

                          {!isLogin && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.3 }}
                              className="mb-4 overflow-hidden"
                            >
                              <label className="block text-gray-300 text-sm font-medium mb-2">GitHub ID (Optional)</label>
                              <input
                                type="text"
                                value={githubId}
                                onChange={(e) => setGithubId(e.target.value)}
                                className="w-full px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-red-300/50"
                                placeholder="Your GitHub username"
                              />
                            </motion.div>
                          )}

                          <div className="mb-6">
                            <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-white placeholder-red-300/50"
                              placeholder="••••••••"
                              required
                            />
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold rounded-lg transition-all shadow-lg"
                          >
                            {isLogin ? 'Sign In' : 'Create Account'}
                          </motion.button>
                        </form>

                        <div className="mt-6 text-center">
                          <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-red-300 hover:text-white text-sm font-medium transition-colors"
                          >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Other sections with similar premium treatment */}
              {activeSection === 'profile' && <Profile repositories={repos} />}
              {activeSection === 'contact' && <Contact />}
              {activeSection === 'faq' && <FAQ />}
              {activeSection === 'ranks' && <LeaderboardContest />}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        @keyframes pulse {
          0% { opacity: 0.1; transform: scale(0.95); }
          50% { opacity: 0.3; transform: scale(1); }
          100% { opacity: 0.1; transform: scale(0.95); }
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${nebulaColors.primary} ${nebulaColors.dark};
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: ${nebulaColors.dark};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${nebulaColors.primary};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${nebulaColors.accent};
        }
      `}</style>
    </div>
  );
};

export default ContributionRanks;