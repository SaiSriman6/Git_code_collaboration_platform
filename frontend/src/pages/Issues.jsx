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
          `${import.meta.env.VITE_API_URL}/api/issues/incoming/${currentUser._id}`,
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
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
        <div className="bg-white px-8 py-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-xl font-semibold text-blue-600 animate-pulse">
            Loading issues...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            px-8
            py-6
            mb-6
          "
        >
          <h1 className="text-3xl font-extrabold text-gray-800">
            Incoming Issues
          </h1>

          <p className="text-gray-500 mt-2">
            Track and manage issues reported across repositories.
          </p>
        </div>

        {/* Empty State */}
        {issues.length === 0 ? (
          <div
            className="
              bg-white
              border
              border-dashed
              border-gray-300
              rounded-3xl
              shadow-sm
              p-12
              text-center
            "
          >

            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              No issues found
            </h2>

            <p className="text-gray-500">
              You're all caught up for now.
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {issues.map(issue => (

              <div
                key={issue._id}
                onClick={() =>
                  navigate(`/issue/${issue._id}`, {
                    state: {
                      repo: issue.repository,
                      issue
                    }
                  })
                }
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-3xl
                  p-6
                  shadow-sm
                  cursor-pointer
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
              >

                {/* Top Section */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      {issue.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-3">

                      <span
                        className="
                          bg-blue-50
                          text-blue-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                        "
                      >
                        Repo: {issue.repository?.name}
                      </span>

                      <span
                        className="
                          bg-gray-100
                          text-gray-700
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          font-medium
                        "
                      >
                        Author: {issue.author?.username}
                      </span>

                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`
                        px-4
                        py-1.5
                        rounded-full
                        text-sm
                        font-semibold
                        ${
                          issue.status === "open"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {issue.status}
                    </span>
                  </div>

                </div>

                {/* Bottom */}
                <div className="mt-6 flex justify-end">
                  <button
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-5
                      py-2
                      rounded-xl
                      font-medium
                      shadow-sm
                      transition-all
                      duration-200
                    "
                  >
                    View Issue
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

export default IncomingIssues;