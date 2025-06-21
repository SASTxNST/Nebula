"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

const LeaderboardContest = () => {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [contributors, setContributors] = useState([]);
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
        let allPRs = [];
        
        while (true) {
          const res = await fetch(`/api/github?endpoint=pulls&repoName=SASTxNST/Website_SAST&page=${page}`);
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
          }
          const responseData = await res.json();
          const prs = responseData.data;
          if (!Array.isArray(prs) || prs.length === 0) break;
          allPRs = allPRs.concat(prs);
          if (prs.length < 100) break;
          page++;
        }

        const prCount = {};
        const userInfo = {};
        allPRs.forEach((pr) => {
          if (pr.user && pr.user.login) {
            const login = pr.user.login;
            prCount[login] = (prCount[login] || 0) + 1;
            if (!userInfo[login]) {
              userInfo[login] = {
                avatar: pr.user.avatar_url,
                html_url: pr.user.html_url,
              };
            }
          }
        });

        const sorted = Object.entries(prCount)
          .map(([login, count]) => ({
            login,
            count: count,
            avatar: userInfo[login].avatar,
            html_url: userInfo[login].html_url,
          }))
          .sort((a, b) => b.count - a.count);
        setContributors(sorted);
      } catch (err) {
        console.error("Error fetching PR data:", err);
        if (err.message.includes("rate limit")) {
          toast.error("GitHub API rate limit exceeded. Please try again later.");
        } else if (err.message.includes("GitHub token not configured")) {
          toast.error("GitHub token not configured.");
        } else {
          toast.error("Failed to fetch PR data. Please try again later.");
        }
        setError("Failed to fetch PR data from GitHub.");
      }
      setLoading(false);
    }
    fetchPRContributors();
  }, []);

  if (!mounted) return null;

  const podium = contributors.slice(0, 3);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-gradient-to-b from-[#1a1a2e] to-[#222244] md:flex-row">
      <main className={`flex flex-1 flex-col items-center mt-20 p-4 transition-all duration-300 sm:p-6 md:p-8 ${isSidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
        <div className="relative mx-auto mb-8 flex w-full max-w-7xl flex-col items-center justify-center gap-4 text-center">
          <span className="mb-2 rounded-lg bg-blue-600 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-white md:px-4 md:text-base">
            LEADERBOARD
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            GitHub PR Rankings
          </h1>
        </div>

        {loading ? (
          <div className="m-8 text-center text-lg text-white">Loading...</div>
        ) : error ? (
          <div className="m-8 text-center text-lg text-red-500">{error}</div>
        ) : (
          <>
            <div className="mb-10 flex w-full max-w-5xl items-end justify-center gap-4 sm:gap-8 md:gap-12">
              {podium[1] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg sm:h-28 sm:w-28 md:h-32 md:w-32">
                    <Image
                      src={podium[1].avatar}
                      alt={podium[1].login}
                      width={96}
                      height={96}
                      className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24 md:h-28 md:w-28"
                    />
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xl font-bold text-[#2d1e60] shadow-md md:px-4 md:text-2xl">
                      2
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white sm:text-xl">{podium[1].login}</div>
                  <div className="text-base font-bold text-yellow-400 sm:text-lg">{podium[1].count} PRs</div>
                </div>
              )}
              {podium[0] && (
                <div className="flex flex-col items-center pb-6">
                  <div className="relative mb-2 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-lg sm:h-32 sm:w-32 md:h-36 md:w-36">
                    <Image
                      src={podium[0].avatar}
                      alt={podium[0].login}
                      width={128}
                      height={128}
                      className="h-24 w-24 rounded-full object-cover sm:h-28 sm:w-28 md:h-32 md:w-32"
                    />
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-2xl font-bold text-[#2d1e60] shadow-md md:px-5 md:text-3xl">
                      1
                    </span>
                  </div>
                  <div className="text-xl font-bold text-white sm:text-2xl">{podium[0].login}</div>
                  <div className="text-lg font-bold text-yellow-400 sm:text-xl">{podium[0].count} PRs</div>
                </div>
              )}
              {podium[2] && (
                <div className="flex flex-col items-center">
                  <div className="relative mb-2 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg sm:h-28 sm:w-28 md:h-32 md:w-32">
                    <Image
                      src={podium[2].avatar}
                      alt={podium[2].login}
                      width={96}
                      height={96}
                      className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24 md:h-28 md:w-28"
                    />
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 text-xl font-bold text-[#2d1e60] shadow-md md:px-4 md:text-2xl">
                      3
                    </span>
                  </div>
                  <div className="text-lg font-bold text-white sm:text-xl">{podium[2].login}</div>
                  <div className="text-base font-bold text-yellow-400 sm:text-lg">{podium[2].count} PRs</div>
                </div>
              )}
            </div>

            <div className="w-full max-w-7xl overflow-x-auto rounded-lg bg-white shadow-lg">
              <table className="min-w-[700px] w-full border-separate border-spacing-0 text-left text-base md:min-w-[800px]">
                <thead className="bg-[#f7f7fa]">
                  <tr>
                    <th className="p-3 text-sm font-bold text-blue-600 sm:p-4 sm:text-base">RANK</th>
                    <th className="p-3 text-sm font-bold text-blue-600 sm:p-4 sm:text-base">USER</th>
                    <th className="p-3 text-sm font-bold text-blue-600 sm:p-4 sm:text-base">PRs</th>
                    <th className="p-3 text-sm font-bold text-blue-600 sm:p-4 sm:text-base">PROFILE</th>
                  </tr>
                </thead>
                <tbody>
                  {contributors.map((user, idx) => (
                    <tr
                      key={user.login}
                      className={`${idx === 0 ? "bg-yellow-50" : ""} border-b border-gray-200 last:border-b-0`}
                    >
                      <td className="p-3 text-sm font-medium text-[#2d1e60] sm:p-4 sm:text-base">
                        <span
                          className={`inline-block min-w-[2rem] rounded-xl px-2 py-1 text-center text-sm font-bold ${
                            idx + 1 === 1
                              ? "bg-yellow-300"
                              : idx + 1 === 2
                                ? "bg-gray-300"
                                : idx + 1 === 3
                                  ? "bg-orange-300"
                                  : "bg-[#f7f7fa]"
                          } sm:text-base`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="flex items-center gap-2 p-3 sm:p-4">
                        <Image
                          src={user.avatar}
                          alt={user.login}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover sm:h-10 sm:w-10"
                        />
                        <span className="text-sm font-semibold text-[#2d1e60] sm:text-base">{user.login}</span>
                      </td>
                      <td className="p-3 text-sm font-bold text-yellow-500 sm:p-4 sm:text-base">{user.count}</td>
                      <td className="p-3 text-sm sm:p-4">
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          Profile
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  );
};

export const dynamic = "force-dynamic";

export default LeaderboardContest;