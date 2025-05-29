"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/leaderboard-contest.css";

interface Contributor {
  login: string;
  count: number;
  avatar: string;
  html_url: string;
}

function LeaderboardContest() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      const isMobileView = window.innerWidth <= 768;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    async function fetchPRContributors() {
      setLoading(true);
      setError("");
      try {
        let page = 1;
        let allPRs: any[] = [];
        const headers: Record<string, string> = {};
        if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
          headers[
            "Authorization"
          ] = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
        }
        while (true) {
          const res = await fetch(
            `https://api.github.com/repos/SASTxNST/Website_SAST/pulls?state=all&per_page=100&page=${page}`,
            { headers }
          );
          const prs: any[] = await res.json();
          if (!Array.isArray(prs) || prs.length === 0) break;
          allPRs = allPRs.concat(prs);
          if (prs.length < 100) break;
          page++;
        }
        // Count PRs per user
        const prCount: Record<string, number> = {};
        const userInfo: Record<string, { avatar: string; html_url: string }> =
          {};
        allPRs.forEach((pr) => {
          if (pr.user && pr.user.login) {
            const login = pr.user.login as string;
            prCount[login] = (prCount[login] || 0) + 1;
            if (!userInfo[login]) {
              userInfo[login] = {
                avatar: pr.user.avatar_url,
                html_url: pr.user.html_url,
              };
            }
          }
        });

        const sorted: Contributor[] = Object.entries(prCount)
          .map(([login, count]) => ({
            login,
            count: count as number,
            avatar: userInfo[login].avatar,
            html_url: userInfo[login].html_url,
          }))
          .sort((a, b) => b.count - a.count);
        setContributors(sorted);
      } catch (e) {
        setError("Failed to fetch PR data from GitHub.");
      }
      setLoading(false);
    }
    fetchPRContributors();
  }, []);

  if (!mounted) return null;

  const podium = contributors.slice(0, 3);

  return (
    <div className="leaderboard-bg">
      <Sidebar
        setActiveSection={() => {}}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <main className="leaderboard-main">
        <div className="leaderboard-header">
          <span className="leaderboard-contest-label ">LEADERBOARD</span>
        </div>

        {!loading && !error && (
          <div className="levels-histogram-vertical">
            <div className="levels-bars-vertical">
              {contributors.slice(0, 3).map((user, idx) => {
                const maxPR =
                  contributors.length > 0 ? contributors[0].count : 1;
                const barHeight = Math.max((user.count / maxPR) * 180, 24);
                return (
                  <div className="level-bar-col" key={user.login}>
                    <img
                      src={user.avatar}
                      alt={user.login}
                      className="level-bar-avatar-vertical top"
                    />
                    <span className="level-bar-label-vertical">
                      {user.login}
                    </span>
                    <div
                      className="level-bar-vertical wider"
                      style={{
                        height: `${barHeight}px`,
                        background:
                          idx === 0
                            ? "#FFCB05"
                            : idx === 1
                            ? "#C0C0C0"
                            : idx === 2
                            ? "#B87333"
                            : "#2d1e60",
                      }}
                    >
                      <span className="level-bar-count-vertical">
                        {user.count} PR{user.count !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="leaderboard-table-container"
              style={{ marginTop: "2.5rem" }}
            >
              <table className="leaderboard-table-new">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Place</th>
                    <th>PR</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.slice(0, 10).map((user, idx) => (
                    <tr key={user.login}>
                      <td className="table-user-cell">
                        <img
                          src={user.avatar}
                          alt={user.login}
                          className="table-avatar"
                        />
                        <span>{user.login}</span>
                      </td>
                      <td>{idx + 1}</td>
                      <td>{user.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";

export default LeaderboardContest;
