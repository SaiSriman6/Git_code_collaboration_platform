import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";

function CommentSection({ issueId, pullRequestId }) {

  const { register, handleSubmit, reset, setValue } = useForm();

  const currentUser = useAuth(state => state.currentUser);

  const [comments, setComments] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const fetchComments = async () => {

    try {

      let res;

      if (issueId) {

        res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/comments/issue/${issueId}`,
          { withCredentials: true }
        );

      } else if (pullRequestId) {

        res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/comments/pr/${pullRequestId}`,
          { withCredentials: true }
        );

      }

      if (res) {
        setComments(res.data);
      }

    } catch {

      toast.error("Failed to load comments");

    }

  };


  useEffect(() => {

    fetchComments();

  }, [issueId, pullRequestId]);


  const addComment = async (data) => {

    try {

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/comments`,
        {
          text: data.text,
          issue: issueId || null,
          pullRequest: pullRequestId || null
        },
        { withCredentials: true }
      );

      toast.success("Comment added");

      reset();

      fetchComments();

    } catch {

      toast.error("Comment failed");

    }

  };


  const updateComment = async (data) => {

    try {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/comments/${editingId}`,
        { text: data.text },
        { withCredentials: true }
      );

      toast.success("Comment updated");

      setEditingId(null);

      reset();

      fetchComments();

    } catch {

      toast.error("Update failed");

    }

  };

  const deleteComment = async (id) => {

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/comments/${id}`,
        { withCredentials: true }
      );

      toast.success("Comment deleted");

      fetchComments();

    } catch {

      toast.error("Delete failed");

    }

  };


  const startEditing = (comment) => {

    setEditingId(comment._id);

    setValue("text", comment.text);

  };


  return (

  <div className="mt-10 bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

    {/* Header */}
    <div className="flex items-center justify-between mb-8">

      <div>

        <h2 className="text-3xl font-bold text-gray-800">
          Comments
        </h2>

        <p className="text-gray-500 mt-1">
          Discuss and collaborate with contributors
        </p>

      </div>

      <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold">
        {comments.length} Comments
      </div>

    </div>

    {/* Empty State */}
    {/* Empty State */}
{comments.length === 0 && (

  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">

    <h3 className="text-lg font-semibold text-gray-700">
      No comments yet
    </h3>

    <p className="text-gray-500 mt-1">
      Be the first to start the discussion.
    </p>

  </div>

)}

    {/* Comments List */}
    <div className="space-y-5">

      {comments.map(comment => (

        <div
          key={comment._id}
          className="bg-gray-50 border border-gray-200 rounded-3xl p-6 hover:shadow-md transition-all duration-300"
        >

          {/* Top */}
          <div className="flex items-start justify-between gap-4">

            <div className="flex items-center gap-4">

              {/* Avatar */}
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                {(comment.user?.username || "D")[0].toUpperCase()}
              </div>

              <div>

                <h3 className="font-bold text-gray-800 text-lg">
                  {comment.user
                    ? comment.user.username
                    : "Deleted User"}
                </h3>

                <p className="text-sm text-gray-500">
                  Contributor
                </p>

              </div>

            </div>

            {/* Actions */}
            {currentUser?._id === comment.user?._id && (

              <div className="flex gap-3">

                <button
                  onClick={() => startEditing(comment)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteComment(comment._id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                >
                  Delete
                </button>

              </div>

            )}

          </div>

          {/* Comment Text */}
          <div className="mt-5">

            <p className="text-gray-700 leading-relaxed text-[15px]">
              {comment.text}
            </p>

          </div>

        </div>

      ))}

    </div>

    {/* Form */}
    <form
      onSubmit={
        editingId
          ? handleSubmit(updateComment)
          : handleSubmit(addComment)
      }
      className="mt-8"
    >

      <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6">

        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {editingId
            ? "Update your comment"
            : "Add a new comment"}
        </label>

        <textarea
          placeholder="Write your comment here..."
          className="w-full border border-gray-300 rounded-2xl px-5 py-4 text-gray-800 resize-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
          rows={5}
          {...register("text")}
          required
        />

        {/* Buttons */}
        <div className="flex items-center gap-4 mt-5">

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            {editingId
              ? "Update Comment"
              : "Add Comment"}
          </button>

          {editingId && (

            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                reset();
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  </div>
);
}
export default CommentSection;