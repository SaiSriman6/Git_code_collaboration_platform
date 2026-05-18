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
        setPr(res.data);
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
      setPr(res.data);
      toast.success("Pull Request merged");
    } catch {
      toast.error("Merge failed");
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold">
          {pr.title}
        </h1>
        <p className="text-gray-600 mt-2">
          {pr.description || "No description provided"}
        </p>
        <div className="mt-4 text-sm text-gray-500 space-y-1">
          <p>
            Author:
            <span className="ml-2 font-medium">
              {pr.author?.username}
            </span>
          </p>
          <p>
            Source Branch:
            <span className="ml-2">
              {pr.sourceBranch}
            </span>
          </p>
          <p>
            Target Branch:
            <span className="ml-2">
              {pr.targetBranch}
            </span>
          </p>
          <p>
            Status:
            <span className="ml-2 font-semibold">
              {pr.status}
            </span>
          </p>
        </div>
        {canModify && (
          <div className="flex gap-3 mt-6 flex-wrap">
            {isRepoOwner && pr.status === "open" && (
              <button
                onClick={mergePR}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Merge
              </button>
            )}
            {pr.status === "open" && (
              <button
                onClick={closePR}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Close
              </button>
            )}
            {pr.status === "closed" && (
              <button
                onClick={reopenPR}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Reopen
              </button>
            )}
            <button
              onClick={deletePR}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
                onClick={() =>
                navigate(`/update-pr`, {
                state: { repo, pr }
               })
               } 
               className="bg-indigo-600 text-white px-4 py-2 rounded"
               >
               Edit PR
            </button> 
          </div>
        )}
      <CommentSection pullRequestId={pr._id} />
      </div>
    </div>
  );
}
export default PRDetails;