"use client";
import React, { useEffect, useState, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import TopStatsBlock from "@/components/TopLang";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import path from "path";

const ContributionGraph = dynamic(() => import("react-github-calendar"), {
  ssr: false,
});

const Profile = ({ repositories }) => {
  const selectedRepo = "SASTxNST/Website_SAST";

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    githubId: "",
    profilePic: "",
  });
  const [commitDetails, setCommitDetails] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cachedCommits") || "[]")
      : []
  );
  const [mergeDetails, setMergeDetails] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cachedMerges") || "[]")
      : []
  );
  const [issueDetails, setIssueDetails] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cachedIssues") || "[]")
      : []
  );
  const [prDetails, setPrDetails] = useState(
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("cachedPrs") || "[]")
      : []
  );
  const [repoMeta, setRepoMeta] = useState([]);
  const [lastFetched, setLastFetched] = useState(null);
  const [nextFetchTime, setNextFetchTime] = useState("");
  const [contributorRank, setContributorRank] = useState(null);
  const [topLanguages, setTopLanguages] = useState(["JavaScript", "Python", "HTML/CSS"]);
  const [estimatedTime, setEstimatedTime] = useState("~200h Total");
  const [achievements, setAchievements] = useState([]);
  const [progress, setProgress] = useState(0);
  const [topContributors, setTopContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [fetchError, setFetchError] = useState(null); // Add error state

  const [lineChartType, setLineChartType] = useState("commits");
  const [lineChartData, setLineChartData] = useState({
    commits: [],
    issues: [],
    prs: [],
  });

  const milestones = [1, 5, 10, 15];

  useEffect(() => {
    const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    if (!email) {
      console.log("No email found in localStorage, skipping user fetch.");
      toast.error("Please log in to continue.");
      return;
    }

    fetch("/api/getuser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("User data fetched:", data);
        setUser(data);
        setFormData({
          username: data.username || "",
          githubId: data.githubId || "",
          profilePic: data.githubId
            ? `https://github.com/${data.githubId}.png`
            : "",
        });
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data.");
      });
  }, []);

  useEffect(() => {
    if (formData.githubId) {
      setFormData((prev) => ({
        ...prev,
        profilePic: `https://github.com/${formData.githubId}.png`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        profilePic: "",
      }));
    }
  }, [formData.githubId]);

  const handleSave = () => {
    if (!formData.username || !formData.githubId) {
      toast.error("Username and GitHub ID are required.");
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("savedProfile", JSON.stringify(formData));
    }
    toast.success("Profile changes saved locally!");
    setUser((prevUser) => ({ ...prevUser, ...formData }));
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      // Dispatch custom event to notify navbar
      window.dispatchEvent(new Event("loginStateChanged"));
    }
    window.location.href = "/";
  };

  const fetchAllPages = async (endpoint, githubId, repoName) => {
    let results = [];
    let page = 1;
    let hasNext = true;

    while (hasNext) {
      const response = await fetch(`/api/github?endpoint=${endpoint}&githubId=${githubId}&repoName=${repoName}&page=${page}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      results = results.concat(result.data);
      
      hasNext = result.pagination?.hasNext || false;
      page++;
    }
    return results;
  };

  const fetchAll = useCallback(async (forceRefresh = false) => {
    if (!formData.githubId) {
      console.log("No GitHub ID provided, skipping fetch.");
      // Only show error toast if user has been loaded but no GitHub ID is set
      if (user !== null) {
        toast.error("Please enter a GitHub username to fetch data.");
      }
      return;
    }

    const now = Date.now();
    if (!forceRefresh && lastFetched && now - lastFetched < 5 * 60 * 1000) {
      console.log("Skipping fetch due to 5-minute interval");
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      console.log(`Fetching data for GitHub ID: ${formData.githubId}`);
      const [repoEventsRes, repoRes, contributorsRes] = await Promise.allSettled([
        fetchAllPages("repoEvents", formData.githubId, selectedRepo),
        fetch("/api/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: "repo", githubId: formData.githubId, repoName: selectedRepo }),
        }),
        fetchAllPages("contributors", formData.githubId, selectedRepo),
      ]);

      // Log response headers to check rate limits
      // Note: userEventsRes is now the result data, not a response object

      const getJsonIfFulfilled = async (resPromise) => {
        if (resPromise.status === "fulfilled") {
          // For fetchAllPages calls, the value is already the result
          if (Array.isArray(resPromise.value)) {
            return resPromise.value;
          }
          // For direct fetch calls, we need to handle the response
          if (resPromise.value && typeof resPromise.value.json === 'function') {
            if (!resPromise.value.ok) {
              const errorText = await resPromise.value.text();
              throw new Error(`Request failed with status ${resPromise.value.status}: ${errorText}`);
            }
            const result = await resPromise.value.json();
            return result.data || result;
          }
          // If it's already processed data
          return resPromise.value;
        }
        throw new Error(`Request failed: ${resPromise.reason || "unknown error"}`);
      };

      const [repoEvents, repo, contributors] = await Promise.all([
        getJsonIfFulfilled(repoEventsRes),
        getJsonIfFulfilled(repoRes),
        getJsonIfFulfilled(contributorsRes),
      ]);

      console.log("Repo Events:", repoEvents);
      console.log("Repo Meta:", repo);
      console.log("Contributors:", contributors);

      if (repo) {
        setRepoMeta([repo]);
      } else {
        setRepoMeta([]);
      }

      const commits = [];
      const merges = [];
      const issues = [];
      const prs = [];
      const commitMap = {};
      const issueMap = {};
      const prMap = {};

      // Process repo-specific events
      if (Array.isArray(repoEvents)) {
        repoEvents.forEach((event) => {
          const dateStr = new Date(event.created_at).toLocaleDateString("en-US");

          if (event.type === "PushEvent" && event.actor.login === formData.githubId) {
            event.payload.commits.forEach((c) => {
              const commitExists = commits.some((commit) => commit.sha === c.sha);
              if (!commitExists) {
                commits.push({
                  repoName: event.repo.name,
                  message: c.message,
                  date: new Date(event.created_at).toLocaleString("en-US"),
                  sha: c.sha,
                  url: `https://github.com/${event.repo.name}/commit/${c.sha}`,
                });
                commitMap[dateStr] = (commitMap[dateStr] || 0) + 1;
              }
            });
          } else if (
            event.type === "PullRequestEvent" &&
            event.payload.pull_request?.merged &&
            event.actor.login === formData.githubId
          ) {
            const mergeExists = merges.some((merge) => merge.url === event.payload.pull_request.html_url);
            if (!mergeExists) {
              merges.push({
                repoName: event.repo.name,
                title: event.payload.pull_request.title,
                date: new Date(event.payload.pull_request.merged_at).toLocaleString("en-US"),
                url: event.payload.pull_request.html_url,
              });
            }
          }

          if (
            event.type === "IssuesEvent" &&
            event.actor.login === formData.githubId
          ) {
            console.log("Issue Event:", event);
            const issueExists = issues.some((issue) => issue.url === event.payload.issue.html_url);
            if (!issueExists) {
              issues.push({
                repoName: event.repo.name,
                title: event.payload.issue.title,
                date: new Date(event.created_at).toLocaleString("en-US"),
                url: event.payload.issue.html_url,
              });
              issueMap[dateStr] = (issueMap[dateStr] || 0) + 1;
            }
          }

          if (
            event.type === "PullRequestEvent" &&
            event.actor.login === formData.githubId
          ) {
            const prExists = prs.some((pr) => pr.url === event.payload.pull_request.html_url);
            if (!prExists) {
              prs.push({
                repoName: event.repo.name,
                title: event.payload.pull_request.title,
                date: new Date(event.created_at).toLocaleString("en-US"),
                url: event.payload.pull_request.html_url,
              });
              prMap[dateStr] = (prMap[dateStr] || 0) + 1;
            }
          }
        });
      }

      console.log("Commits:", commits);
      console.log("Merges:", merges);
      console.log("Issues:", issues);
      console.log("PRs:", prs);

      if (typeof window !== "undefined") {
        localStorage.setItem("cachedCommits", JSON.stringify(commits));
        localStorage.setItem("cachedMerges", JSON.stringify(merges));
        localStorage.setItem("cachedIssues", JSON.stringify(issues));
        localStorage.setItem("cachedPrs", JSON.stringify(prs));
      }
      setCommitDetails(commits);
      setMergeDetails(merges);
      setIssueDetails(issues);
      setPrDetails(prs);
      setLastFetched(now);

      const next = new Date(now + 5 * 60 * 1000);
      setNextFetchTime(next.toLocaleTimeString("en-US"));

      if (Array.isArray(contributors)) {
        const rank = contributors.findIndex((c) => c.login === formData.githubId) + 1;
        setContributorRank(rank > 0 ? rank : null);
        setTopContributors(contributors.slice(0, 3));
      } else {
        setContributorRank(null);
        setTopContributors([]);
      }

      const newAchievements = [];
      // if (commits.length >= 1) newAchievements.push("First Commit 🎉");
      // if (commits.length >= 5) newAchievements.push("5 Commits 🏆");
      // if (commits.length >= 10) newAchievements.push("10 Commits 🏆");
      // if (merges.length >= 1) newAchievements.push("First PR Merged 🚀");
      // if (merges.length >= 5) newAchievements.push("5 PR Merged 🚀");
      // if (merges.length >= 10) newAchievements.push("10 PR Merged 🚀");
      // if (issues.length >= 1) newAchievements.push("First Issue Opened 📋");
      // if (issues.length >= 5) newAchievements.push("5 Issues Opened 📋");
      // if (prs.length >= 1) newAchievements.push("First PR Opened 🔧");
      // if (prs.length >= 5) newAchievements.push("5 PRs Opened 🔧");
      

      if(prs.length >= 1) newAchievements.push("/1PR.svg");
      if(merges.length >= 1) newAchievements.push("/1PRM.svg");
      if(merges.length >= 5) newAchievements.push("/5PRM.png");
      if(merges.length >= 10) newAchievements.push("/10PRM.png");
      if(merges.length > 10) newAchievements.push("/10PRM+.png");
      setAchievements(newAchievements);
      console.log("Achievements:", newAchievements);

      const totalMerges = merges.length;
      const nextMilestone = milestones.find((m) => mergeDetails.length < m) || 15;
      setProgress((totalMerges / nextMilestone) * 100);
      console.log("Total PRs Merged:", totalMerges, "Next Milestone:", nextMilestone, "Progress:", (totalMerges / nextMilestone) * 100);

      const formatMap = (map) =>
        Object.entries(map)
          .map(([date, count]) => ({ date, count }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setLineChartData({
        commits: formatMap(commitMap),
        issues: formatMap(issueMap),
        prs: formatMap(prMap),
      });

    } catch (err) {
      console.error("GitHub API fetch error:", err.message);
      setFetchError(err.message);
      if (err.message.includes("403")) {
        toast.error("GitHub API rate limit exceeded. Please try again later or use a personal access token.");
      } else if (err.message.includes("404")) {
        toast.error("GitHub username or repository not found. Please check your GitHub ID.");
      } else if (err.message.includes("GitHub token not configured")) {
        toast.error("GitHub token not configured.");
      } else {
        toast.error("Failed to fetch GitHub data. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [formData.githubId, formData.username, lastFetched, user]);

  useEffect(() => {
    console.log("Triggering fetchAll with githubId:", formData.githubId);
    fetchAll();

    const interval = setInterval(() => fetchAll(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const stars = repoMeta[0]?.stargazers_count || 0;
  const forks = repoMeta[0]?.forks_count || 0;

  const pieData = [
    { name: "Commits", value: commitDetails.length },
    { name: "PR Merges", value: mergeDetails.length },
    { name: "Issues", value: issueDetails.length },
    { name: "PRs", value: prDetails.length },
  ].filter((entry) => entry.value > 0);
  const pieColors = ["#56d364", "#1f6feb", "#f1e05a", "#ff8c00"];

  const nextMilestone = milestones.find((m) => mergeDetails.length < m) || 15;

  return (
    <div className="min-h-screen bg-[#0d1117] p-2 sm:p-4 md:p-6 text-[#c9d1d9] font-sans">
      <Toaster 
        toastOptions={{
          style: {
            background: '#161b22',
            color: '#c9d1d9',
            border: '1px solid #30363d'
          }
        }}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 sm:gap-4 mb-4 sm:mb-6 md:mb-8 border-b border-[#30363d] pb-2 sm:pb-4 md:pb-6">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#e6edf3] animate-pulse">Welcome, {formData.username || 'Developer'}!</h1>
          {nextFetchTime && <p className="text-xs sm:text-sm text-[#7d8590] mt-1">Next data refresh: {nextFetchTime}</p>}
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 md:mt-0">
          <div className="flex items-center text-xs bg-[#161b22] px-2 py-1 rounded-md border border-[#30363d] hover:scale-105 transition-transform">
            <span className="text-[#7d8590] mr-1">⭐</span>
            <span className="font-medium">{stars}</span>
          </div>
          <div className="flex items-center text-xs bg-[#161b22] px-2 py-1 rounded-md border border-[#30363d] hover:scale-105 transition-transform">
            <span className="text-[#7d8590] mr-1">🍴</span>
            <span className="font-medium">{forks}</span>
          </div>
          <button
            onClick={() => fetchAll(true)}
            className="text-xs px-2 py-1 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Fetching..." : "Refresh Data"}
          </button>
          <button 
            onClick={handleLogout} 
            className="text-xs px-2 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#363b42] text-[#f85149] hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {fetchError && (
        <div className="bg-[#21262d] p-2 sm:p-4 rounded-lg border border-[#f85149] mb-4 sm:mb-6 text-center">
          <p className="text-xs sm:text-sm text-[#f85149]">{fetchError}</p>
          <p className="text-xs sm:text-sm text-[#7d8590] mt-1">Using cached data if available.</p>
        </div>
      )}

      <TopStatsBlock 
        topLanguages={topLanguages} 
        estimatedTime={estimatedTime} 
        contributorRank={contributorRank} 
        nextFetchTime={nextFetchTime} 
      />

      <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d] mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Your Achievements</h2>
        {achievements.length > 0 ? (
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 text-xs sm:text-sm text-[#56d364] h-50">
                <img src={achievement} className="h-full"/>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-2 sm:py-4 text-[#7d8590] text-xs sm:text-sm">
            Start contributing to earn your first badge!
          </div>
        )}
      </div>

      <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d] mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Contribution Progress</h2>
        <div className="w-full bg-[#0d1117] rounded-full h-3 sm:h-4 border border-[#30363d]">
          <div
            className="bg-[#1f6feb] h-3 sm:h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-xs sm:text-sm text-[#7d8590] mt-1 sm:mt-2">
          {mergeDetails.length} PRs merged - {progress.toFixed(0)}% to next milestone ({mergeDetails.length}/{nextMilestone})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d]">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Profile Settings</h2>
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <label className="block">
              <span className="text-xs sm:text-sm text-[#7d8590] block mb-1">Display name</span>
              <input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-xs sm:text-sm focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] outline-none transition"
                placeholder="Your name"
              />
            </label>
            <label className="block">
              <span className="text-xs sm:text-sm text-[#7d8590] block mb-1">GitHub username</span>
              <input
                value={formData.githubId}
                onChange={(e) => setFormData({ ...formData, githubId: e.target.value })}
                className="w-full px-2 sm:px-3 py-1 sm:py-2 rounded bg-[#0d1117] border border-[#30363d] text-[#c9d1d9] text-xs sm:text-sm focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] outline-none transition"
                placeholder="GitHub username"
              />
            </label>
            <button
              onClick={handleSave}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white font-medium text-xs sm:text-sm transition-colors"
            >
              Save changes
            </button>
          </div>
        </div>

        <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d] flex flex-col">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Profile Preview</h2>
          <div className="flex flex-col items-center justify-center flex-grow py-2 sm:py-4">
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile Preview"
                className="w-20 h-20 sm:w-24 md:w-32 sm:h-24 md:h-32 rounded-full object-cover border-4 border-[#30363d] mb-2 sm:mb-4 hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 md:w-32 sm:h-24 md:h-32 rounded-full bg-[#0d1117] border-4 border-[#30363d] mb-2 sm:mb-4 flex items-center justify-center text-[#7d8590] text-xs sm:text-sm">
                No Image
              </div>
            )}
            <div className="text-center">
              <p className="text-xs sm:text-sm text-[#7d8590]">GitHub Contributions Rank</p>
              <div className="mt-1 bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 inline-block">
                <span className="font-semibold text-[#e6edf3] text-xs sm:text-sm md:text-base">
                  {contributorRank ? `#${contributorRank}` : 'Not ranked'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d] mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Top Contributors</h2>
        {topContributors.length > 0 ? (
          <div className="space-y-2">
            {topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center gap-2 sm:gap-3">
                <span className="text-[#56d364] font-semibold text-xs sm:text-sm">#{index + 1}</span>
                <img
                  src={`https://github.com/${contributor.login}.png`}
                  alt={contributor.login}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-[#30363d]"
                />
                <span className="text-xs sm:text-sm text-[#e6edf3] truncate">{contributor.login}</span>
                <span className="ml-auto text-xs text-[#7d8590]">{contributor.contributions} contributions</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-2 sm:py-4 text-[#7d8590] text-xs sm:text-sm">
            No contributors data available
          </div>
        )}
      </div>

      <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d] mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Challenges</h2>
        <div className="space-y-2">
          {/* Issue Challenges */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[#e6edf3]">Open 1 Issue</span>
            <span className="text-xs text-[#7d8590]">{issueDetails.length}/1</span>
          </div>
          <div className="w-full bg-[#0d1117] rounded-full h-2">
            <div
              className="bg-[#56d364] h-2 rounded-full"
              style={{ width: `${Math.min((issueDetails.length / 1) * 100, 100)}%` }}
            ></div>
          </div>
          
          {issueDetails.length >= 1 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#e6edf3]">Open 5 Issues</span>
                <span className="text-xs text-[#7d8590]">{issueDetails.length}/5</span>
              </div>
              <div className="w-full bg-[#0d1117] rounded-full h-2">
                <div
                  className="bg-[#56d364] h-2 rounded-full"
                  style={{ width: `${Math.min((issueDetails.length / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}
          
          {issueDetails.length >= 5 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#e6edf3]">Open 10 Issues</span>
                <span className="text-xs text-[#7d8590]">{issueDetails.length}/10</span>
              </div>
              <div className="w-full bg-[#0d1117] rounded-full h-2">
                <div
                  className="bg-[#56d364] h-2 rounded-full"
                  style={{ width: `${Math.min((issueDetails.length / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}

          {/* PR Challenges */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[#e6edf3]">Open 1 PR</span>
            <span className="text-xs text-[#7d8590]">{prDetails.length}/1</span>
          </div>
          <div className="w-full bg-[#0d1117] rounded-full h-2">
            <div
              className="bg-[#56d364] h-2 rounded-full"
              style={{ width: `${Math.min((prDetails.length / 1) * 100, 100)}%` }}
            ></div>
          </div>
          
          {prDetails.length >= 1 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#e6edf3]">Open 5 PRs</span>
                <span className="text-xs text-[#7d8590]">{prDetails.length}/5</span>
              </div>
              <div className="w-full bg-[#0d1117] rounded-full h-2">
                <div
                  className="bg-[#56d364] h-2 rounded-full"
                  style={{ width: `${Math.min((prDetails.length / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}
          
          {prDetails.length >= 5 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#e6edf3]">Open 10 PRs</span>
                <span className="text-xs text-[#7d8590]">{prDetails.length}/10</span>
              </div>
              <div className="w-full bg-[#0d1117] rounded-full h-2">
                <div
                  className="bg-[#56d364] h-2 rounded-full"
                  style={{ width: `${Math.min((prDetails.length / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}

          {/* Merge PR Challenges */}
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm text-[#e6edf3]">Merge 1 PR</span>
            <span className="text-xs text-[#7d8590]">{mergeDetails.length}/1</span>
          </div>
          <div className="w-full bg-[#0d1117] rounded-full h-2">
            <div
              className="bg-[#56d364] h-2 rounded-full"
              style={{ width: `${Math.min((mergeDetails.length / 1) * 100, 100)}%` }}
            ></div>
          </div>
          
          {mergeDetails.length >= 1 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#e6edf3]">Merge 5 PRs</span>
                <span className="text-xs text-[#7d8590]">{mergeDetails.length}/5</span>
              </div>
              <div className="w-full bg-[#0d1117] rounded-full h-2">
                <div
                  className="bg-[#56d364] h-2 rounded-full"
                  style={{ width: `${Math.min((mergeDetails.length / 5) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}
          
          {mergeDetails.length >= 5 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-[#e6edf3]">Merge 10 PRs</span>
                <span className="text-xs text-[#7d8590]">{mergeDetails.length}/10</span>
              </div>
              <div className="w-full bg-[#0d1117] rounded-full h-2">
                <div
                  className="bg-[#56d364] h-2 rounded-full"
                  style={{ width: `${Math.min((mergeDetails.length / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d]">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Contribution Heatmap</h2>
          {formData.githubId ? (
            isLoading ? (
              <div className="text-center py-4 sm:py-8 text-[#7d8590] text-xs sm:text-sm">
                Loading contribution heatmap...
              </div>
            ) : (
              <div className="p-1 sm:p-2 overflow-x-auto">
                <ContributionGraph 
                  username={formData.githubId} 
                  colorScheme="dark"
                  blockSize={8}
                  blockMargin={2}
                  fontSize={8}
                  showTooltip={true}
                />
              </div>
            )
          ) : (
            <div className="text-center py-4 sm:py-8 text-[#7d8590] text-xs sm:text-sm">
              Enter GitHub username to see contributions
            </div>
          )}
        </div>

        <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d]">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold mb-2 sm:mb-3 md:mb-4 text-[#e6edf3] border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">Contribution Breakdown</h2>
          <div className="h-[150px] sm:h-[180px] md:h-[200px] flex items-center justify-center">
            {isLoading ? (
              <div className="text-center text-[#7d8590] text-xs sm:text-sm">
                Loading contribution breakdown...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={50}
                    innerRadius={25}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      background: '#161b22',
                      borderColor: '#30363d',
                      borderRadius: '6px',
                      color: '#e6edf3',
                      fontSize: '10px'
                    }}
                    itemStyle={{ color: '#e6edf3' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] p-2 sm:p-4 md:p-5 rounded-lg border border-[#30363d] mb-4 sm:mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 sm:mb-3 md:mb-4 border-b border-[#30363d] pb-1 sm:pb-2 md:pb-3">
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-[#e6edf3]">Activity Over Time</h2>
          <div className="flex space-x-1 bg-[#0d1117] rounded-md p-1 border border-[#30363d] mt-2 sm:mt-0">
            {["commits", "issues", "PRs"].map((type) => (
              <button
                key={type}
                onClick={() => setLineChartType(type)}
                className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs ${
                  lineChartType === type
                    ? "bg-[#1f6feb] text-white"
                    : "text-[#7d8590] hover:bg-[#21262d]"
                } transition-colors`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[150px] sm:h-[200px] md:h-[250px]">
          {isLoading ? (
            <div className="text-center py-4 sm:py-8 text-[#7d8590] text-xs sm:text-sm">
              Loading activity data...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData[lineChartType]}>
                <XAxis 
                  dataKey="date" 
                  stroke="#7d8590"
                  tick={{ fontSize: 8 }}
                  tickCount={5}
                  angle={-45}
                  dy={10}
                />
                <YAxis 
                  allowDecimals={false} 
                  stroke="#7d8590"
                  tick={{ fontSize: 8 }}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#161b22',
                    borderColor: '#30363d',
                    borderRadius: '6px',
                    color: '#e6edf3',
                    fontSize: '10px'
                  }}
                  itemStyle={{ color: '#e6edf3' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#1f6feb" 
                  strokeWidth={2} 
                  dot={{ fill: '#1f6feb', r: 2 }}
                  activeDot={{ fill: '#56d364', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;