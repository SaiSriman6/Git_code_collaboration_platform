import React,{useState} from 'react'
import {useForm} from 'react-hook-form'
import { useLocation } from 'react-router'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

function EditRepo() {
    let {register,handleSubmit}=useForm()
    let {state}=useLocation();
    let navigate=useNavigate();
    let [loading,setLoading]=useState(false);
    let [error,setError]=useState(null);

    const editRepo=async(repoObj)=>{
        try{
          setLoading(true);
          let res=await axios.patch(`${import.meta.env.VITE_API_URL}/api/repos/${state?.repo?._id}`,
            repoObj,
            {withCredentials:true});
            if(res.status===200){
               toast.success("Repository Updated Successfully");
               navigate('/repositories');
            }
        }catch(err){
            setError(err.message);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    }

    if(loading){
        return <p>Loading....</p>
    }
  return (
  <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r bg-blue-500 px-8 py-10 text-white">
        <h1 className="text-4xl font-extrabold">
          Edit Repository
        </h1>
        <p className="mt-2 text-green-100">
          Update your repository details professionally.
        </p>
      </div>
      {/* Form */}
      <div className="p-8">
        {error && (
          <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit(editRepo)}
          className="space-y-7"
        >
          {/* Repository Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Repository Name
            </label>
            <input
              type="text"
              defaultValue={state?.repo?.name}
              {...register("name")}
              placeholder="Enter repository name"
              className="
                w-full px-5 py-3
                rounded-2xl border border-gray-200
                bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-green-500
              "
            />
          </div>
          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              Description
            </label>
            <textarea
              defaultValue={state?.repo?.description}
              {...register("description")}
              minLength={10}
              maxLength={500}
              rows="10"
              placeholder="Describe your repository..."
              className="
                w-full px-5 py-4
                rounded-2xl border border-gray-200
                bg-gray-50 resize-none
                focus:outline-none focus:ring-2 focus:ring-green-500
              "
            />
          </div>
          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-green-600 hover:bg-green-700
              text-white py-3 rounded-2xl
              font-bold text-lg shadow-md
              transition duration-200
              disabled:opacity-50
            "
          >
            {loading ? "Updating..." : "Edit Repository"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
}

export default EditRepo