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
  if (loading)
    return <p className="text-center mt-10">Loading commits...</p>;
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-5">
          Commit History
        </h1>
        {!commits.length ? (
  <div className="bg-white rounded-xl shadow p-8 text-center">
    <p className="text-gray-500 text-lg">
      No commits yet
    </p>
  </div>
  ) : ( 
  commits.map(commit => (
    <div
      key={commit._id}
      onClick={() =>
        navigate(`/commit/${commit._id}`)
      }
      className="bg-white p-4 mb-3 rounded shadow cursor-pointer hover:shadow-lg"
    >
      <p className="font-medium">
        {commit.message}
      </p>
      <p className="text-sm text-gray-500">
        Author: {
          commit.author
            ? commit.author.username
            : "Deleted User"
        }
      </p>
    </div>
  ))
)}
      </div>
    </div>
  );
}
export default CommitHistory;