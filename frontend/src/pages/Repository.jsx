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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchFiles = async () => {

      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/files/repo/${repo._id}`,
          { withCredentials: true }
        );

        setFiles(res.data);

      } catch (err) {

        console.log(err);
        toast.error("Failed to load files");

      }

    };

    fetchFiles();

  }, [repo._id]);

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

      toast.error("Failed to change visibility");

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
  } catch {
    toast.error("Failed to add collaborator");
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

    } catch {

      toast.error("Failed to update role");

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
  } catch {
    toast.error("Failed to remove collaborator");
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

      setError(err.message);

    }

  };

  if (loading) {
    return <p>Deleting...</p>;
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* TOP BUTTONS */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-6">

        {isOwner && (
          <>

            <button
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={() => toEdit(repo)}
            >
              Edit Repo
            </button>

            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              onClick={() => toDelete(repo)}
            >
              Delete Repo
            </button>

            <button
              className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
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
              className="bg-orange-600 text-white px-4 py-2 rounded-lg"
              onClick={() =>
                navigate("/add-file", { state: { repo } })
              }
            >
              Add File
            </button>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={() =>
              navigate("/repo-commits", { state: { repo } })
            }
          >
            View Commits
          </button>

          <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={() => toCreatePR(repo)}
         >
          Create Pull Request
         </button>

           </>
        )}
           <button
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
          onClick={toPR}
        >
          Pull Requests
        </button>

       
        <button
          className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          onClick={() =>
            navigate("/repo-issues", { state: { repo } })
          }
        >
          Issues
        </button>
      </div>
      {/* REPO DETAILS */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {repo.name}
        </h1>
        <p className="text-gray-600 mt-2">
          {repo.description || "No description provided"}
        </p>

        <p className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-semibold shadow-sm border border-gray-200">

        <span className="text-sm text-gray-500">
          Visibility:
        </span>

       <span
         className={`px-3 py-1 rounded-full text-sm font-bold ${
         repo.visibility === "public"
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700"
        }`}
       >
       {repo.visibility}
      </span>
</p>

        <div className="mt-4 flex justify-between text-sm text-gray-500">

          <span>
            Owner: {repo?.owner
              ? repo.owner.username
              : "Deleted User"}
          </span>

          <span>
            Updated: {repo.updatedAt}
          </span>

        </div>

      </div>

      {/* FILES */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mb-6">

        <h2 className="text-xl font-semibold mb-4">
          Repository Files
        </h2>

        {!files.length ? (

          <p className="text-gray-500">
            No files uploaded yet
          </p>

        ) : (

          <div className="space-y-3">

            {files.map(file => (

              <div
                key={file._id}
                className="flex justify-between items-center bg-gray-50 rounded-lg p-4 hover:shadow-sm transition"
              >

                <div>

                  <p className="font-semibold text-gray-800">
                    {file.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Uploaded by: {file.uploadedBy?.username || "Unknown"}
                  </p>

                </div>

                <button
                  onClick={() => toFile(file)}
                  className="text-blue-600 hover:underline"
                >
                  View File
                </button>

              </div>

            ))}

          </div>

        )}

      </div>


      {/* BRANCHES */}
<div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 mb-6">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-xl font-semibold">
      Branches
    </h2>

    {isOwner && (
      <button onClick={toCreateBranch} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Create Branch</button>
    )}

  </div>

  {!repo?.branches?.length ? (

    <p className="text-gray-500">
      No branches available
    </p>
  ) : (
    <div className="flex flex-wrap gap-3">
      {repo.branches.map(branch => (
        <div
          key={branch}
          className="bg-gray-100 px-4 py-2 rounded-full border text-sm font-medium"
        >
          {branch}
        </div>
      ))}
    </div>
  )}
</div>

      {/* COLLABORATORS */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Collaborators
        </h2>

        {isOwner && (

          <form
            onSubmit={handleSubmit(addCollaborator)}
            className="flex gap-3 mb-6"
          >

            <input
              placeholder="Username"
              {...register("username")}
              required
            />

            <select
              className="border rounded px-3 py-2"
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
              className="bg-green-600 text-white px-4 rounded"
            >
              Add
            </button>

          </form>

        )}

        {!repo.collaborators.length ? (

          <p className="text-gray-500">
            No collaborators added yet
          </p>

        ) : (

          repo.collaborators.map(collab => (

            <div
              key={collab.user._id}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-3 hover:shadow-sm"
            >

              <div>

                <p className="font-semibold">
                  {collab.user.username}
                </p>

                <p className="text-sm text-gray-500">
                  {collab.user.email}
                </p>

                <p className="text-sm capitalize">
                  Role: {collab.role}
                </p>

              </div>

              {isOwner && (

                <div className="flex gap-2">

                  <select
                    defaultValue={collab.role}
                    onChange={(e) =>
                      updateRole(
                        collab.user._id,
                        e.target.value
                      )
                    }
                    className="border rounded px-2"
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
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>

                </div>

              )}

            </div>

          ))

        )}

      </div>

    </div>

  );

}

export default Repository;