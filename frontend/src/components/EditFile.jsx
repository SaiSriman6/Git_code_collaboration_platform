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

  <div className="h-full flex flex-col">

   {/* header */}
   <div className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">

    <h2 className="text-lg font-semibold">
     Editing: {fileObj?.name}
    </h2>

    <button
     onClick={handleSave}
     disabled={loading}
     className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
    >
     {loading ? "Saving..." : "Commit Changes"}
    </button>

   </div>


   {/* editor */}
   <div className="flex-1 bg-gray-50 p-4 flex flex-col gap-4">

    {/* commit message box */}
    <textarea
     placeholder="Enter commit message..."
     value={commitMessage}
     onChange={(e) => setCommitMessage(e.target.value)}
     className="w-full h-20 resize-none outline-none border rounded p-2"
    />

    {/* file editor */}
    <textarea
     value={content}
     onChange={(e) => setContent(e.target.value)}
     className="flex-1 resize-none outline-none font-mono text-sm bg-white p-4 border rounded"
    />

   </div>

  </div>

 );

};

export default EditFile;