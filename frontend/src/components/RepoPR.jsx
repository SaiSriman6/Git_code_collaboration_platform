import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";
function RepoPR() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pr, setPr] = useState([]);
  useEffect(() => {
    async function getPR() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/pull-requests/repo/${state?.repo?._id}`,
          { withCredentials: true }
        );
        setPr(res.data); 
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getPR();
  }, [state?.repo?._id]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading Pull Requests...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Pull Requests
        </h1>
        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}
        {pr.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-gray-500 text-center">
            No Pull Requests yet 🚀
          </div>
        ) : (
          pr.map((pullreq) => (
            <div
              key={pullreq._id}
              onClick={() =>
                navigate(`/pull-request/${pullreq._id}`, {
                  state: { repo: state.repo }
                })
              }
              className="bg-white shadow-md rounded-lg p-5 mb-4 hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {pullreq.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {pullreq.description || "No description provided"}
              </p>
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-500">
                  Created by:
                  <span className="font-medium ml-1">
                    {pullreq.author?.username}
                  </span>
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    pullreq.status === "open"
                      ? "bg-green-100 text-green-700"
                      : pullreq.status === "merged"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {pullreq.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RepoPR;