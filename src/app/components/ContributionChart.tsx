"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../globals.css"

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface Props {
  repoOwner: string;
  repoName: string;
  className?: string;
}

const ContributionChart: React.FC<Props> = ({ repoOwner, repoName, className = "" }) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${repoOwner}/${repoName}/commits?per_page=10`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setCommits(data);
          setVisibleIndex(0);
        } else {
          console.warn("GitHub API returned non-array data:", data);
          setCommits([]);
        }
      } catch (error) {
        console.error("Failed to fetch commits:", error);
      }
    };

    fetchCommits();
  }, [repoOwner, repoName]);

  useEffect(() => {
    if (commits.length === 0) return;

    const interval = setInterval(() => {
      setVisibleIndex((prev) => (prev + 1) % commits.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [commits]);

  return (
    <div className={`bg-black bg-opacity-40 rounded-lg px-6 py-4 overflow-hidden min-h-[120px] ${className}`}>
      <h3 className="text-lg font-semibold mb-2 text-white">Recent Commits</h3>
      <AnimatePresence mode="wait">
        {commits.length > 0 && (
          <motion.div
            key={commits[visibleIndex].sha}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-white"
          >
            <p className="mb-1 line-clamp-2">
              📝 {commits[visibleIndex].commit.message}
            </p>
            <p className="text-xs text-gray-300">
              by {commits[visibleIndex].commit.author.name} —{" "}
              {new Date(commits[visibleIndex].commit.author.date).toLocaleString()}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContributionChart;
