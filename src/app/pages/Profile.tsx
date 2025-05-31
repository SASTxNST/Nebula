'use client'
import React, { useEffect, useState } from 'react';

interface Repo {
  owner: string;
  name: string;
}

interface ProfileProps {
  repositories: Repo[];
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  githubId?: string;
  createdAt: string;
  updatedAt: string;
}

interface CommitDetail {
  repoName: string;
  message: string;
  date: string;
  sha: string;
  url: string;
}

interface MergeDetail {
  repoName: string;
  title: string;
  date: string;
  url: string;
}

const Profile: React.FC<ProfileProps> = ({ repositories }) => {
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserData | null>(null);
    const [commitDetails, setCommitDetails] = useState<CommitDetail[]>([]);
    const [mergeDetails, setMergeDetails] = useState<MergeDetail[]>([]);
    const [loadingGithubActivity, setLoadingGithubActivity] = useState<boolean>(false);
    const [githubAvatarUrl, setGithubAvatarUrl] = useState<string | null>(null); 

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (!email) {
            setError('User email not found in local storage.');
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await fetch('/api/getuser', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    setError(errorData.message || 'Failed to fetch user data.');
                    setUser(null);
                    return;
                }

                const userDetails: UserData = await res.json();
                setUser(userDetails);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError('An unexpected error occurred while fetching user data.');
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchGithubActivity = async () => {
            if (!user?.githubId) {
                setCommitDetails([]);
                setMergeDetails([]);
                setGithubAvatarUrl(null); 
                return;
            }

            setLoadingGithubActivity(true);
            const fetchedCommits: CommitDetail[] = [];
            const fetchedMerges: MergeDetail[] = [];

            try {
                const userRes = await fetch(`https://api.github.com/users/${user.githubId}`);
                const userData = await userRes.json();
                if (userRes.ok && userData.avatar_url) {
                    setGithubAvatarUrl(userData.avatar_url);
                } else {
                    setGithubAvatarUrl(null);
                }

                const eventsRes = await fetch(`https://api.github.com/users/${user.githubId}/events/public`);
                const eventsData = await eventsRes.json();

                if (Array.isArray(eventsData)) {
                    eventsData.forEach((event: any) => {
                        if (event.type === 'PushEvent' && event.payload.commits && event.repo) {
                            event.payload.commits.forEach((commit: any) => {
                                fetchedCommits.push({
                                    repoName: event.repo.name,
                                    message: commit.message,
                                    date: new Date(commit.timestamp).toLocaleString(),
                                    sha: commit.sha,
                                    url: `https://github.com/${event.repo.name}/commit/${commit.sha}`
                                });
                            });
                        } else if (event.type === 'PullRequestEvent' && event.payload.pull_request?.merged && event.repo) {
                            fetchedMerges.push({
                                repoName: event.repo.name,
                                title: event.payload.pull_request.title,
                                date: new Date(event.payload.pull_request.merged_at).toLocaleString(),
                                url: event.payload.pull_request.html_url
                            });
                        }
                    });
                }
            } catch (err) {
                console.error(`Error fetching GitHub activity for ${user.githubId}:`, err);
                setError('Failed to fetch GitHub activity.');
                setGithubAvatarUrl(null); 
            }

            setCommitDetails(fetchedCommits);
            setMergeDetails(fetchedMerges);
            setLoadingGithubActivity(false);
        };

        if (user) {
            fetchGithubActivity();
        }
    }, [user]);

  return (
    <div className="min-h-screen p-4 bg-[#0C0C0C] text-[#B0B0B0] rounded-xl shadow-lg">
      <h2 className="mb-6 text-3xl font-bold text-[#00B2FF] text-center">User Profile</h2>
      {error && <p className="mb-4 text-center text-red-500">{error}</p>}

      {user ? (
        <div className="bg-[#111111] border border-[#2D2D2D] p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-[#00B2FF] mb-4">Profile Details</h3>
          <div className="flex items-center mb-4"> {/* Flex container for avatar and details */}
            {githubAvatarUrl && (
              <img
                src={githubAvatarUrl}
                alt={`${user.username}'s GitHub Avatar`}
                className="w-24 h-24 rounded-full mr-4 border-2 border-[#00B2FF]"
              />
            )}
            <div>
              <p className="mb-2 text-lg"><strong>Username:</strong> {user.username}</p>
              <p className="mb-2 text-lg"><strong>Email:</strong> {user.email}</p>
              {user.githubId && <p className="mb-2 text-lg"><strong>GitHub ID:</strong> {user.githubId}</p>}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Account created: {new Date(user.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p className="text-center text-gray-400">Loading user data or user not found...</p>
      )}

      <div className="bg-[#111111] border border-[#2D2D2D] p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-semibold text-[#00B2FF] mb-4">Managed Repositories</h3>
        {repositories.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {repositories.map((repo, index) => (
              <li key={index} className="p-3 border border-gray-700 rounded-md shadow-lg bg-white/5 backdrop-blur-lg">
                <span className="font-medium text-white">{repo.owner}/</span>
                <span className="font-medium text-[#00B2FF]">{repo.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No repositories managed.</p>
        )}
      </div>

      {user?.githubId && (
        <div className="bg-[#111111] border border-[#2D2D2D] p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-[#00B2FF] mb-4">GitHub Activity</h3>
          {loadingGithubActivity ? (
            <p className="text-gray-400">Loading GitHub activity...</p>
          ) : (
            <>
              {commitDetails.length > 0 && (
                <div className="mb-6">
                  <h4 className="mb-3 text-xl font-semibold text-white">Commits:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {commitDetails.map((commit, index) => (
                      <div key={index} className="p-4 border border-gray-700 rounded-lg shadow-sm bg-white/5 backdrop-blur-lg">
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-medium text-[#00B2FF]">{commit.repoName}</span>
                        </p>
                        <p className="mb-2 text-base font-medium text-white">"{commit.message}"</p>
                        <p className="text-xs text-gray-500">
                          Committed on <span className="font-semibold">{commit.date}</span>
                        </p>
                        <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-[#00B2FF] hover:underline text-sm mt-2 block">
                          View Commit
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mergeDetails.length > 0 && (
                <div>
                  <h4 className="mb-3 text-xl font-semibold text-white">Merged Pull Requests:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {mergeDetails.map((merge, index) => (
                      <div key={index} className="bg-[#1A1A3A] p-4 rounded-lg shadow-sm border border-gray-700">
                        <p className="mb-1 text-sm text-gray-400">
                          <span className="font-medium text-[#00B2FF]">{merge.repoName}</span>
                        </p>
                        <p className="mb-2 text-base font-medium text-white">"{merge.title}"</p>
                        <p className="text-xs text-gray-500">
                          Merged on <span className="font-semibold">{merge.date}</span>
                        </p>
                        <a href={merge.url} target="_blank" rel="noopener noreferrer" className="text-[#00B2FF] hover:underline text-sm mt-2 block">
                          View Pull Request
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {commitDetails.length === 0 && mergeDetails.length === 0 && (
                <p className="text-gray-400">No public GitHub activity found for this user.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;