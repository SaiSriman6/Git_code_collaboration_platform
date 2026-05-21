import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import CommentSection from "./CommentSection";


function PRDetails() {
  const { id } = useParams();
  const { state } = useLocation();
  const repo = state?.repo;
  const currentUser = useAuth((state) => state.currentUser);
  const navigate = useNavigate();
  const [pr, setPr] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchPR() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/pull-requests/${id}`,
          { withCredentials: true }
        );
        setPr(res.data.pr);
      } catch {
        toast.error("Failed to load PR");
      } finally {
        setLoading(false);
      }
    }
    fetchPR();
  }, [id]);
  const closePR = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pull-requests/close/${id}`,
        {},
        { withCredentials: true }
      );
      setPr(res.data);
      toast.success("Pull Request closed");
      navigate(-1)
    } catch {
      toast.error("Close failed");
    }
  };
  const reopenPR = async () => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/pull-requests/reopen/${id}`,
        {},
        { withCredentials: true }
      );
      setPr(res.data);
      toast.success("Pull Request reopened");
      navigate(-1);
    } catch {
      toast.error("Reopen failed");
    }
  };
  const mergePR = async () => {
  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/pull-requests/merge/${id}`,
      {},
      { withCredentials: true }
    );
    setPr(res.data.pr);
    toast.success("Pull Request merged");
    navigate(-1);
  } catch (err) {
    toast.error(
      err?.response?.data?.message ||
      "Merge failed"
    );
  }
};
  const deletePR = async () => {
    try {
      await axios.delete(
         `${import.meta.env.VITE_API_URL}/api/pull-requests/${id}`,
        { withCredentials: true }
      );
      toast.success("Pull Request deleted");
      navigate(-1);
    } catch {
      toast.error("Delete failed");
    }
  };
  if (loading || !pr) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading PR details...
      </div>
    );
  }
  const isRepoOwner =
    currentUser?._id === repo?.owner?._id;
  const isPRAuthor =
    currentUser?._id === pr.author?._id;
  const canModify =
    isRepoOwner || isPRAuthor;
  return (
  <div className="min-h-screen bg-[#f4f7fb] p-6">

    <div className="max-w-5xl mx-auto">

      {/* Loading */}
      {loading || !pr ? (
        <div className="flex justify-center items-center py-20">

          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              shadow-sm
              px-10
              py-8
            "
          >
            <p className="text-2xl font-bold text-blue-600 animate-pulse">
              Loading PR details...
            </p>
          </div>

        </div>
      ) : (
        <>
          {/* PR Header */}
          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              shadow-sm
              p-8
              mb-6
            "
          >

            <div className="flex items-start justify-between gap-6">

              {/* Left */}
              <div className="flex-1">

                <div className="flex items-center gap-4">

                  {/* Icon */}
                  <div
                    className="
                      w-14
                      h-14
                      rounded-2xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                      text-blue-600
                      text-2xl
                    "
                  >
                    🔀
                  </div>

                  <div>

                    <h1
                      className="
                        text-4xl
                        font-extrabold
                        text-gray-800
                      "
                    >
                      {pr.title}
                    </h1>

                    <p className="text-gray-500 mt-1">
                      Pull Request Details
                    </p>

                  </div>

                </div>

                {/* Description */}
                <p
                  className="
                    text-gray-600
                    mt-6
                    leading-relaxed
                    text-lg
                  "
                >
                  {pr.description ||
                    "No description provided"}
                </p>

              </div>

              {/* Status */}
              <div>

                <span
                  className={`
                    px-5
                    py-2
                    rounded-full
                    text-sm
                    font-semibold
                    ${
                      pr.status === "open"
                        ? "bg-green-100 text-green-700"
                        : pr.status === "merged"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {pr.status.toUpperCase()}
                </span>

              </div>

            </div>

            {/* Details Grid */}
            <div
              className="
                grid
                md:grid-cols-2
                gap-5
                mt-8
              "
            >

              {/* Author */}
              <div
                className="
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-sm text-gray-500">
                  Author
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {pr.author?.username}
                </p>
              </div>

              {/* Source Branch */}
              <div
                className="
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-sm text-gray-500">
                  Source Branch
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {pr.sourceBranch}
                </p>
              </div>

              {/* Target Branch */}
              <div
                className="
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-sm text-gray-500">
                  Target Branch
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1">
                  {pr.targetBranch}
                </p>
              </div>

              {/* Status */}
              <div
                className="
                  bg-gray-50
                  border
                  border-gray-200
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-sm text-gray-500">
                  Current Status
                </p>

                <p className="text-lg font-semibold text-gray-800 mt-1 capitalize">
                  {pr.status}
                </p>
              </div>

            </div>

            {/* Action Buttons */}
            {canModify && (
              <div
                className="
                  flex
                  flex-wrap
                  gap-4
                  mt-8
                  pt-6
                  border-t
                  border-gray-100
                "
              >

                {isRepoOwner && pr.status === "open" && (
                  <button
                    onClick={mergePR}
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      font-medium
                      shadow-sm
                      transition-all
                    "
                  >
                    Merge PR
                  </button>
                )}

                {pr.status === "open" && (
                  <button
                    onClick={closePR}
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      font-medium
                      shadow-sm
                      transition-all
                    "
                  >
                    Close PR
                  </button>
                )}

                {pr.status === "closed" && (
                  <button
                    onClick={reopenPR}
                    className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-6
                      py-3
                      rounded-2xl
                      font-medium
                      shadow-sm
                      transition-all
                    "
                  >
                    Reopen PR
                  </button>
                )}

                <button
                  onClick={deletePR}
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-medium
                    shadow-sm
                    transition-all
                  "
                >
                  Delete PR
                </button>

                <button
                  onClick={() =>
                    navigate(`/update-pr`, {
                      state: { repo, pr }
                    })
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-medium
                    shadow-sm
                    transition-all
                  "
                >
                  Edit PR
                </button>

              </div>
            )}
          </div>

          {/* Comments */}
          <div
            className="
              bg-white
              border
              border-gray-200
              rounded-3xl
              shadow-sm
              p-8
            "
          >

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Discussion
            </h2>

            <CommentSection pullRequestId={pr._id} />

          </div>
        </>
      )}

    </div>
  </div>
)
}
export default PRDetails;