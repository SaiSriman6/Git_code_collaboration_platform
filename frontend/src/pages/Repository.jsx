import { useLocation } from "react-router";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import socket from "../socket";

function Repository() {
  const { state } = useLocation();
  // REACTIVE REPO STATE
  const [repo, setRepo] = useState(state.repo);
  const { register, handleSubmit, reset } = useForm();
  let currentUser = useAuth(state => state.currentUser);
  const [currentBranch, setCurrentBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/files/repo/${repo._id}?branch=${currentBranch}`,
          { withCredentials: true }
        );
        setFiles(res.data);
      } catch (err) {
        console.log(err);
        toast.error(err.message || "Failed to load files");
      }
    };
    fetchFiles();

  }, [repo._id,currentBranch]);

  useEffect(() => {
    if (repo?._id) {
      socket.emit(
        "joinRepoRoom",
        repo._id
      );
    }
    return () => {
      socket.emit(
        "leaveRepoRoom",
        repo._id
      );
    };
  }, [repo?._id]);


  // TOGGLE VISIBILITY
  const toggleVisibility = async () => {
    const confirmChange = window.confirm(
      repo.visibility === "private"
        ? "Turn this repository to public?"
        : "Turn this repository to private?"
    );
    if (!confirmChange) return;
    try {
      const newVisibility =
        repo.visibility === "public"
          ? "private"
          : "public";
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/repos/${repo._id}/visibility`,
        { visibility: newVisibility },
        { withCredentials: true }
      );
      // UPDATE UI INSTANTLY
      setRepo(prev => ({
        ...prev,
        visibility: newVisibility
      }));
      toast.success(
        `Repository is now ${newVisibility}`
      );
    } catch (err) {
      toast.error(err.message || "Failed to change visibility");
    }
  };

  const toEdit = (repoObj) => {
    navigate("/edit-repo", { state: { repo: repoObj } });
  };

  const toCreatePR = (repoObj) => {
    navigate("/create-pr", { state: { repo: repoObj } });
  };

  const toPR = () => {
    navigate("/pull-req", { state: { repo } });
  };

  const toCreateBranch = () => {
  navigate("/create-branch", {state: { repo }} 
  );};
  const addCollaborator = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/repos/${repo._id}/collaborators`,
      data,
      { withCredentials: true }
    );
    // UPDATE UI IMMEDIATELY
    setRepo(res.data);
    toast.success("Collaborator added");
    reset();
  } catch (err) {
    toast.error(err.message || "Failed to add collaborator");
  }
};

  const updateRole = async (userId, role) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/repos/${repo._id}/collaborators/${userId}`,
        { role },
        { withCredentials: true }
      );
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.message || "Failed to update role");
    }
  };

  const toFile = (fileObj) => {
    navigate(`/file-view/${fileObj._id}`);
  };

  const removeCollaborator = async (userId) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/repos/${repo._id}/collaborators/${userId}`,
      { withCredentials: true }
    );
    // UPDATE UI IMMEDIATELY
    setRepo(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(
        collab => collab.user._id !== userId
      )
    }));
    toast.success("Collaborator removed");
  } catch (err) {
    toast.error(err.message || "Failed to remove collaborator");
  }
 };

  const isOwner =
    currentUser._id === repo?.owner?._id;

  const collaboratorRole =
  repo?.collaborators?.find(
    c => c.user?._id === currentUser._id
  )?.role;

  const canWrite = isOwner || collaboratorRole === "collaborator";

  const toDelete = async (repoObj) => {
    try {
      setLoading(true);
      let res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/repos/${repoObj._id}`,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Repository Deleted");
        navigate("/repositories");
      }
    } catch (err) {
        toast.error(err.message || "Failed to remove collaborator");
    }
  };

  const deleteBranch = async (branchName) => {
  const confirmDelete = window.confirm(
    `Delete branch "${branchName}" ?`
  );
  if (!confirmDelete) return;
  try {

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/repos/${repo._id}/branches/${branchName}`,
      { withCredentials: true }
    );

    // UPDATE UI IMMEDIATELY
    setRepo(prev => ({
      ...prev,
      branches: prev.branches.filter(
        branch => branch !== branchName
      )
    }));
    // // SWITCH TO MAIN IF CURRENT BRANCH DELETED
    // if (currentBranch === branchName) {
    //   setCurrentBranch("main");
    // }
    toast.success("Branch deleted");
    navigate("/repositories")
  } catch (err) {
    toast.error(
      err.response?.data?.message ||
      "Failed to delete branch"
    );
  }
 };

  if (loading) {
    return <p>Deleting...</p>;
  }
  return (
  <div className="min-h-screen bg-[#f6f8fa] p-6">

    {/* TOP ACTIONS */}
    <div className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-6">

      {isOwner && (
        <>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => toEdit(repo)}
          >
            Edit Repository
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition"
            onClick={() => toDelete(repo)}
          >
            Delete Repository
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            onClick={toggleVisibility}
          >
            {repo.visibility === "private"
              ? "Make Public"
              : "Make Private"}
          </button>
        </>
      )}

      {canWrite && (
        <>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() =>
              navigate("/add-file", {
                state: { repo, currentBranch },
              })
            }
          >
            Add File
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() =>
              navigate("/repo-commits", {
                state: { repo },
              })
            }
          >
            View Commits
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => toCreatePR(repo)}
          >
            Create Pull Request
          </button>
        </>
      )}

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
        onClick={toPR}
      >
        Pull Requests
      </button>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200"
        onClick={() =>
          navigate("/repo-issues", {
            state: { repo },
          })
        }
      >
        Issues
      </button>
    </div>

    {/* REPOSITORY DETAILS */}
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-8 mb-6">

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {repo.name}
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            {repo.description || "No description provided"}
          </p>

          <div className="mt-5">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                repo.visibility === "public"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {repo.visibility}
            </span>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-2">
          <p>
            <span className="font-semibold text-gray-700">
              Owner:
            </span>{" "}
            {repo?.owner
              ? repo.owner.username
              : "Deleted User"}
          </p>

          <p>
            <span className="font-semibold text-gray-700">
              Updated:
            </span>{" "}
            {new Date(repo.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>

    {/* FILES */}
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-8 mb-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Repository Files
      </h2>

      {!files.length ? (
        <div className="text-center py-10 text-gray-500">
          No files uploaded yet
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-gray-800 text-lg">
                  {file.name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Uploaded by{" "}
                  {file.uploadedBy?.username || "Unknown"}
                </p>
              </div>

              <button
                onClick={() => toFile(file)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                View File →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* BRANCHES */}
    {/* BRANCHES */}
<div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-8 mb-6">

  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-gray-800">
      Branches
    </h2>

    {isOwner && (
      <button
        onClick={toCreateBranch}
        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
      >
        Create Branch
      </button>
    )}
  </div>

  {!repo?.branches?.length ? (
    <p className="text-gray-500">
      No branches available
    </p>
  ) : (
    <div className="flex flex-wrap gap-4">

      {repo.branches.map((branch) => (

        <div
          key={branch}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition ${
            currentBranch === branch
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 border-gray-200"
          }`}
        >

          {/* BRANCH BUTTON */}
          <button
            onClick={() => setCurrentBranch(branch)}
            className="font-semibold text-sm"
          >
            {branch}
          </button>

          {/* DELETE BUTTON */}
          {isOwner && branch !== "main" && (
            <button
              onClick={() => deleteBranch(branch)}
              className={`text-sm font-bold ${
                currentBranch === branch
                  ? "text-red-200 hover:text-white"
                  : "text-red-500 hover:text-red-700"
              }`}
            >
              ✕
            </button>
          )}

        </div>

      ))}

    </div>
  )}
 </div>
    {/* COLLABORATORS */}
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-8">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Collaborators
      </h2>

      {isOwner && (
        <form
          onSubmit={handleSubmit(addCollaborator)}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <input
            placeholder="Enter username"
            {...register("username")}
            required
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            className="border border-gray-300 rounded-xl px-4 py-3"
            {...register("role")}
          >
            <option value="collaborator">
              Collaborator
            </option>

            <option value="viewer">
              Viewer
            </option>
          </select>

          <button
            className="bg-green-600 hover:bg-green-700 text-white px-6 rounded-xl font-medium transition"
          >
            Add Collaborator
          </button>
        </form>
      )}

      {!repo.collaborators.length ? (
        <p className="text-gray-500">
          No collaborators added yet
        </p>
      ) : (
        <div className="space-y-4">
          {repo.collaborators.map((collab) => (
            <div
              key={collab.user._id}
              className="flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 border border-gray-200 rounded-2xl p-5"
            >
              <div>
                <p className="font-bold text-lg text-gray-800">
                  {collab.user.username}
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  {collab.user.email}
                </p>

                <span className="inline-block mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold capitalize">
                  {collab.role}
                </span>
              </div>

              {isOwner && (
                <div className="flex gap-3 mt-4 md:mt-0">
                  <select
                    defaultValue={collab.role}
                    onChange={(e) =>
                      updateRole(
                        collab.user._id,
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-xl px-3 py-2"
                  >
                    <option value="collaborator">
                      Collaborator
                    </option>

                    <option value="viewer">
                      Viewer
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      removeCollaborator(collab.user._id)
                    }
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}
export default Repository;