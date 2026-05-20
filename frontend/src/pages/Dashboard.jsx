import { useEffect, useState } from "react";
import RepoCard from "../components/RepoCard";
import { useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import axios from "axios";

function Dashboard() {
  let currentUser = useAuth((state) => state.currentUser);

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    async function fetchRepos() {
      if (currentUser) {
        try {
          setLoading(true);

          let res = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/repos/${currentUser._id}`,
            { withCredentials: true }
          );

          if (res.status === 200) {
            setRepos(res.data);
          }
        } catch (err) {
          seterror(err.message);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchRepos();
  }, [currentUser]);

  const toNewRepo = () => {
    navigate("/add-repo");
  };

  const toRepo = (repoObj) => {
    navigate("/repo", { state: { repo: repoObj } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex justify-center items-center">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-xl border border-gray-200">
          <p className="text-2xl font-semibold text-blue-600 animate-pulse">
            Loading Repositories...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex justify-center items-center">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-xl border border-red-200">
          <p className="text-xl font-semibold text-red-600">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg px-8 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          
          <div>
            <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
              Public Repositories
            </h1>

            <p className="text-gray-500 mt-2 text-sm md:text-base">
              Manage and explore all your repositories in one place.
            </p>
          </div>

          <button
            onClick={toNewRepo}
            className=" bg-gradient-to-r
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
              hover:scale-105"
          >
            + New Repository
          </button>
        </div>
      </div>

      {/* Repository Section */}
<div className="max-w-7xl mx-auto px-6 pb-10">

  {/* Empty State */}
  {repos.length === 0 ? (
    <div className="bg-[#161b22] border border-dashed border-[#30363d] rounded-3xl shadow-xl p-16 text-center">
      
      <div className="text-7xl mb-5">📂</div>

      <h2 className="text-3xl font-bold text-white mb-3">
        No repositories found
      </h2>

      <p className="text-gray-400 mb-8">
        Create your first repository and start building your next big idea.
      </p>

      <button
        onClick={toNewRepo}
        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-7 py-3 rounded-xl font-semibold shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
      >
        Create Repository
      </button>
    </div>
  ) : (
    <div className="grid gap-5">
      {repos.map((repo) => (
        <div
          key={repo._id}
          className="transition duration-300 hover:-translate-y-1 hover:scale-[1.01]"
        >
          <RepoCard repo={repo} toRepo={toRepo} />
        </div>
      ))}
    </div>
  )}
</div>
    </div>
  );
}

export default Dashboard;