import React,{useState} from 'react'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import {useNavigate} from 'react-router'

function Register() {
    let {register,handleSubmit}=useForm();
    let [error,setError]=useState(null)
    let [loading,setLoading]=useState(false)
    let navigate=useNavigate();
    const toRegister=async(userObj)=>{
        try{
            setLoading(true);
            let res=await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`,userObj,{withCredentials:true})
            if(res.status===201){
               toast.success("Registered Successfully");
               navigate("/login")
            }

        }catch(err){
           setError(err.message);
        }
    }
  return (
    <div>
        {loading && <p>{loading}</p>}
        {error && <p>{error}</p>}
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <form
    onSubmit={handleSubmit(toRegister)}
    className="bg-white p-8 rounded-xl shadow-md w-96"
  >
    <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>

    <div className="mb-4">
      <label className="block mb-1 font-medium">Username</label>
      <input
        type="text"
        placeholder="Enter Username"
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...register("username")}
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1 font-medium">Email</label>
      <input
        type="email"
        required
        placeholder="Enter your email"
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...register("email")}
      />
    </div>

    <div className="mb-6">
      <label className="block mb-1 font-medium">Password</label>
      <input
        type="password"
        required
        placeholder="Enter your password"
        className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...register("password")}
      />
    </div>

    <button
      type="submit"
      className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
    >
      Register
    </button>
  </form>
</div>
    </div>
  )
}

export default Register;