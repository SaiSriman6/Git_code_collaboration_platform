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
          `http://localhost:2929/api/comments/issue/${issueId}`,
          { withCredentials: true }
        );

      } else if (pullRequestId) {

        res = await axios.get(
          `http://localhost:2929/api/comments/pr/${pullRequestId}`,
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
        "http://localhost:2929/api/comments",
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
        `http://localhost:2929/api/comments/${editingId}`,
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
        `http://localhost:2929/api/comments/${id}`,
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

    <div className="mt-8">

      <h2 className="text-lg font-semibold mb-3">
        Comments
      </h2>


      {comments.length === 0 && (
        <p className="text-gray-500">No comments yet</p>
      )}


      {comments.map(comment => (

        <div
          key={comment._id}
          className="bg-gray-100 p-3 rounded mb-2"
        >

          <p className="font-medium">
            {comment.user? comment.user.username:"Deleted User"}
          </p>


          <p>{comment.text}</p>


          {currentUser?._id === comment.user?._id && (

            <div className="flex gap-3 mt-1">

              <button
                onClick={() => startEditing(comment)}
                className="text-blue-600 text-sm"
              >
                Edit
              </button>


              <button
                onClick={() => deleteComment(comment._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>

            </div>

          )}

        </div>

      ))}


      <form
        onSubmit={
          editingId
            ? handleSubmit(updateComment)
            : handleSubmit(addComment)
        }
        className="mt-4"
      >

        <textarea
          placeholder="Add comment..."
          className="border p-2 w-full rounded"
          {...register("text")}
          required
        />


        <button
          className={`text-white px-4 py-2 rounded mt-2 ${
            editingId
              ? "bg-yellow-600"
              : "bg-blue-600"
          }`}
        >
          {editingId ? "Update Comment" : "Add Comment"}
        </button>

      </form>

    </div>

  );

}

export default CommentSection;