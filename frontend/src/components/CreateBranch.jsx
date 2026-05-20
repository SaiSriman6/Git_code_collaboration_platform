import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
function CreateBranch() {
  const { state } = useLocation();
  const repo = state?.repo;
  const navigate = useNavigate();
  const [branchName, setBranchName] =
    useState("");
  const [sourceBranch, setSourceBranch] =
    useState("main");
  const [loading, setLoading] =
    useState(false);
  const createBranch = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/repos/${repo._id}/branches`,
        {
          branchName,
          sourceBranch
        },
        {
       withCredentials: true
        }
      );
      if (res.status === 201) {
      toast.success("Branch created successfully");
      navigate("/repo", {
      state: {repo: res.data.repo}});
    }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to create branch"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
  <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
    <div
      className="
        w-full max-w-2xl
        bg-white rounded-3xl
        shadow-xl border border-gray-100
        overflow-hidden
      "
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-10 text-white">
        <h1 className="text-4xl font-extrabold">
          Create Branch
        </h1>
        <p className="text-blue-100 mt-3 text-lg">
          Create a new branch in
          <span className="font-bold ml-2">
            {repo?.name}
          </span>
        </p>
      </div>
      {/* Form Body */}
      <div className="p-8 space-y-7">
        {/* Branch Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Branch Name
          </label>
          <input
            type="text"
            placeholder="Enter branch name"
            value={branchName}
            onChange={(e) =>
              setBranchName(e.target.value)
            }
            className="
              w-full px-5 py-3
              rounded-2xl border border-gray-200
              bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        </div>
        {/* Source Branch */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Source Branch
          </label>
          <select
            value={sourceBranch}
            onChange={(e) =>
              setSourceBranch(e.target.value)
            }
            className="
              w-full px-5 py-3
              rounded-2xl border border-gray-200
              bg-gray-50
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          >
            {repo?.branches?.map(branch => (
              <option
                key={branch}
                value={branch}
              >
                {branch}
              </option>
            ))}
          </select>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="
              px-6 py-3 rounded-2xl
              bg-gray-200 hover:bg-gray-300
              text-gray-700 font-semibold
              transition duration-200
            "
          >
            Cancel
          </button>
          <button
            onClick={createBranch}
            disabled={loading}
            className={`
              px-7 py-3 rounded-2xl
              text-white font-bold
              shadow-md transition duration-200
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading
              ? "Creating..."
              : "Create Branch"}

          </button>
        </div>
      </div>
    </div>
  </div>
);
}
export default CreateBranch;