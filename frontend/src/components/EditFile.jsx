import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const EditFile = () => {

 const { id } = useParams();
 const navigate = useNavigate();

 const [fileObj, setFileObj] = useState(null);
 const [content, setContent] = useState("");
 const [commitMessage, setCommitMessage] = useState("");
 const [loading, setLoading] = useState(false);

 useEffect(() => {

  const loadFile = async () => {

   try {

    const response = await axios.get(
     `${import.meta.env.VITE_API_URL}/api/files/${id}`,
     { withCredentials: true }
    );

    const fileData = response.data;

    setFileObj(fileData);

    const fileContent = await axios.get(
     fileData.fileUrl,
     { responseType: "text" }
    );

    setContent(fileContent.data);

   } catch (error) {

    toast.error("Failed to load file");

   }

  };

  loadFile();

 }, [id]);


 const handleSave = async () => {

  if (!commitMessage.trim()) {
   return toast.error("Commit message is required");
  }

  try {

   setLoading(true);

   await axios.put(
    `${import.meta.env.VITE_API_URL}/api/files/${id}`,
    {
     content,
     message: commitMessage  
    },
    { withCredentials: true }
   );
   toast.success("File updated and commit created");
   navigate(`/file-view/${id}`);
  } catch (error) {
   toast.error("Update failed");
  } finally {
   setLoading(false);
  }
 };
 return (
  <div className="min-h-screen bg-[#f4f7fb] p-6">
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-8 py-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div>
          <h2 className="text-3xl font-extrabold break-words">
            Editing File
          </h2>
          <p className="text-green-100 mt-2 text-lg">
            {fileObj?.name}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="
            bg-white text-green-700
            hover:bg-green-50
            px-6 py-3 rounded-2xl
            font-bold shadow-md
            transition duration-200
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : "Commit Changes"}
        </button>
      </div>
      {/* Editor Section */}
      <div className="p-8 space-y-6 bg-gray-50">
        {/* Commit Message */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            Commit Message
          </label>
          <textarea
            placeholder="Describe your changes..."
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="
              w-full h-24 resize-none
              rounded-2xl border border-gray-200
              bg-white p-4
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          />
        </div>
        {/* File Editor */}
        <div>
          <label className="block text-gray-700 font-semibold mb-3">
            File Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="
              w-full min-h-[70vh]
              resize-none rounded-2xl
              border border-gray-200
              bg-white p-6
              font-mono text-sm
              leading-7
              focus:outline-none focus:ring-2 focus:ring-green-500
            "
          />
        </div>
      </div>
    </div>
  </div>
);
};

export default EditFile;