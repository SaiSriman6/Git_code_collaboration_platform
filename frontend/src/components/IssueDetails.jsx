import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import CommentSection from "./CommentSection";

const API = import.meta.env.VITE_API_URL;

const btnClass = `
  bg-blue-600 hover:bg-blue-700 text-white px-6 py-3
  rounded-2xl font-medium shadow-sm hover:shadow-md transition-all duration-200
`;

const fieldClass = (disabled) => `
  w-full border border-gray-300 rounded-2xl px-5 py-4 text-gray-800
  focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all
  ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}
`;

function IssueDetails() {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuth((s) => s.currentUser);

  const { repo, issue } = state ?? {};

  const { register, handleSubmit } = useForm({
    defaultValues: { title: issue?.title, description: issue?.description },
  });

  const isRepoOwner     = currentUser._id === repo?.owner?._id;
  const isIssueAuthor   = currentUser._id === issue?.author?._id;
  const isCollaborator  = repo?.collaborators?.some((c) => c.user?._id === currentUser._id);

  const canEditIssue        = isIssueAuthor;
  const canDeleteIssue      = isRepoOwner || isIssueAuthor;
  const canManageIssueStatus = isRepoOwner || isCollaborator;

  const apiCall = async (method, path, successMsg, errorMsg, data = {}) => {
    try {
      await axios[method](`${API}/api/issues/${path}`, ...(method !== "delete" ? [data] : []), { withCredentials: true });
      toast.success(successMsg);
      navigate(-1);
    } catch {
      toast.error(errorMsg);
    }
  };

  const updateIssue = (data) => apiCall("put",   id,           "Issue updated",  "Failed to update issue", data);
  const closeIssue  = ()     => apiCall("patch", `close/${id}`, "Issue closed",   "Failed to close issue");
  const reopenIssue = ()     => apiCall("patch", `reopen/${id}`,"Issue reopened", "Failed to reopen issue");
  const deleteIssue = ()     => apiCall("delete", id,           "Issue deleted",  "Failed to delete issue");

  const isOpen = issue.status === "open";

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ISSUE DETAILS */}
        <form
          onSubmit={handleSubmit(updateIssue)}
          className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Issue Details</h2>
              <p className="text-gray-500 mt-1">View and manage issue information</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {issue.status}
            </span>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Issue Title</label>
              <input className={fieldClass(!canEditIssue)} {...register("title")} readOnly={!canEditIssue} />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
              <textarea rows={7} className={fieldClass(!canEditIssue)} {...register("description")} readOnly={!canEditIssue} />
            </div>

            {(canEditIssue || canDeleteIssue || canManageIssueStatus) && (
              <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
                {canEditIssue        && <button className={btnClass}>Update Issue</button>}
                {canManageIssueStatus && isOpen  && <button type="button" onClick={closeIssue}  className={btnClass}>Close Issue</button>}
                {canManageIssueStatus && !isOpen && <button type="button" onClick={reopenIssue} className={btnClass}>Reopen Issue</button>}
                {canDeleteIssue      && <button type="button" onClick={deleteIssue} className={btnClass}>Delete Issue</button>}
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