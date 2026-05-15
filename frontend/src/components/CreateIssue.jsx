import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

function CreateIssue() {
  const { state } = useLocation();
  const repo = state?.repo;
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const createIssue = async (data) => {
    try {
      await axios.post(
        "http://localhost:2929/api/issues",
        {
          repository: repo._id,
          ...data
        },
        { withCredentials:true }
      );
      toast.success("Issue created");
      navigate(-1);
    } catch {
      toast.error("Issue creation failed");
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit(createIssue)}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-5">
          Create Issue
        </h2>
        <input
          placeholder="Title"
          className="border p-2 w-full mb-4 rounded"
          {...register("title")}
          required
        />
        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-4 rounded"
          {...register("description")}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          Create Issue
        </button>
      </form>
    </div>
  );
}
export default CreateIssue;