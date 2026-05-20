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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">

        <div
          className="
            bg-white
            border
            border-gray-200
            shadow-sm
            rounded-3xl
            px-10
            py-8
          "
        >
          <p className="text-2xl font-bold text-blue-600 animate-pulse">
            Loading Pull Requests...
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

          <h1 className="text-3xl font-bold text-gray-800">
            Pull Requests
          </h1>

          <p className="text-gray-500 mt-2">
            Review and manage all pull requests for this repository.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div
            className="
              bg-red-50
              border
              border-red-200
              text-red-600
              rounded-2xl
              px-5
              py-4
              mb-6
            "
          >
            {error}
          </div>
        )}

        {/* Empty State */}
        {pr.length === 0 ? (
          <div
            className="
              bg-white
              border
              border-dashed
              border-gray-300
              rounded-3xl
              shadow-sm
              p-16
              text-center
            "
          >

          

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Pull Requests Yet
            </h2>

            <p className="text-gray-500">
              Pull requests created for this repository will appear here.
            </p>

          </div>
        ) : (

          <div className="space-y-5">

            {pr.map((pullreq) => (

              <div
                key={pullreq._id}
                onClick={() =>
                  navigate(`/pull-request/${pullreq._id}`, {
                    state: { repo: state.repo }
                  })
                }
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-3xl
                  p-6
                  shadow-sm
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >

                {/* Top */}
                <div className="flex items-start justify-between gap-4">

                  <div className="flex-1">

                    <div className="flex items-center gap-3">

                      {/* PR Icon */}
                      <div
                        className="
                          w-12
                          h-12
                          rounded-2xl
                          bg-blue-50
                          flex
                          items-center
                          justify-center
                          text-blue-600
                          text-xl
                          font-bold
                        "
                      >
                        🔀
                      </div>

                      <div>

                        <h2
                          className="
                            text-2xl
                            font-bold
                            text-gray-800
                            hover:text-blue-600
                            transition
                          "
                        >
                          {pullreq.title}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                          Pull Request
                        </p>

                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className="
                        text-gray-600
                        mt-5
                        leading-relaxed
                      "
                    >
                      {pullreq.description ||
                        "No description provided"}
                    </p>

                  </div>

                  {/* Status */}
                  <div>

                    <span
                      className={`
                        px-4
                        py-2
                        rounded-full
                        text-sm
                        font-semibold
                        ${
                          pullreq.status === "open"
                            ? "bg-green-100 text-green-700"
                            : pullreq.status === "merged"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-red-100 text-red-700"
                        }
                      `}
                    >
                      {pullreq.status}
                    </span>

                  </div>

                </div>

                {/* Bottom */}
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    mt-6
                    pt-5
                    border-t
                    border-gray-100
                  "
                >

                  <div>

                    <p className="text-sm text-gray-500">
                      Created by
                    </p>

                    <p className="font-semibold text-gray-800">
                      {pullreq.author?.username}
                    </p>

                  </div>

                  <button
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-5
                      py-2.5
                      rounded-xl
                      font-medium
                      shadow-sm
                      hover:shadow-md
                      transition-all
                      duration-200
                    "
                  >
                    View Details
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

export default RepoPR;