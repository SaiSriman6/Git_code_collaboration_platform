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
      } catch (error) {
        console.log("Error loading file:", error);
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
    } catch (error) {
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

    // PDF
   if (fileObj.fileType === "application/pdf") {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="text-6xl">📄</div>

      <h2 className="text-xl font-semibold">
        PDF Preview Not Available
      </h2>

      <p className="text-gray-500">
        Open or download the PDF file.
      </p>

      <a
        href={fileObj.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg"
      >
        Open PDF
      </a>
    </div>
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
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
        <div>
          <h2 className="text-lg font-semibold">
            {fileObj?.name}
          </h2>
          <p className="text-xs text-gray-500">
            Uploaded by {fileObj?.uploadedBy?.username}
          </p>
        </div>
        {currentUser?.id === fileObj?.uploadedBy?.id && isEditableFile() && (
          <div className="flex gap-3">
            <button onClick={handleEdit}  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
              Edit
            </button>
            {currentUser?.id === fileObj?.uploadedBy?.id && (
                  <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                  </button>
              )}     
            </div>
            )}
      </div>
      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4 bg-gray-50">
        {renderFile()}
      </div>
    </div>
  );
};
export default FileView;