import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import RepoCard from "../components/RepoCard";
import { useNavigate } from "react-router";
import axios from "axios";

function Repositories() {
  const currentUser = useAuth((state) => state.currentUser);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [repos, setRepos] = useState([]);

  const toRepo = (repoObj) => {
    navigate("/repo", { state: { repo: repoObj } });
  };

  const toNewRepo = () => {
    navigate("/add-repo");
  };

  useEffect(() => {
    async function getRepo() {
      try {
        setLoading(true);

        let res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/repos/repos-owner/${currentUser._id}`,
          {
            withCredentials: true,
          }
        );

        if (res.status === 200) {
          setRepos(res.data.payload);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (currentUser) {
      getRepo();
    }
  }, [currentUser]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex justify-center items-center">
        <div className="bg-white border border-gray-200 px-8 py-6 rounded-2xl shadow-lg">
          <p className="text-2xl font-semibold text-blue-600 animate-pulse">
            Loading Repositories...
          </p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#f6f8fa] flex justify-center items-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Something went wrong
          </h2>

          <p className="text-gray-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fa]">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
              Your Repositories
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Manage all your repositories and collaborate efficiently.
            </p>
          </div>

          <button
            onClick={toNewRepo}
            className="
              bg-gradient-to-r
              from-blue-600
              to-cyan-500
              hover:from-blue-700
              hover:to-cyan-600
              px-6 py-3
              rounded-xl
              font-semibold
              text-white
              shadow-md
              hover:shadow-xl
              transition-all duration-300
              hover:scale-105
            "
          >
            + New Repository
          </button>
        </div>
      </div>

      {/* Repository List */}
      <div className="max-w-7xl mx-auto px-6 pb-10">

        {repos.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-3xl shadow-sm p-16 text-center">

            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              No repositories yet
            </h2>

            <p className="text-gray-500 mb-8">
              Start building your next project by creating a repository.
            </p>

            <button
              onClick={toNewRepo}
              className="
                bg-gradient-to-r
                from-blue-600
                to-cyan-500
                hover:from-blue-700
                hover:to-cyan-600
                px-7 py-3
                rounded-xl
                font-semibold
                text-white
                shadow-md
                hover:shadow-xl
                transition-all duration-300
              "
            >
              Create Repository
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {repos.map((repo) => (
              <div
                key={repo._id}
                className="transition duration-300 hover:-translate-y-1"
              >
                <RepoCard
                  repo={repo}
                  toRepo={toRepo}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Repositories;