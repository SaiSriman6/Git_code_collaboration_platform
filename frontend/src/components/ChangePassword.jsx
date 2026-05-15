import React,{useState} from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useAuth } from '../store/useAuth'

function ChangePassword() {
  let {register,handleSubmit}=useForm();
  let navigate=useNavigate();
  let [loading,setLoading]=useState(false);
  let [error,setError]=useState(null);
  let currentUser=useAuth(state=>state.currentUser)

  const OnChangePass=async(passObj)=>{
    try{
      setLoading(true);
      let res= await axios.put("http://localhost:2929/api/auth/change-password",passObj,{withCredentials:true})
      if(res.status===200){
        toast.success("Password Updated Successfully");
        navigate(`/profile/${currentUser?.username}`)
      }
    }catch(err){
      setError(err.message)
    }
  }

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className='text-2xl font-bold text-gray-700 animate-pulse'>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Change Password
        </h1>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(OnChangePass)} className="space-y-4">

          <div>
            <input
              type="password"
              placeholder='Enter your current Password'
              {...register("currentPassword")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder='Enter New Password'
              {...register("newPassword")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Change Password
          </button>

        </form>

      </div>

    </div>
  )
}

export default ChangePassword