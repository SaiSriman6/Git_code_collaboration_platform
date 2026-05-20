import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

function MyPullRequests() {
  const currentUser = useAuth(state => state.currentUser);
  const navigate = useNavigate();
  const [prs, setPrs] = useState([]);

  useEffect(() => {
    async function fetchPRs() {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/pull-requests/author/${currentUser._id}`,
        { withCredentials: true }
      );

      setPrs(res.data);
    }

    fetchPRs();
  }, []);

  return (
    <div className="space-y-5">

      <div className="bg-white rounded-3xl shadow-md p-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          My Pull Requests
        </h1>

        <p className="text-gray-500 mt-2">
          Manage and track all your pull requests.
        </p>
      </div>

      {prs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
          No Pull Requests created by you
        </div>
      ) : (
        prs.map(pr => (
          <div
            key={pr._id}
            onClick={() =>
              navigate(`/pull-request/${pr._id}`, {
                state: { repo: pr.repository }
              })
            }
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 cursor-pointer border border-gray-100"
          >
            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-2xl font-bold text-blue-600">
                  {pr.title}
                </h2>

                <p className="text-gray-500 mt-2">
                  Repository: {pr?.repository?.name}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  pr.status === "open"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {pr.status}
              </span>

            </div>
          </div>
        ))
      )}

    </div>
  );
}

export default MyPullRequests;