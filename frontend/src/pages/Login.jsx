import React,{useEffect} from 'react'
import { useForm } from 'react-hook-form'
import {useAuth} from '../store/useAuth'
import { useNavigate } from 'react-router';
import {toast} from 'react-hot-toast'

function Login() {
    let {register,handleSubmit}=useForm();
    let login=useAuth(state=>state.login)
    const isAuthenticated=useAuth(state=>state.isAuthenticated);
  const currentUser=useAuth(state=>state.currentUser)
  const error=useAuth(state=>state.error)
  const navigate=useNavigate();

  const toLogin=async(userCredObj)=>{
    await login(userCredObj)
  }
  const toRegister=()=>{
    navigate("/register")
  }
  useEffect(()=>{
    if(isAuthenticated){
       toast.success("Login success");
       navigate("/dashboard")
    }
  },[currentUser,isAuthenticated])
   return (
    <div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <form
    onSubmit={handleSubmit(toLogin)}
    className="bg-white p-8 rounded-xl shadow-lg w-96"
     >
    <h1 className="text-3xl font-semibold text-center text-blue-500 mb-6">
      Login
    </h1>

    {error && (
      <p className="text-red-600 text-sm text-center mb-3 bg-red-100 p-2 rounded">
        {error}
      </p>
    )}

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
      Login
    </button>

    <p className="text-center text-sm mt-4">
      Don't have an account? 
      <span className="text-blue-500 cursor-pointer ml-1">
        <button onClick={toRegister}>Sign Up</button>
      </span>
    </p>
  </form>
</div>
    </div>
  )
}

export default Login