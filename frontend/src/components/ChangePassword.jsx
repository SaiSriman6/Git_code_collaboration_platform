import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../store/useAuth";
function ChangePassword() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useAuth(state => state.currentUser);
  const OnChangePass = async passObj => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        passObj,
        { withCredentials: true }
      );
      if (res.status === 200) {
        toast.success("Password Updated Successfully");
        navigate(`/profile/${currentUser?.username}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f7fb]">
        <div className="bg-white px-10 py-6 rounded-2xl shadow-lg">
          <p className="text-2xl font-bold text-blue-600 animate-pulse">
            Updating Password...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r bg-blue-500 px-8 py-10 text-white">
          <h1 className="text-4xl font-extrabold">
            Change Password
          </h1>
          <p className="mt-2 text-blue-100">
            Update your account password securely.
          </p>
        </div>
        {/* Form Section */}
        <div className="p-8">
          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}
          <form
            onSubmit={handleSubmit(OnChangePass)}
            className="space-y-6"
          >
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Current Password
              </label>
              <input
                type="password"
                placeholder="Enter current password"
                {...register("currentPassword")}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                {...register("newPassword")}
                className="w-full px-5 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-bold text-lg shadow-md transition duration-200"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default ChangePassword;