import React from 'react'
import { Code, Bell} from 'lucide-react'
import { useNavigate, NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import {useState, useRef, useEffect} from "react"
import Logout from '../components/Logout'

const Navbar = () => {

  const {data} = useSelector((state)=>state.auth)
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  

  // useEffect for removing and adding the logout pop up block
  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e) => {
      
      if (menuRef.current && !menuRef.current.contains(e.target)) {
       
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);



  return (
        <nav className='sticky top-0 z-50 bg-slate-900 p-4 shadow-md'>
          <div className='max-w-7xl mx-auto p-4 flex justify-between items-center'>
            {/* icon and Name */}
            <div className='flex items-center gap-5'>
                <div className='bg-linear-to-br from-blue-500 to-purple-600 p-2 rounded-md'>
                  <Code className=''/>
                </div>

                <h1 className='text-3xl font-bold bg-linear-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent  transition-all duration-500 ease-in-out
                  transform hover:scale-105 hover:from-purple-600 hover:to-blue-500 cursor-pointer'>NexusCode</h1>
            </div>

            {/* Different Links */}

            <div className='hidden md:flex gap-7 text-lg font-semibold text-gray-300 '>
              <NavLink className="hover:text-gray-500">Problems</NavLink>
              <NavLink className="hover:text-gray-500">Contests</NavLink>
              <NavLink className="hover:text-gray-500">Discuss</NavLink>
              <NavLink className="hover:text-gray-500">Interview</NavLink>
            </div>
            
            
            <div className='flex gap-4 '>

            
            {/* Bell */}

            <div className='relative p-1 flex items-center'>
              <div>
              <Bell ></Bell>
              </div>

              <div className='absolute rounded-[50%] w-2 h-2 bg-red-600 top-0 right-0 '></div>
            </div>

            {/* Profile Section */}
            <div className='bg-slate-700 p-2 cursor-pointer flex rounded-full relative' ref = {menuRef} >
  
              <div
                className='
                  flex rounded-full
                  bg-linear-to-br
                  from-blue-500 to-purple-600
                  hover:from-purple-600 hover:to-blue-500
                  w-7 h-7
                  items-center justify-center
                  transition-all duration-500 ease-in-out
                  transform hover:scale-105
                '
                onClick={() => setShowMenu(prev => !prev)}
              >
                <p className='text-2xl text-white'>
                  {data?.firstName ? data.firstName[0] : "G"}
                </p>
              </div>
              { showMenu && <Logout data = {data}/>}
            </div>


            </div>

          </div>
        </nav>
  )
}

export default Navbar
