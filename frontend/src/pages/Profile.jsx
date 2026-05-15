import React from 'react'
import { useAuth } from '../store/useAuth'
import { useNavigate } from 'react-router'

function Profile() {
  let currentUser = useAuth(state => state.currentUser)
  let navigate = useNavigate();

  let changePass = () => {
    navigate('/change-pass')
  }

  let updateProfile=()=>{
    navigate('/update-profile')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Profile
        </h1>

   
        <div className="space-y-4">
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Username:
              <span className="font-semibold text-gray-900 ml-2">
                {currentUser?.username}
              </span>
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">
              Email:
              <span className="font-semibold text-gray-900 ml-2">
                {currentUser?.email}
              </span>
            </p>
          </div>

        </div>

    
        <div className="mt-6 flex flex-col gap-3">
          
          <button
            onClick={changePass}
            className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Change Password
          </button>

          <button
            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Delete Account
          </button>

          <button
          onClick={updateProfile} 
          className='bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200'>
            Update Profile

          </button>

        </div>

      </div>

    </div>
  )
}

export default Profile