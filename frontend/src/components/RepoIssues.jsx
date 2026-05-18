import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";

function RepoIssues() {
  const { state } = useLocation();
  const repo = state?.repo;
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchIssues() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/issues/repo/${repo._id}`,
          { withCredentials:true }
        );
        setIssues(res.data);
      } catch {
        toast.error("Failed to load issues");
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, [repo._id]);
  if (loading)
    return <p className="text-center mt-10">Loading issues...</p>;
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">
            Issues
          </h1>
          <button
            onClick={() =>
              navigate("/create-issue", {
                state:{ repo }
              })
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Issue
          </button>
        </div>
        {issues.length === 0
          ? <p>No issues yet</p>
          : issues.map(issue => (
            <div
              key={issue._id}
              onClick={() =>
                navigate(`/issue/${issue._id}`, {
                  state:{ repo, issue }
                })
              }
              className="bg-white shadow-md rounded-lg p-4 mb-3 cursor-pointer"
            >
              <h2 className="font-semibold">
                {issue.title}
              </h2>
              <p className="text-sm text-gray-500">
                Author: {issue.author? issue.author.username:"Deleted User"}
              </p>
              <p className="text-sm">
                Status: {issue.status}
              </p>
            </div>
          ))
        }
      </div>
    </div>
  );
}
export default RepoIssues;