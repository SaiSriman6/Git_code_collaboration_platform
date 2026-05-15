import { useEffect, useState } from "react";
import { fetchRepositories } from "../api/repoApi";
import RepoCard from "../components/RepoCard";
import { useNavigate } from "react-router";
import { useAuth } from '../store/useAuth'

function Dashboard() {
  let currentUser = useAuth(state => state.currentUser);

  const [repos, setRepos] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchRepositories(currentUser._id).then((res) => {
        setRepos(res);
      });
    }
  }, [currentUser]);

  const toNewRepo = () => {
    navigate('/add-repo')
  }

  const toRepo = (repoObj) => {
    navigate('/repo', { state: { repo: repoObj } })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        
        <h1 className="text-3xl font-bold text-gray-800">
          Repositories
        </h1>

        <button
          onClick={toNewRepo}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          + New Repository
        </button>

      </div>

      <div className="max-w-6xl mx-auto">

        {repos.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-500">
            No repositories yet. Create your first one 🚀
          </div>
        ) : (
          <div className="grid gap-4">
            {repos.map((repo) => (
              <RepoCard
                key={repo._id}
                repo={repo}
                toRepo={toRepo}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;