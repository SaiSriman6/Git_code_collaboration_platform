import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../store/useAuth";

const FileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [fileObj, setFileObj] = useState(null);
  const [content, setContent] = useState("");
  const [error,SetError]=useState(null)

  const currentUser = useAuth((state) => state.currentUser);

  const editableExtensions = [
  ".txt",
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".json",
  ".html",
  ".css",
  ".md",

];
const isEditableFile = () => {
  if (!fileObj?.name) return false;

  return editableExtensions.some((ext) =>
    fileObj.name.toLowerCase().endsWith(ext)
  );
};

  useEffect(() => {
    const getFile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/files/${id}`,
          { withCredentials: true }
        );

        const fileData = response.data;
        setFileObj(fileData);

        // Only fetch content for text files
        if (
          fileData.fileType?.startsWith("text/") ||
          fileData.name.match(
            /\.(js|jsx|ts|tsx|json|txt|md|html|css)$/i
          )
        ) {
          const fileContent = await axios.get(fileData.fileUrl);
          setContent(fileContent.data);
        }
      } catch (err) {
        SetError(err.message);
        console.log("Error loading file:", err);
      }
    };

    getFile();
  }, [id]);

  const handleDelete = async () => {
    const commitMessage = prompt("Enter commit message:");

    if (!commitMessage) {
      return toast.error("Commit message required");
    }

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/files/${id}`,
        {
          data: { message: commitMessage },
          withCredentials: true,
        }
      );

      toast.success("File deleted and commit created");
      navigate(-1);
    } catch (err) {
      SetError(err.message);
      toast.error("Delete failed");
    }
  };

  const handleEdit = () => {
    navigate(`/edit-file/${id}`);
  };

  const renderFile = () => {
    if (!fileObj) return null;

    // IMAGE
    if (fileObj.fileType?.startsWith("image/")) {
      return (
        <img
          src={fileObj.fileUrl}
          alt={fileObj.name}
          className="max-w-full rounded-lg shadow"
        />
      );
    }

    // DOC/DOCX
    if (
      fileObj.fileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileObj.fileType === "application/msword"
    ) {
      return (
        <div className="flex flex-col gap-4">
          <p className="text-gray-700">
            DOC/DOCX preview not supported directly.
          </p>

          <a
            href={fileObj.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded w-fit"
          >
            Open Document
          </a>
        </div>
      );
    }
    // TEXT FILES
    if (content) {
      return (
        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {content}
        </pre>
      );
    }

    //error
    if(error){
      return(
        <div className="bg-red-100 text-red-700 p-4 rounded">
          Failed to load file content. You can download it using the link below.
          {error && <p className="text-sm">{error}</p>}
        </div>
      )
    }
    // OTHER FILES
    return (
      <a
        href={fileObj.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Download File
      </a>
    );
  };
 return (
  <div className="min-h-screen bg-[#f4f7fb] p-6">
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-8 py-6 border-b bg-gradient-to-r bg-blue-500 text-white">
        <div>
          <h2 className="text-3xl font-extrabold break-words">
            {fileObj?.name}
          </h2>
          <p className="text-blue-100 mt-2">
            Uploaded by {fileObj?.uploadedBy?.username}
          </p>
        </div>
        {currentUser?._id === fileObj?.uploadedBy?._id && (
          <div className="flex gap-3">
            {isEditableFile() && (
              <button
                onClick={handleEdit}
                className="
                  bg-white text-blue-600
                  hover:bg-blue-50
                  px-5 py-2 rounded-2xl
                  font-semibold shadow-md transition
                "
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDelete}
              className="
                bg-red-500 hover:bg-red-600
                text-white px-5 py-2
                rounded-2xl font-semibold
                shadow-md transition
              "
            >
              Delete
            </button>
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-8 bg-gray-50 min-h-[70vh] overflow-auto">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Error */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-2xl mb-6">
              Failed to load file content.
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          {/* File Content */}
          <div className="overflow-auto">
            {renderFile()}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};
export default FileView;