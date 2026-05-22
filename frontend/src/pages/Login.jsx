import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";

function Login() {
  const { register, handleSubmit } = useForm();
  const login = useAuth(s => s.login);
  const isAuthenticated = useAuth(s => s.isAuthenticated);
  const currentUser = useAuth(s => s.currentUser);
  const error = useAuth(s => s.error);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) { toast.success("Login Success"); navigate("/dashboard"); }
  }, [currentUser, isAuthenticated]);

  const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">

        {/* Top Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-3 text-blue-100 text-sm">Login to continue your collaboration journey</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          {error && <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}

          <form onSubmit={handleSubmit(login)} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
              <input type="email" required placeholder="Enter your email" className={inputCls} {...register("email")} />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
              <input type="password" required placeholder="Enter your password" className={inputCls} {...register("password")} />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Login
            </button>
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <span onClick={() => navigate("/register")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Sign Up</span>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Login;
