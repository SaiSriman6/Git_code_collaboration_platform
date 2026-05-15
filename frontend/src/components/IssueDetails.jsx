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
  const currentUser = useAuth(state => state.currentUser);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues:{
      title:issue?.title,
      description:issue?.description
    }
  });

  const isRepoOwner =
    currentUser._id === repo?.owner?._id;

  const isIssueAuthor =
    currentUser._id === issue?.author?._id;

  const canModify =
    isRepoOwner || isIssueAuthor;

  const updateIssue = async data => {
    await axios.put(
      `http://localhost:2929/api/issues/${id}`,
      data,
      { withCredentials:true }
    );
    toast.success("Issue updated");
    navigate(-1);
  };
  const closeIssue = async () => {
    await axios.patch(
      `http://localhost:2929/api/issues/close/${id}`,
      {},
      { withCredentials:true }
    );
    toast.success("Issue closed");
    navigate(-1);
  };
  const reopenIssue = async () => {
    await axios.patch(
      `http://localhost:2929/api/issues/reopen/${id}`,
      {},
      { withCredentials:true }
    );
    toast.success("Issue reopened");
    navigate(-1);
  };
  const deleteIssue = async () => {
    await axios.delete(
      `http://localhost:2929/api/issues/${id}`,
      { withCredentials:true }
    );
    toast.success("Issue deleted");
    navigate(-1);
  };
  return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-3xl mx-auto space-y-6">
      <form
        onSubmit={handleSubmit(updateIssue)}
        className="bg-white p-8 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-bold mb-5">
          Issue Details
        </h2>

        <input
          className="border p-2 w-full mb-4 rounded"
          {...register("title")}
        />

        <textarea
          className="border p-2 w-full mb-4 rounded"
          {...register("description")}
        />

        {canModify && (
          <div className="flex gap-3 flex-wrap">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Update
            </button>

            {issue.status === "open" && (
              <button
                type="button"
                onClick={closeIssue}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            )}

            {issue.status === "closed" && (
              <button
                type="button"
                onClick={reopenIssue}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Reopen
              </button>
            )}

            <button
              type="button"
              onClick={deleteIssue}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </form>
      <div className="bg-white p-6 rounded-xl shadow-md">
        <CommentSection issueId={issue._id} />
      </div>
    </div>
  </div>
);
}
export default IssueDetails;