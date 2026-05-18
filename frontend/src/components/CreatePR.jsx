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

    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">

      <form
        onSubmit={handleSubmit(createPR)}
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-8"
      >

        <h2 className="text-3xl font-bold mb-2">
          Create Pull Request
        </h2>

        <p className="text-gray-500 mb-6">
          Open a pull request for{" "}
          <span className="font-semibold">
            {repo?.name}
          </span>
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* PR Title */}
        <div className="mb-4">

          <label className="block mb-2 font-medium">
            Pull Request Title
          </label>

          <input
            type="text"
            placeholder="Enter PR title"
            className="border border-gray-300 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            {...register("title", {
              required: "Title is required"
            })}
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.message}
            </p>
          )}

        </div>

        {/* Description */}
        <div className="mb-4">

          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            rows={5}
            placeholder="Describe your changes..."
            className="border border-gray-300 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            {...register("description")}
          />

        </div>

        {/* Source Branch */}
        <div className="mb-4">

          <label className="block mb-2 font-medium">
            Source Branch
          </label>

          <input
            type="text"
            defaultValue="feature"
            className="border border-gray-300 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            {...register("sourceBranch")}
          />

        </div>

        {/* Target Branch */}
        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Target Branch
          </label>

          <input
            type="text"
            defaultValue="main"
            className="border border-gray-300 p-3 w-full rounded-lg outline-none focus:ring-2 focus:ring-green-500"
            {...register("targetBranch")}
          />

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >

          {loading
            ? "Creating Pull Request..."
            : "Create Pull Request"}

        </button>

      </form>

    </div>

  );

}

export default CreatePullRequest;