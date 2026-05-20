import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import CommentSection from "./CommentSection";

function IssueDetails() {

  const { state } = useLocation();

  const { id } = useParams();

  const repo = state?.repo;

  const issue = state?.issue;

  const currentUser = useAuth(
    state => state.currentUser
  );

  const navigate = useNavigate();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: issue?.title,
      description: issue?.description
    }
  });

  // OWNER
  const isRepoOwner =
    currentUser._id === repo?.owner?._id;

  // ISSUE CREATOR
  const isIssueAuthor =
    currentUser._id === issue?.author?._id;

  // COLLABORATOR
  const isCollaborator =
    repo?.collaborators?.some(
      c => c.user?._id === currentUser._id
    );

  // PERMISSIONS

  // only issue creator can edit
  const canEditIssue =
    isIssueAuthor;

  // owner OR issue creator can delete
  const canDeleteIssue =
    isRepoOwner || isIssueAuthor;

  // owner OR collaborator can close/reopen
  const canManageIssueStatus =
    isRepoOwner || isCollaborator;
    
  const updateIssue = async (data) => {

    try {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/issues/${id}`,
        data,
        { withCredentials: true }
      );

      toast.success("Issue updated");

      navigate(-1);

    } catch {

      toast.error("Failed to update issue");

    }

  };

  const closeIssue = async () => {

    try {

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/issues/close/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success("Issue closed");

      navigate(-1);

    } catch {

      toast.error("Failed to close issue");

    }

  };

  const reopenIssue = async () => {

    try {

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/issues/reopen/${id}`,
        {},
        { withCredentials: true }
      );

      toast.success("Issue reopened");

      navigate(-1);

    } catch {

      toast.error("Failed to reopen issue");

    }

  };

  const deleteIssue = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/issues/${id}`,
        { withCredentials: true }
      );
      toast.success("Issue deleted");
      navigate(-1);
    } catch {
      toast.error("Failed to delete issue");
    }
  };

 return (

  <div className="min-h-screen bg-[#f4f7fb] py-10 px-6">

    <div className="max-w-4xl mx-auto space-y-6">

      {/* ISSUE DETAILS */}
      <form
        onSubmit={handleSubmit(updateIssue)}
        className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden"
      >

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100">

          <div className="flex items-center justify-between flex-wrap gap-4">

            <div>

              <h2 className="text-3xl font-bold text-gray-800">
                Issue Details
              </h2>

              <p className="text-gray-500 mt-1">
                View and manage issue information
              </p>

            </div>

            {/* Status */}
            <span
              className={`
                px-4
                py-2
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

        {/* Content */}
        <div className="p-8">

          {/* Title */}
          <div className="mb-6">

            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Issue Title
            </label>

            <input
              className={`
                w-full
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                text-gray-800
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                focus:border-blue-500
                transition-all
                ${
                  !canEditIssue
                    ? "bg-gray-50 cursor-not-allowed"
                    : ""
                }
              `}
              {...register("title")}
              readOnly={!canEditIssue}
            />

          </div>

          {/* Description */}
          <div className="mb-8">

            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Description
            </label>

            <textarea
              rows={7}
              className={`
                w-full
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                text-gray-800
                resize-none
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                focus:border-blue-500
                transition-all
                ${
                  !canEditIssue
                    ? "bg-gray-50 cursor-not-allowed"
                    : ""
                }
              `}
              {...register("description")}
              readOnly={!canEditIssue}
            />

          </div>

          {/* Buttons */}
          {(canEditIssue ||
            canDeleteIssue ||
            canManageIssueStatus) && (

            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">

              {/* UPDATE */}
              {canEditIssue && (

                <button
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-medium
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                  "
                >
                  Update Issue
                </button>

              )}

              {/* CLOSE */}
              {canManageIssueStatus &&
                issue.status === "open" && (

                <button
                  type="button"
                  onClick={closeIssue}
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-medium
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                  "
                >
                  Close Issue
                </button>

              )}

              {/* REOPEN */}
              {canManageIssueStatus &&
                issue.status === "closed" && (

                <button
                  type="button"
                  onClick={reopenIssue}
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-medium
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                  "
                >
                  Reopen Issue
                </button>

              )}

              {/* DELETE */}
              {canDeleteIssue && (

                <button
                  type="button"
                  onClick={deleteIssue}
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-6
                    py-3
                    rounded-2xl
                    font-medium
                    shadow-sm
                    hover:shadow-md
                    transition-all
                    duration-200
                  "
                >
                  Delete Issue
                </button>
              )}
            </div>
          )}
        </div>
      </form>
      {/* COMMENTS */}
      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-8">
        <CommentSection issueId={issue._id} />
      </div>
    </div>
  </div>
);
}
export default IssueDetails;