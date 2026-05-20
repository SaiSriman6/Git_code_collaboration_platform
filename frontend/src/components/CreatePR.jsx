import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function CreatePullRequest() {

  const { state } = useLocation();

  const repo = state?.repo;

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm();

  const createPR = async (prObj) => {

    try {

      setLoading(true);

      setError("");

      prObj.repository = repo._id;

      prObj.author = currentUser._id;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pull-requests`,
        prObj,
        {
          withCredentials: true
        }
      );

      if (res.status === 201) {

        toast.success(
          "Pull Request Created Successfully"
        );

        navigate(-1);

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to create pull request"
      );

      toast.error("Failed to create PR");

    } finally {

      setLoading(false);

    }

  };

  return (

  <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">

    <form
      onSubmit={handleSubmit(createPR)}
      className="
        w-full max-w-3xl
        bg-white rounded-3xl
        shadow-xl border border-gray-100
        overflow-hidden
      "
    >

      {/* Header */}
      <div className="bg-gradient-to-r bg-blue-500 px-8 py-10 text-white">

        <h2 className="text-4xl font-extrabold">
          Create Pull Request
        </h2>

        <p className="text-green-100 mt-3 text-lg">
          Open a pull request for
          <span className="font-bold ml-2">
            {repo?.name}
          </span>
        </p>

      </div>

      {/* Form Body */}
      <div className="p-8 space-y-7">

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-2xl font-medium">
            {error}
          </div>
        )}

        {/* PR Title */}
        <div>

          <label className="block text-gray-700 font-semibold mb-3">
            Pull Request Title
          </label>

          <input
            type="text"
            placeholder="Enter pull request title"
            {...register("title", {
              required: "Title is required"
            })}
            className="
              w-full px-5 py-3
              rounded-2xl border border-gray-200
              bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-2">
              {errors.title.message}
            </p>
          )}

        </div>

        {/* Description */}
        <div>

          <label className="block text-gray-700 font-semibold mb-3">
            Description
          </label>

          <textarea
            rows={6}
            placeholder="Describe your changes..."
            {...register("description")}
            className="
              w-full px-5 py-4
              rounded-2xl border border-gray-200
              bg-gray-50 resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />

        </div>

        {/* Branches */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Source Branch */}
          <div>

            <label className="block text-gray-700 font-semibold mb-3">
              Source Branch
            </label>

            <input
              type="text"
              defaultValue="feature"
              {...register("sourceBranch")}
              className="
                w-full px-5 py-3
                rounded-2xl border border-gray-200
                bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

          </div>

          {/* Target Branch */}
          <div>

            <label className="block text-gray-700 font-semibold mb-3">
              Target Branch
            </label>

            <input
              type="text"
              defaultValue="main"
              {...register("targetBranch")}
              className="
                w-full px-5 py-3
                rounded-2xl border border-gray-200
                bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

          </div>

        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full py-4 rounded-2xl
            text-white font-bold text-lg
            shadow-md transition duration-200
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }
          `}
        >
          {loading
            ? "Creating Pull Request..."
            : "Create Pull Request"}
        </button>
      </div>
    </form>
  </div>
);

}

export default CreatePullRequest;