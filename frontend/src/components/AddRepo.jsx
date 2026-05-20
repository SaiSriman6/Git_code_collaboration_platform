import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

function AddRepo() {
  let { register, handleSubmit } = useForm();

  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(null);

  let navigate = useNavigate();

  let createRepo = async (repoObj) => {
    try {
      setLoading(true);

      let res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/repos`,
        repoObj,
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success("Repository Created");
        navigate("/repositories");
      }
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create repository");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="bg-white px-10 py-8 rounded-2xl shadow-xl">
          <h1 className="text-2xl font-bold text-gray-700 animate-pulse">
            Creating Repository...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center p-6">
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
          <h1 className="text-4xl font-bold tracking-tight">
            Create Repository
          </h1>

          <p className="mt-3 text-blue-100 text-sm">
            Start managing your project with a new repository
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(createRepo)}
            className="space-y-7"
          >
            
            {/* Repo Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Repository Name
              </label>

              <input
                type="text"
                placeholder="my-awesome-project"
                {...register("name")}
                className="
                  w-full px-5 py-3
                  rounded-xl
                  border border-gray-300
                  bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  transition-all
                "
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                placeholder="Write something about your repository..."
                {...register("description")}
                minLength={10}
                maxLength={500}
                rows="7"
                className="
                  w-full px-5 py-3
                  rounded-xl
                  border border-gray-300
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

            {/* Visibility */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Visibility
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                
                <label
                  className="
                    flex items-center gap-3
                    border border-gray-300
                    rounded-2xl
                    p-4
                    cursor-pointer
                    hover:border-blue-500
                    hover:bg-blue-50
                    transition-all
                  "
                >
                  <input
                    type="radio"
                    value="public"
                    {...register("visibility")}
                    className="w-4 h-4"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Public
                    </p>

                    <p className="text-sm text-gray-500">
                      Anyone can view this repository
                    </p>
                  </div>
                </label>

                <label
                  className="
                    flex items-center gap-3
                    border border-gray-300
                    rounded-2xl
                    p-4
                    cursor-pointer
                    hover:border-blue-500
                    hover:bg-blue-50
                    transition-all
                  "
                >
                  <input
                    type="radio"
                    value="private"
                    {...register("visibility")}
                    className="w-4 h-4"
                  />

                  <div>
                    <p className="font-semibold text-gray-800">
                      Private
                    </p>

                    <p className="text-sm text-gray-500">
                      Only invited users can access
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="
                w-full
                bg-gradient-to-r from-green-600 to-emerald-600
                hover:from-green-700 hover:to-emerald-700
                text-white
                py-3.5
                rounded-2xl
                font-semibold
                text-lg
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
              "
            >
              Create Repository
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default AddRepo;