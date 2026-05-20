import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function Login() {
  let { register, handleSubmit } = useForm();

  let login = useAuth((state) => state.login);

  const isAuthenticated = useAuth(
    (state) => state.isAuthenticated
  );

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  const error = useAuth((state) => state.error);

  const navigate = useNavigate();

  const toLogin = async (userCredObj) => {
    await login(userCredObj);
  };

  const toRegister = () => {
    navigate("/register");
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login Success");
      navigate("/dashboard");
    }
  }, [currentUser, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4">
      
      <div
        className="
          w-full max-w-md
          bg-white/90
          backdrop-blur-md
          rounded-3xl
          shadow-2xl
          border border-gray-200
          overflow-hidden
        "
      >
        
        {/* Top Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
          
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="mt-3 text-blue-100 text-sm">
            Login to continue your collaboration journey
          </p>
        </div>

        {/* Form Section */}
        <div className="p-8">

          {error && (
            <div
              className="
                mb-5
                bg-red-50
                border border-red-200
                text-red-600
                px-4 py-3
                rounded-xl
                text-sm
              "
            >
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit(toLogin)}
            className="space-y-6"
          >
            
            {/* Email */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="
                  w-full
                  px-4 py-3
                  rounded-xl
                  border border-gray-300
                  bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  transition-all
                "
                {...register("email")}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                required
                placeholder="Enter your password"
                className="
                  w-full
                  px-4 py-3
                  rounded-xl
                  border border-gray-300
                  bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                  transition-all
                "
                {...register("password")}
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="
                w-full
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-700
                hover:to-indigo-700
                text-white
                py-3.5
                rounded-xl
                font-semibold
                text-lg
                shadow-lg
                hover:shadow-xl
                transition-all duration-300
              "
            >
              Login
            </button>

            {/* Bottom Text */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              
              <span
                onClick={toRegister}
                className="
                  text-blue-600
                  font-semibold
                  cursor-pointer
                  hover:underline
                "
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;