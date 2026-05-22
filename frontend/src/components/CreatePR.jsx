import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const inputClass = `
  w-full px-5 py-3 rounded-2xl border border-gray-200
  bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500
`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-gray-700 font-semibold mb-3">{label}</label>
    {children}
    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
  </div>
);

function CreatePullRequest() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const repo = state?.repo;
  const currentUser = useAuth((s) => s.currentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: { sourceBranch: "", targetBranch: "main" },
  });

  const createPR = async (prObj) => {
    try {
      setLoading(true);
      setError("");
      prObj.repository = repo._id;
      prObj.author = currentUser._id;

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/pull-requests`,
        prObj,
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success("Pull Request Created Successfully");
        navigate(-1);
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create pull request";
      setError(msg);
      toast.error("Failed to create PR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(createPR)}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r bg-blue-500 px-8 py-10 text-white">
          <h2 className="text-4xl font-extrabold">Create Pull Request</h2>
          <p className="text-green-100 mt-3 text-lg">
            Open a pull request for <span className="font-bold ml-2">{repo?.name}</span>
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-7">
          {error && <div className="bg-red-100 text-red-600 p-4 rounded-2xl font-medium">{error}</div>}

          <Field label="Pull Request Title" error={errors.title?.message}>
            <input
              type="text"
              placeholder="Enter pull request title"
              {...register("title", { required: "Title is required" })}
              className={inputClass}
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={6}
              placeholder="Describe your changes..."
              {...register("description")}
              className={`${inputClass} py-4 resize-none`}
            />
          </Field>

          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Source Branch" error={errors.sourceBranch?.message}>
              <input
                type="text"
                placeholder="Enter source branch"
                {...register("sourceBranch", { required: "Source branch is required" })}
                className={inputClass}
              />
            </Field>

            <Field label="Target Branch">
              <input
                type="text"
                placeholder="Enter target branch"
                {...register("targetBranch")}
                className={inputClass}
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl text-white font-bold text-lg shadow-md transition duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Creating Pull Request..." : "Create Pull Request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePullRequest;