import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../store/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function CommitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuth(state => state.currentUser);
  const { register, handleSubmit, setValue } = useForm();
  const [commit, setCommit] = useState(null);
  useEffect(() => {
    async function fetchCommit() {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/commits/${id}`,
        { withCredentials: true }
      );
      setCommit(res.data);
      setValue("message", res.data.message);
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
  const isAuthor =
    currentUser._id === commit.author._id;
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">
        Commit Details
      </h1>
      <form
        onSubmit={handleSubmit(updateMessage)}
        className="mt-4"
      >
        <textarea
          className="border p-2 w-full rounded"
          {...register("message")}
        />
        {isAuthor && (
          <div className="flex gap-3 mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Message
            </button>
            <button
              type="button"
              onClick={deleteCommit}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete Commit
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
export default CommitDetails;