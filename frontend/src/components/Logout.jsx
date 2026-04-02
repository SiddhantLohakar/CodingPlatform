import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../features/auth/authSlice'

const Logout = ({data}) => {

  const dispatch = useDispatch();
  const handleClick = ()=>{
    dispatch(logoutUser());
  }

  return (
    <div className='logout absolute bg-gray-300 rounded-md h-50  left-0 top-full -translate-x-full flex flex-col justify-around gap-4 text-black p-3 min-w-70'>
      {/* Name of the user */}
      <div className="name flex gap-3 font-semibold justify-center text-lg">
        <p>UserName: </p>
        <p>{data?.firstName}</p>
      </div>
      {/* Email Id of the user */}
      <div className="email flex gap-3 font-semibold text-lg justify-center">
        <p>Email Id:</p>
        <p>{data?.emailId}</p>
      </div>
      {/* Options for users to display */}
      <div className="options flex gap-3 text-lg text-black font-semibold justify-center">
        <div className="logout p-2 bg-red-500 rounded-md cursor-pointer hover:bg-red-700 ">
            <button className='cursor-pointer' onClick={handleClick}>logout</button>
        </div>
        {/* <div className="change-password p-2 bg-green-500 hover:bg-green-700 rounded-md cursor-pointer">
            <button className='cursor-pointer'>edit</button>
        </div> */}
      </div>
    </div>
  )
}

export default Logout
