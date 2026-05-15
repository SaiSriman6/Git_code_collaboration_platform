import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

function IncomingIssues() {
  const currentUser = useAuth(state => state.currentUser);
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchIssues() {
      try {
        const res = await axios.get(
          `http://localhost:2929/api/issues/incoming/${currentUser._id}`,
          { withCredentials: true }
        );
        setIssues(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, []);
  if (loading) {
    return <p className="p-6">Loading issues...</p>;
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Incoming Issues
        </h1>
        {issues.length === 0 ? (
          <div className="bg-white p-6 rounded shadow text-gray-500">
            No issues found
          </div>
        ) : (
          issues.map(issue => (
            <div
              key={issue._id}
              onClick={() =>
                navigate(`/issue/${issue._id}`, {
                  state: { repo: issue.repository,issue}
                })
              }
              className="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">
                {issue.title}
              </h2>
              <p className="text-sm text-gray-500">
                Repository: {issue.repository?.name}
              </p>
              <p className="text-sm text-gray-500">
                Author: {issue.author?.username}
              </p>
              <p className="text-sm">
                Status: {issue.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
export default IncomingIssues;