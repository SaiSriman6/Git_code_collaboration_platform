
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate,  useLocation } from "react-router";

function UploadFile() {

 const { register, handleSubmit, reset } = useForm();

 const [loading, setLoading] = useState(false);


 const navigate = useNavigate();

 const {state}=useLocation()

 const  repository   = state?.repo?._id;
  

 const handleUpload = async (data) => {

  try {

   setLoading(true);

   // Step 1️⃣ Upload file
   const formData = new FormData();

   formData.append("file", data.file[0]);
   formData.append("repository", repository);

   const fileRes = await axios.post(
    "http://localhost:2929/api/files/upload",
    formData,
    { withCredentials: true }
   );


   await axios.post(
    "http://localhost:2929/api/commits",
    {
     repository: repository,
     message: data.commitMessage,
     files: [fileRes.data.fileId]
    },
    { withCredentials: true }
   );


   toast.success("File uploaded and commit created successfully");

   reset();

   navigate(`/repo`,{state:{repo:state?.repo}});

  } catch (err) {

   console.error(err);

   toast.error("Upload failed or commit failed");

  } finally {
   setLoading(false);
  }
 };


 if (loading) {

  return (
   <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-2xl font-bold animate-pulse">
     Uploading file...
    </h1>
   </div>
  );

 }


 return (

  <div className="min-h-screen flex items-center justify-center bg-gray-100">

   <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">

    <h1 className="text-3xl font-bold mb-6 text-center">
     Add File to Repository
    </h1>


    <form
     onSubmit={handleSubmit(handleUpload)}
     className="space-y-5"
    >


     {/* File Upload */}

     <div>

      <label className="block font-semibold mb-1">
       Select File
      </label>

      <input
       type="file"
       {...register("file", { required: true })}
       className="w-full border rounded-lg px-3 py-2"
      />

     </div>



     <div>

      <label className="block font-semibold mb-1">
       Commit Message
      </label>

      <textarea
       placeholder="Enter commit message..."
       {...register("commitMessage", { required: true })}
       rows="4"
       className="w-full border rounded-lg px-3 py-2 resize-none"
      />

     </div>



     <button
      type="submit"
      className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
     >
      Upload File
     </button>


    </form>

   </div>

  </div>

 );

}

export default UploadFile;