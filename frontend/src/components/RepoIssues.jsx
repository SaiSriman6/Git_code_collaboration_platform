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
  if (loading) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="bg-white px-8 py-5 rounded-2xl shadow-lg">
        <p className="text-2xl font-bold text-green-600 animate-pulse">
          Loading Issues...
        </p>
      </div>
    </div>
  );
}

return (

  <div className="min-h-screen bg-[#f4f7fb] p-6">

    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

        <div>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Repository Issues
          </h1>

          <p className="text-gray-500 mt-2 text-lg">
            Track bugs and manage repository discussions for
            <span className="font-bold ml-2 text-green-600">
              {repo?.name}
            </span>
          </p>

        </div>

        <button
          onClick={() =>
            navigate("/create-issue", {
              state: { repo }
            })
          }
          className="
            bg-green-600 hover:bg-green-700
            text-white px-6 py-3
            rounded-2xl font-bold
            shadow-md transition duration-200
          "
        >
          Create Issue
        </button>

      </div>

      {/* Issues */}
      {issues.length === 0 ? (

        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-12 text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            No Issues Yet
          </h2>

          <p className="text-gray-500 mt-3">
            Create the first issue for this repository.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {issues.map(issue => (

            <div
              key={issue._id}
              onClick={() =>
                navigate(`/issue/${issue._id}`, {
                  state: { repo, issue }
                })
              }
              className="
                bg-white rounded-3xl
                shadow-md hover:shadow-xl
                border border-gray-100
                p-6 cursor-pointer
                transition duration-200
              "
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                <div>

                  <h2 className="text-2xl font-bold text-gray-800">
                    {issue.title}
                  </h2>

                  <p className="text-gray-500 mt-3">
                    Author:
                    <span className="font-semibold ml-2">
                      {issue.author
                        ? issue.author.username
                        : "Deleted User"}
                    </span>
                  </p>

                </div>

                <span
                  className={`
                    px-5 py-2 rounded-full
                    text-sm font-bold w-fit
                    ${
                      issue.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }
                  `}
                >
                  {issue.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  </div>

);
}
export default RepoIssues;