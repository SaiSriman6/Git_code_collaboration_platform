import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function CommitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const currentUser = useAuth((state) => state.currentUser);

  const { register, handleSubmit, setValue } = useForm();

  const [commit, setCommit] = useState(null);

  useEffect(() => {
    async function fetchCommit() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/commits/${id}`,
          { withCredentials: true }
        );

        setCommit(res.data);
        setValue("message", res.data.message);
      } catch (error) {
        toast.error(error.message || "Failed to load commit");
      }
    }

    fetchCommit();
  }, [id, setValue]);

  const updateMessage = async (data) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/commits/${id}`,
        { message: data.message },
        { withCredentials: true }
      );

      setCommit(res.data.commit);

      toast.success("Commit updated");
      navigate(-1);
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteCommit = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/commits/${id}`,
        { withCredentials: true }
      );

      toast.success("Commit deleted");
      navigate(-1);
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!commit) return null;

  const isAuthor = currentUser._id === commit.author._id;

 return (
  <div className="min-h-screen bg-gray-100 px-4 py-10">
    <div className="max-w-3xl mx-auto">
      
      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Commit Details
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              View and manage commit message
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="
              px-4 py-2 rounded-lg
              border border-gray-300
              bg-white
              hover:bg-gray-100
              transition
              text-sm font-medium
            "
          >
            ← Back
          </button>
        </div>

        {/* Author */}
        <div className="mt-8">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-gray-500 text-sm mb-1">
              Author
            </p>

            <p className="font-semibold text-gray-800">
              {commit.author.username}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(updateMessage)}
          className="mt-8"
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commit Message
          </label>

          <textarea
            rows={6}
            className="
              w-full rounded-xl
              border border-gray-300
              bg-white
              p-4
              text-gray-800
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:border-blue-500
              resize-none
              transition
            "
            {...register("message")}
          />

          {isAuthor && (
            <div className="flex flex-wrap gap-4 mt-6">
              
              <button
                type="submit"
                className="
                  bg-blue-600 hover:bg-blue-700
                  text-white
                  px-5 py-3
                  rounded-xl
                  font-medium
                  transition
                "
              >
                Update Message
              </button>

              <button
                type="button"
                onClick={deleteCommit}
                className="
                  bg-red-600 hover:bg-red-700
                  text-white
                  px-5 py-3
                  rounded-xl
                  font-medium
                  transition
                "
              >
                Delete Commit
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  </div>
);
}

export default CommitDetails;