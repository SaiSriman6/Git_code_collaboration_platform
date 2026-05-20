import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

function CommitHistory() {

  const { state } = useLocation();

  const repo = state?.repo;

  const navigate = useNavigate();

  const [commits, setCommits] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    async function fetchCommits() {

      try {

        setLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/commits/repo/${repo._id}`,
          { withCredentials: true }
        );

        setCommits(res.data);

      } finally {

        setLoading(false);

      }

    }

    fetchCommits();

  }, []);

  // Loading
  if (loading) {

    return (

      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">

        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-8 py-6">

          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Loading commits...
          </p>

        </div>

      </div>

    );

  }
  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm px-8 py-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Commit History
          </h1>
          <p className="text-gray-500 mt-2">
            View all commits made to this repository
          </p>
        </div>

        {/* Empty State */}
        {!commits.length ? (
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No commits yet
            </h2>
            <p className="text-gray-500 mt-2">
              Commit history will appear here once changes are pushed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {commits.map(commit => (
              <div
                key={commit._id}
                onClick={() =>
                  navigate(`/commit/${commit._id}`)
                }
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-2xl
                  shadow-sm
                  p-5
                  cursor-pointer
                  hover:shadow-md
                  hover:border-blue-200
                  transition-all
                  duration-200
                "
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {commit.message}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2">
                      Author:
                      <span className="font-medium text-gray-700 ml-1">
                        {
                          commit.author
                            ? commit.author.username
                            : "Deleted User"
                        }
                      </span>
                    </p>
                  </div>
                  {/* Right */}
                  <button
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-4
                      py-2
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                    "
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default CommitHistory;