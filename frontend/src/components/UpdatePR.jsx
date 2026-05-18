import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/useAuth";
import { useForm } from "react-hook-form";
function UpdatePR() {
  const { state } = useLocation();
  const repo = state?.repo;
  const pr = state?.pr;
  const currentUser = useAuth(state => state.currentUser);
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      title: pr?.title,
      description: pr?.description
    }
  });
  const updatePR = async (data) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/pull-requests/${pr._id}`,
        data,
        { withCredentials:true }
      );
      toast.success("Pull Request updated successfully");
      navigate(-1);
    } catch {
      toast.error("Update failed");
    }
  };
  if (!pr) {
    return (
      <p className="text-center mt-10">
        Pull Request data not available
      </p>
    );
  }
  const isRepoOwner =
    currentUser?._id?.toString() ===
    repo?.owner?._id?.toString();
  const isPRAuthor =
    currentUser?._id?.toString() ===
    pr?.author?._id?.toString();
  if (!(isRepoOwner || isPRAuthor)) {
    return (
      <p className="text-center mt-10 text-red-500">
        You are not allowed to edit this PR
      </p>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <form
        onSubmit={handleSubmit(updatePR)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-5">
          Update Pull Request
        </h2>
        <input
          type="text"
          className="border p-2 w-full mb-4 rounded"
          {...register("title")}
          required
        />
        <textarea
          className="border p-2 w-full mb-4 rounded"
          {...register("description")}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Update Pull Request
        </button>
      </form>
    </div>
  );
}

export default UpdatePR;