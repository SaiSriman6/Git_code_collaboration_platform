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
        toast.success(
          "Branch created successfully"
        );
        navigate(-1);
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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6">
          Create Branch
        </h1>
        {/* Branch Name */}
        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Branch Name
          </label>
          <input
            type="text"
            placeholder="Enter branch name"
            value={branchName}
            onChange={(e) =>
              setBranchName(e.target.value)
            }
            className="border p-3 w-full rounded-lg"
          />
        </div>
        {/* Source Branch */}
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Source Branch
          </label>
          <select
            value={sourceBranch}
            onChange={(e) =>
              setSourceBranch(e.target.value)
            }
            className="border p-3 w-full rounded-lg"
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
        <div className="flex justify-end gap-3">

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={createBranch}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >

            {loading
              ? "Creating..."
              : "Create Branch"}

          </button>
        </div>
      </div>
    </div>
  );
}
export default CreateBranch;