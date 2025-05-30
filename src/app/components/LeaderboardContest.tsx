"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAward, FiZap, FiBook, FiClock, FiChevronUp, FiChevronDown } from "react-icons/fi";
import Sidebar from "../components/Sidebar";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  lastSubmission: string;
  trend: "up" | "down" | "neutral";
  change: number;
}

const leaderboardData: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Shitanshu Kumar Singh",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    score: 888,
    lastSubmission: "13 days ago",
    trend: "up",
    change: 12,
  },
  {
    rank: 2,
    name: "Avi Meher",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    score: 870,
    lastSubmission: "18 days ago",
    trend: "down",
    change: 5,
  },
  {
    rank: 3,
    name: "Adityaraj Pal",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    score: 868,
    lastSubmission: "19 days ago",
    trend: "up",
    change: 8,
  },
  // ... more users
  {
    rank: 51,
    name: "Ankit Kumar Pandey",
    avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    score: 290,
    lastSubmission: "20 days ago",
    trend: "neutral",
    change: 0,
  },
];

const months = ["All Time", "May 25"];

const LeaderboardPage: React.FC = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<string>(months[1]);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  // Premium nebula red color palette
  const colors = {
    primary: "#FF2D55", // Vibrant red
    secondary: "#FF5C7F", // Lighter red
    accent: "#FF8AA4", // Soft pink accent
    dark: "#0F0A1A", // Deep dark purple
    darker: "#070510", // Almost black
    light: "#F8F4F9", // Off-white
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    success: "#00E676",
    danger: "#FF3D00", // Brighter red for danger
    warning: "#FF9100", // Orange warning
    nebula: "#FF2D55", // Nebula effect color
  };

  return (
    <div className="leaderboard-container">
      {/* Animated nebula background elements */}
      <div className="background-elements">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-orb"
            style={{
              background: `radial-gradient(circle, ${i % 3 === 0 ? colors.primary : i % 2 === 0 ? colors.accent : colors.secondary}, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <Sidebar setActiveSection={() => {}} />

      <main className="leaderboard-content">
        {/* Floating header */}
        <motion.header 
          className="leaderboard-header"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            backgroundColor: isScrolled ? 'rgba(15, 10, 26, 0.9)' : 'transparent',
            boxShadow: isScrolled ? `0 4px 30px ${colors.primary}33` : 'none',
          }}
        >
          <div className="header-content">
            <div className="time-tabs">
              {months.map((month) => (
                <motion.button
                  key={month}
                  className={`time-tab ${selectedMonth === month ? 'active' : ''}`}
                  onClick={() => setSelectedMonth(month)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {month}
                </motion.button>
              ))}
            </div>

            <div className="title-group">
              <motion.span 
                className="contest-label"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                MAY 2025 CONTEST
              </motion.span>
              <motion.h1 
                className="main-title"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Leaderboard
              </motion.h1>
            </div>

            <motion.button 
              className="how-it-works"
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 15px ${colors.accent}`
              }}
              whileTap={{ scale: 0.95 }}
            >
              How it Works
            </motion.button>
          </div>
        </motion.header>

        {/* Podium section */}
        <section className="podium-section">
          <motion.div 
            className="podium-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Second place */}
            <motion.div 
              className="podium-item second-place"
              whileHover={{ y: -10 }}
            >
              <div className="podium-avatar-container">
                <div className="podium-avatar-frame">
                  <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} />
                </div>
                <div className="podium-rank-badge">
                  <FiAward className="award-icon" />
                  <span>2</span>
                </div>
              </div>
              <h3 className="podium-name">{leaderboardData[1].name}</h3>
              <div className="podium-score">
                <span>{leaderboardData[1].score}</span>
                <span className="trend down">
                  <FiChevronDown /> {leaderboardData[1].change}
                </span>
              </div>
            </motion.div>

            {/* First place */}
            <motion.div 
              className="podium-item first-place"
              whileHover={{ y: -15 }}
            >
              <div className="crown-icon">👑</div>
              <div className="podium-avatar-container">
                <div className="podium-avatar-frame">
                  <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} />
                </div>
                <div className="podium-rank-badge">
                  <FiAward className="award-icon" />
                  <span>1</span>
                </div>
              </div>
              <h3 className="podium-name">{leaderboardData[0].name}</h3>
              <div className="podium-score">
                <span>{leaderboardData[0].score}</span>
                <span className="trend up">
                  <FiChevronUp /> {leaderboardData[0].change}
                </span>
              </div>
            </motion.div>

            {/* Third place */}
            <motion.div 
              className="podium-item third-place"
              whileHover={{ y: -10 }}
            >
              <div className="podium-avatar-container">
                <div className="podium-avatar-frame">
                  <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} />
                </div>
                <div className="podium-rank-badge">
                  <FiAward className="award-icon" />
                  <span>3</span>
                </div>
              </div>
              <h3 className="podium-name">{leaderboardData[2].name}</h3>
              <div className="podium-score">
                <span>{leaderboardData[2].score}</span>
                <span className="trend up">
                  <FiChevronUp /> {leaderboardData[2].change}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* XP Banner */}
        <motion.section 
          className="xp-banner"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="banner-content">
            <div className="banner-text">
              <h3>Increase your XP to climb the leaderboard!</h3>
              <p>Solve assignments, arena questions, contests, and quizzes.</p>
            </div>
            <div className="banner-actions">
              <motion.button 
                className="action-btn assignments"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBook className="icon" />
                Solve Assignments
              </motion.button>
              <motion.button 
                className="action-btn arena"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiZap className="icon" />
                Go To Arena
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Leaderboard Table */}
        <motion.div 
          className="table-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>CHANGE</th>
                  <th>NAME</th>
                  <th>XP THIS MONTH</th>
                  <th>LATEST SUBMISSION</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((user) => (
                  <motion.tr
                    key={user.rank}
                    className={user.rank === 51 ? "highlight-row" : ""}
                    whileHover={{ 
                      scale: 1.01,
                      boxShadow: `0 4px 15px ${colors.primary}33`
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <td>
                      <div className={`rank-cell rank-${user.rank}`}>
                        {user.rank <= 3 ? (
                          <FiAward className="award-icon" />
                        ) : null}
                        {user.rank}
                      </div>
                    </td>
                    <td>
                      {user.trend === "up" ? (
                        <span className="trend up">
                          <FiChevronUp /> {user.change}
                        </span>
                      ) : user.trend === "down" ? (
                        <span className="trend down">
                          <FiChevronDown /> {user.change}
                        </span>
                      ) : (
                        <span className="trend neutral">–</span>
                      )}
                    </td>
                    <td className="user-cell">
                      <div className="user-info">
                        <img src={user.avatar} alt={user.name} className="user-avatar" />
                        <span className="user-name">{user.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="score-cell">{user.score}</div>
                    </td>
                    <td>
                      <div className="submission-cell">
                        <FiClock className="clock-icon" />
                        {user.lastSubmission}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      <style jsx>{`
        .leaderboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, ${colors.darker} 0%, ${colors.dark} 100%);
          display: flex;
          position: relative;
          overflow: hidden;
          color: ${colors.light};
        }

        .background-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }

        .floating-orb {
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          filter: blur(30px);
          opacity: 0.2;
        }

        .leaderboard-content {
          flex: 1;
          padding: 2rem;
          position: relative;
          z-index: 1;
        }

        .leaderboard-header {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 1.5rem 0;
          transition: all 0.3s ease;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .time-tabs {
          display: flex;
          gap: 0.5rem;
        }

        .time-tab {
          background: rgba(255, 255, 255, 0.1);
          color: ${colors.light};
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.6rem 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .time-tab.active {
          background: ${colors.primary};
          color: white;
          box-shadow: 0 0 15px ${colors.primary};
        }

        .title-group {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .contest-label {
          background: ${colors.primary};
          color: white;
          border-radius: 20px;
          padding: 0.3rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .main-title {
          font-size: 2.8rem;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(to right, ${colors.light}, ${colors.accent});
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .how-it-works {
          background: white;
          color: ${colors.dark};
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 1rem;
          padding: 0.7rem 1.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .podium-section {
          margin: 3rem 0;
        }

        .podium-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 2rem;
        }

        .podium-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          border-radius: 20px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(5px);
        }

        .first-place {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
          border: 1px solid rgba(255, 215, 0, 0.3);
          margin-bottom: -2rem;
          min-width: 220px;
        }

        .second-place {
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05));
          border: 1px solid rgba(192, 192, 192, 0.3);
          min-width: 200px;
        }

        .third-place {
          background: linear-gradient(135deg, rgba(205, 127, 50, 0.15), rgba(205, 127, 50, 0.05));
          border: 1px solid rgba(205, 127, 50, 0.3);
          min-width: 200px;
        }

        .crown-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: ${colors.gold};
        }

        .podium-avatar-container {
          position: relative;
          margin-bottom: 1rem;
        }

        .podium-avatar-frame {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 3px solid ${colors.primary};
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .first-place .podium-avatar-frame {
          width: 120px;
          height: 120px;
          border: 4px solid ${colors.gold};
        }

        .second-place .podium-avatar-frame {
          border: 3px solid ${colors.silver};
        }

        .third-place .podium-avatar-frame {
          border: 3px solid ${colors.bronze};
        }

        .podium-avatar-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .podium-rank-badge {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: ${colors.dark};
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid ${colors.primary};
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        }

        .first-place .podium-rank-badge {
          background: ${colors.gold};
          color: ${colors.dark};
          border: 2px solid white;
          width: 45px;
          height: 45px;
          font-size: 1.3rem;
        }

        .second-place .podium-rank-badge {
          background: ${colors.silver};
          color: ${colors.dark};
        }

        .third-place .podium-rank-badge {
          background: ${colors.bronze};
          color: white;
        }

        .award-icon {
          margin-right: 5px;
        }

        .podium-name {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0.5rem 0;
          text-align: center;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .podium-score {
          font-size: 1.5rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .first-place .podium-score {
          font-size: 1.8rem;
          color: ${colors.gold};
        }

        .second-place .podium-score {
          color: ${colors.silver};
        }

        .third-place .podium-score {
          color: ${colors.bronze};
        }

        .trend {
          font-size: 0.9rem;
          display: flex;
          align-items: center;
        }

        .trend.up {
          color: ${colors.success};
        }

        .trend.down {
          color: ${colors.danger};
        }

        .trend.neutral {
          color: ${colors.light};
          opacity: 0.7;
        }

        .xp-banner {
          max-width: 1200px;
          margin: 0 auto 3rem;
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          border-radius: 20px;
          padding: 1.5rem 2rem;
          box-shadow: 0 5px 25px ${colors.primary}4D;
        }

        .banner-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .banner-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
        }

        .banner-text p {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        .banner-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          border-radius: 15px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.assignments {
          background: white;
          color: ${colors.dark};
        }

        .action-btn.arena {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          backdrop-filter: blur(5px);
        }

        .action-btn .icon {
          font-size: 1.2rem;
        }

        .table-container {
          max-width: 1200px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.2);
        }

        .table-wrapper {
          overflow-x: auto;
          padding: 1rem;
        }

        .leaderboard-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0 0.5rem;
        }

        .leaderboard-table th {
          color: ${colors.primary};
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 1rem 1.5rem;
          text-align: left;
          background: rgba(255, 45, 85, 0.1);
        }

        .leaderboard-table td {
          padding: 1.2rem 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .leaderboard-table tr:first-child td {
          border-top: none;
        }

        .leaderboard-table tr:last-child td {
          border-bottom: none;
        }

        .rank-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          width: fit-content;
        }

        .rank-1 {
          background: rgba(255, 215, 0, 0.2);
          color: ${colors.gold};
        }

        .rank-2 {
          background: rgba(192, 192, 192, 0.2);
          color: ${colors.silver};
        }

        .rank-3 {
          background: rgba(205, 127, 50, 0.2);
          color: ${colors.bronze};
        }

        .rank-default {
          background: rgba(255, 255, 255, 0.1);
          color: ${colors.light};
        }

        .user-cell .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid ${colors.primary};
        }

        .user-name {
          font-weight: 600;
        }

        .score-cell {
          font-weight: 700;
          color: ${colors.warning};
        }

        .submission-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: ${colors.accent};
        }

        .clock-icon {
          opacity: 0.7;
        }

        .highlight-row td {
          background: rgba(255, 45, 85, 0.1);
          border-color: rgba(255, 45, 85, 0.2) !important;
        }

        @media (max-width: 1024px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
          }

          .podium-container {
            flex-direction: column;
            align-items: center;
            gap: 1.5rem;
          }

          .podium-item {
            width: 100%;
            max-width: 300px;
            margin-bottom: 0 !important;
          }

          .banner-content {
            flex-direction: column;
            text-align: center;
          }

          .banner-actions {
            width: 100%;
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .leaderboard-content {
            padding: 1rem;
          }

          .main-title {
            font-size: 2rem;
          }

          .time-tabs {
            flex-wrap: wrap;
            justify-content: center;
          }

          .xp-banner {
            padding: 1rem;
          }

          .banner-text h3 {
            font-size: 1.2rem;
          }

          .banner-actions {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default LeaderboardPage;