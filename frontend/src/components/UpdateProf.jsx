import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/useAuth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

function UpdateProf() {
  const { register, handleSubmit } = useForm();
  const currentUser = useAuth(state => state.currentUser);
  const setCurrentUser = useAuth(state => state.setCurrentUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const updateProfile = async userObj => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/auth/update-profile`,
        userObj,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Profile Updated Successfully");
        setCurrentUser(res.data.user);
        navigate(`/profile/${res.data.user.username}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r bg-blue-500 px-8 py-10 text-white ">
          <h1 className="text-4xl font-extrabold">
            Update Profile
          </h1>
          <p className="mt-2 text-amber-100">
            Edit your personal account information.
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
            onSubmit={handleSubmit(updateProfile)}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                defaultValue={currentUser.email}
                {...register("email")}
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            {/* Username */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                defaultValue={currentUser.username}
                {...register("username")}
                placeholder="Enter username"
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold text-lg shadow-md transition duration-200"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default UpdateProf;