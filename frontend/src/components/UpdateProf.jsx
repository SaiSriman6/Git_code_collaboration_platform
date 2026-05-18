import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../store/useAuth";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";

function UpdateProf() {
  const { register, handleSubmit } = useForm();

  const currentUser = useAuth((state) => state.currentUser);
  const setCurrentUser = useAuth((state) => state.setCurrentUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const updateProfile = async (userObj) => {
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Update Profile
          </h1>
          <p className="text-gray-500 mt-2">
            Edit your account information
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </p>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(updateProfile)}
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              defaultValue={currentUser.email}
              {...register("email")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter your email"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              defaultValue={currentUser.username}
              {...register("username")}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Enter username"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 transition-all duration-300 text-white font-semibold py-3 rounded-xl"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateProf;