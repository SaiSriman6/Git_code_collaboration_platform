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
  const currentUser=useAuth(state=>state.currentUser);

  useEffect(() => {

    const getFile = async () => {

      try {

        const response = await axios.get(
          `http://localhost:2929/api/files/${id}`,
          { withCredentials: true }
        );

        const fileData = response.data;

        setFileObj(fileData);

        const fileContent = await axios.get(fileData.fileUrl);

        setContent(fileContent.data);

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
   `http://localhost:2929/api/files/${id}`,
   {
    data: { message: commitMessage },
    withCredentials: true
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


  return (

    <div className="h-full w-full flex flex-col">

      {/* Header bar */}
      <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">

        <div>

          <h2 className="text-lg font-semibold">
            {fileObj?.name}
          </h2>

          <p className="text-xs text-gray-500">
            Uploaded by {fileObj?.uploadedBy?.username}
          </p>

        </div>

        { currentUser?.id === fileObj?.uploadedBy?.id && (
          <div className="flex gap-3">

          <button
            onClick={handleEdit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
          >
            Edit
          </button>


          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>

        </div>
        )}

      </div>


      <div className="flex-1 overflow-auto px-6 py-4 bg-gray-50">

        <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {content}
        </pre>

      </div>

    </div>

  );

};

export default FileView;