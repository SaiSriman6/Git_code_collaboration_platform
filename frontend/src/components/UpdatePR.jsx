import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../store/useAuth";
import { useForm } from "react-hook-form";

function UpdatePR() {

  const { state } = useLocation();

  const repo = state?.repo;
  const pr = state?.pr;

  const currentUser = useAuth(
    state => state.currentUser
  );

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
        { withCredentials: true }
      );

      toast.success(
        "Pull Request updated successfully"
      );

      navigate(-1);

    } catch {
      toast.error("Update failed");
    }
  };

  // No PR Data
  if (!pr) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-3xl
            shadow-sm
            px-10
            py-8
            text-center
          "
        >

          <div className="text-6xl mb-4">
            ⚠️
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            Pull Request data not available
          </h2>

        </div>

      </div>
    );
  }

  const isRepoOwner =
    currentUser?._id?.toString() ===
    repo?.owner?._id?.toString();

  const isPRAuthor =
    currentUser?._id?.toString() ===
    pr?.author?._id?.toString();

  // Unauthorized
  if (!(isRepoOwner || isPRAuthor)) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">

        <div
          className="
            bg-white
            border
            border-red-200
            rounded-3xl
            shadow-sm
            px-10
            py-8
            text-center
          "
        >

          <div className="text-6xl mb-4">
            🚫
          </div>

          <h2 className="text-2xl font-bold text-red-600">
            Access Denied
          </h2>

          <p className="text-gray-500 mt-3">
            You are not allowed to edit this PR.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">

      <div
        className="
          w-full
          max-w-3xl
          bg-white
          border
          border-gray-200
          rounded-[32px]
          shadow-sm
          overflow-hidden
        "
      >

        {/* Header */}
        <div
          className="
            px-10
            py-8
            border-b
            border-gray-100
            bg-gradient-to-r
            from-blue-50
            to-white
          "
        >

          <div className="flex items-center gap-5">

            {/* Icon */}
            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-blue-100
                flex
                items-center
                justify-center
                text-3xl
              "
            >
              ✏️
            </div>

            <div>

              <h1
                className="
                  text-4xl
                  font-extrabold
                  text-gray-800
                  tracking-tight
                "
              >
                Update Pull Request
              </h1>

              <p className="text-gray-500 mt-2 text-lg">
                Edit pull request details professionally.
              </p>

            </div>

          </div>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(updatePR)}
          className="p-10"
        >

          {/* Title */}
          <div className="mb-7">

            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-3
              "
            >
              Pull Request Title
            </label>

            <input
              type="text"
              {...register("title")}
              required
              className="
                w-full
                border
                border-gray-300
                rounded-2xl
                px-5
                py-4
                text-gray-800
                text-lg
                focus:outline-none
                focus:ring-4
                focus:ring-blue-100
                focus:border-blue-500
                transition-all
              "
              placeholder="Enter PR title"
            />

          </div>

          {/* Description */}
          <div className="mb-8">

            <label
              className="
                block
                text-sm
                font-semibold
                text-gray-700
                mb-3
              "
            >
              Description
            </label>

            <textarea
              rows={6}
              {...register("description")}
              className=" w-full border border-gray-300 rounded-2xl px-5 py-4 text-gray-800 resize-none focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-al "
              placeholder="Describe your pull request..."
            />

          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">

            <button
              type="submit"
              className=" bg-blue-600 hover:bg-blue-70  text-white px-8 py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all duration-20 ">
              Update Pull Request
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className=" bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-2xl font-semibold transition-all duration-200 ">
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default UpdatePR;