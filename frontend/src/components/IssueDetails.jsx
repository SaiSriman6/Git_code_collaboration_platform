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
    
  const toCreateBranch = () => {
  navigate(
    "/create-branch",
    {
      state: { repo }
    }
  );
};
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

    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ISSUE DETAILS */}
        <form
          onSubmit={handleSubmit(updateIssue)}
          className="bg-white p-8 rounded-xl shadow-md"
        >

          <h2 className="text-2xl font-bold mb-5">
            Issue Details
          </h2>

          {/* TITLE */}
          <input
            className={`border p-3 w-full mb-4 rounded ${
              !canEditIssue
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
            {...register("title")}
            readOnly={!canEditIssue}
          />

          {/* DESCRIPTION */}
          <textarea
            rows={6}
            className={`border p-3 w-full mb-4 rounded ${
              !canEditIssue
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }`}
            {...register("description")}
            readOnly={!canEditIssue}
          />

          {/* ACTION BUTTONS */}
          {(canEditIssue ||
            canDeleteIssue ||
            canManageIssueStatus) && (

            <div className="flex gap-3 flex-wrap">

              {/* UPDATE */}
              {canEditIssue && (

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Update
                </button>

              )}

              {/* CLOSE */}
              {canManageIssueStatus &&
                issue.status === "open" && (

                <button
                  type="button"
                  onClick={closeIssue}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                >
                  Close
                </button>

              )}

              {/* REOPEN */}
              {canManageIssueStatus &&
                issue.status === "closed" && (

                <button type="button" onClick={reopenIssue}  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  Reopen </button>
              )}
              {/* DELETE */}
              {canDeleteIssue && (
                <button type="button" onClick={deleteIssue} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
                  Delete
                </button>
              )}
            </div>
          )}
        </form>
        {/* COMMENTS */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <CommentSection issueId={issue._id} />
        </div>
      </div>
    </div>
  );
}
export default IssueDetails;