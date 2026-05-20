import React from "react";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router";

function Profile() {
  const currentUser = useAuth(state => state.currentUser);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Top Section */}
        <div className="bg-gradient-to-r bg-blue-600 px-10 py-12 text-white">

          <div className="flex items-center gap-5">

            <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
              {currentUser?.username?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-4xl font-extrabold">
                {currentUser?.username}
              </h1>

              <p className="text-blue-100 mt-2 text-lg">
                {currentUser?.email}
              </p>
            </div>

          </div>
        </div>

        {/* Details */}
        <div className="p-10 space-y-6">

          <div className="grid md:grid-cols-2 gap-5">

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-gray-500 text-sm mb-2">
                Username
              </p>

              <h2 className="text-xl font-bold text-gray-800">
                {currentUser?.username}
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-gray-500 text-sm mb-2">
                Email
              </p>

              <h2 className="text-xl font-bold text-gray-800 break-all">
                {currentUser?.email}
              </h2>
            </div>

          </div>

          {/* Buttons */}
          <div className="grid md:grid-cols-3 gap-4 pt-4">

            <button
              onClick={() => navigate("/change-pass")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold transition shadow-md"
            >
              Change Password
            </button>

            <button
              onClick={() => navigate("/update-profile")}
              className="bg-gray-900 hover:bg-black text-white py-3 rounded-2xl font-semibold transition shadow-md"
            >
              Update Profile
            </button>

            <button
              className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-semibold transition shadow-md"
            >
              Delete Account
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;