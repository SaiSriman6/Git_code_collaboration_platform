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
          let res=await axios.patch(`http://localhost:2929/api/repos/${state?.repo?._id}`,
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
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
 
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Repository
      </h1>

      {error && (
        <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit(editRepo)} className="space-y-5">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Repository Name
          </label>
          <input
            type="text"
            defaultValue={state?.repo?.name}
            {...register("name")}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            defaultValue={state?.repo?.description}
            {...register("description")}
            minLength={10}
            maxLength={500}
            rows="10"
            className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Visibility
          </label>

          <div className="flex gap-4">
            
            <label className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer border hover:border-blue-500">
              <input type="radio" value="public" {...register("visibility")}  />
              <span className="text-gray-700">Public</span>
            </label>

            <label className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg cursor-pointer border hover:border-blue-500">
              <input type="radio" value="private" {...register("visibility")} />
              <span className="text-gray-700">Private</span>
            </label>

          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200"
        >
          Edit Repository
        </button>

      </form>

    </div>
  </div>
  )
}

export default EditRepo