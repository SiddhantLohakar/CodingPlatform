import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'
import { useNavigate } from 'react-router'

const Logout = ({ data }) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = () => {
    dispatch(logoutUser());
  }

  const goToAdmin = () => {
    navigate("/admin");
  }

  return (
    <div className='
      absolute left-0 top-full -translate-x-full mt-2
      bg-white/90 backdrop-blur-md
      shadow-xl border border-gray-200
      rounded-xl
      min-w-70
      p-5
      flex flex-col gap-5
      text-gray-800
      animate-fadeIn
    '>

      {/* User Info */}
      <div className="flex flex-col items-center gap-2 border-b pb-3">
        <p className="text-sm text-gray-500">Logged in as</p>
        <p className="text-lg font-semibold">{data?.firstName}</p>
        <p className="text-sm text-gray-600">{data?.emailId}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">

        <button
          onClick={handleClick}
          className='
            w-full py-2 rounded-lg
            bg-red-500 text-white font-semibold
            hover:bg-red-600
            transition-all duration-200
            active:scale-95
          '
        >
          Logout
        </button>

        {data?.role === "admin" && (
          <button
            onClick={goToAdmin}
            className='
              w-full py-2 rounded-lg
              bg-blue-500 text-white font-semibold
              hover:bg-blue-600
              transition-all duration-200
              active:scale-95
            '
          >
            Go to Admin Panel
          </button>
        )}

      </div>
    </div>
  )
}

export default Logout