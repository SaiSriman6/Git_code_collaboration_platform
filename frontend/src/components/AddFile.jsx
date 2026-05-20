import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router";

function UploadFile() {
  const { register, handleSubmit, reset } = useForm();

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { state } = useLocation();

  const repository = state?.repo?._id;

  const handleUpload = async (data) => {
    try {
      setLoading(true);

      // Upload File
      const formData = new FormData();

      formData.append("file", data.file[0]);
      formData.append("repository", repository);
      formData.append(
        "branch",
        state?.currentBranch || "main"
      );

      const fileRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/files/upload`,
        formData,
        { withCredentials: true }
      );

      // Create Commit
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/commits`,
        {
          repository: repository,
          message: data.commitMessage,
          files: [fileRes.data.fileId],
        },
        { withCredentials: true }
      );

      toast.success(
        "File uploaded and commit created successfully"
      );

      reset();

      navigate(`/repo`, {
        state: { repo: state?.repo },
      });

    } catch (err) {
      console.error(err);
      toast.error("Upload failed or commit failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        
        <div className="bg-white px-10 py-8 rounded-3xl shadow-2xl">
          <h1 className="text-2xl font-bold text-gray-700 animate-pulse">
            Uploading File...
          </h1>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 p-6">
      
      <div
        className="
          w-full max-w-2xl
          bg-white
          rounded-3xl
          shadow-2xl
          border border-gray-200
          overflow-hidden
        "
      >
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
          
          <h1 className="text-4xl font-bold">
            Upload File
          </h1>

          <p className="mt-3 text-blue-100">
            Add files and create commits in your repository
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          
          <form
            onSubmit={handleSubmit(handleUpload)}
            className="space-y-7"
          >
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select File
              </label>

              <div
                className="
                  border-2 border-dashed border-gray-300
                  rounded-2xl
                  p-8
                  bg-gray-50
                  hover:border-blue-500
                  hover:bg-blue-50/40
                  transition-all
                "
              >
                <input
                  type="file"
                  accept=".txt,.js,.jsx,.ts,.tsx,.json,.md,.html,.css,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx"
                  {...register("file", {
                    required: true,
                    validate: {
                      notPdf: (files) => {
                        const file = files?.[0];

                        if (!file) return true;

                        return (
                          file.type !== "application/pdf" ||
                          "PDF files are not supported"
                        );
                      },
                    },
                  })}
                  onChange={(e) => {
                    const file = e.target.files[0];

                    if (
                      file?.type === "application/pdf"
                    ) {
                      toast.error(
                        "PDF files are not supported"
                      );

                      e.target.value = "";
                    }
                  }}
                  className="
                    w-full
                    text-gray-600
                    file:mr-4
                    file:py-2
                    file:px-4
                    file:rounded-xl
                    file:border-0
                    file:bg-blue-600
                    file:text-white
                    file:font-medium
                    hover:file:bg-blue-700
                    cursor-pointer
                  "
                />

                <p className="text-sm text-gray-500 mt-3">
                  Supported formats: JS, JSX, TS, JSON,
                  HTML, CSS, Images, DOC files
                </p>
              </div>
            </div>

            {/* Commit Message */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Commit Message
              </label>

              <textarea
                placeholder="Describe your changes..."
                {...register("commitMessage", {
                  required: true,
                })}
                rows="5"
                className="
                  w-full
                  border border-gray-300
                  rounded-2xl
                  px-5 py-4
                  bg-gray-50
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  transition-all
                "
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                w-full
                bg-gradient-to-r
                from-green-600
                to-emerald-600
                hover:from-green-700
                hover:to-emerald-700
                text-white
                py-4
                rounded-2xl
                font-semibold
                text-lg
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
              "
            >
              Upload File
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadFile;