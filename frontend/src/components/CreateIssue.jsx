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
        `${import.meta.env.VITE_API_URL}/api/issues`,
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

  <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">

    <form
      onSubmit={handleSubmit(createIssue)}
      className="
        w-full max-w-2xl
        bg-white rounded-3xl
        shadow-xl border border-gray-100
        overflow-hidden
      "
    >

      {/* Header */}
      <div className="bg-gradient-to-r bg-blue-500 px-8 py-10 text-white">

        <h2 className="text-4xl font-extrabold">
          Create Issue
        </h2>

        <p className="text-green-100 mt-3 text-lg">
          Report an issue for
          <span className="font-bold ml-2">
            {repo?.name}
          </span>
        </p>

      </div>

      {/* Form Body */}
      <div className="p-8 space-y-7">

        {/* Title */}
        <div>

          <label className="block text-gray-700 font-semibold mb-3">
            Issue Title
          </label>

          <input
            placeholder="Enter issue title"
            {...register("title")}
            required
            className="
              w-full px-5 py-3
              rounded-2xl border border-gray-200
              bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

        </div>

        {/* Description */}
        <div>

          <label className="block text-gray-700 font-semibold mb-3">
            Description
          </label>

          <textarea
            rows={8}
            placeholder="Describe the issue in detail..."
            {...register("description")}
            className="
              w-full px-5 py-4
              rounded-2xl border border-gray-200
              bg-gray-50 resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

        </div>

        {/* Submit Button */}
        <button
          className="
            w-full py-4 rounded-2xl
            bg-green-600 hover:bg-green-700
            text-white font-bold text-lg
            shadow-md transition duration-200
          "
        >
          Create Issue
        </button>

      </div>

    </form>

  </div>

);
}
export default CreateIssue;