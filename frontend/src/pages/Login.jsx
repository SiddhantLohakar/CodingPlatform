import React, { useEffect, useState} from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import {useNavigate, NavLink} from "react-router"
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import {Eye, EyeOff} from "lucide-react"


// Schema for my user login
   const user = z.object({
        email: z.email(),
        password: z.string().min(8, 'Password must be atleast 8 characters').max(16, 'Password must not exceed 16 chanracters').regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
   })

const Login = () => {

const dispatch = useDispatch()
const navigate = useNavigate()


// Success message
const [loginSuccess, setLoginSuccess] = useState(false)

// Useform declaration

   const {
    register,
    handleSubmit,
    formState: {errors}
   } = useForm({resolver: zodResolver(user)})


  //  Eye off on state
  const [isEyeOn, setIsEyeOn] = useState(false)

   const {isAuthenticated, isLoading, error} = useSelector((state)=>state.auth)


   useEffect(()=>{
    if(isAuthenticated)
    {
    setLoginSuccess(true)
    setTimeout(() => navigate("/"), 3000)
    }
   }, [isAuthenticated])


   const onSubmit = (data)=>{
    dispatch(loginUser(data))
 
   }

  

  return (
    <div className='flex h-screen w-screen justify-center items-center bg-blue-950 font-sans'>
    <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-md p-4 sm:p-6 w-full max-w-md mx-4 '>
        <h1 className='text-3xl text-pink-600 font-bold text-center mb-5'>NexusCode</h1>
        <h2 className='text-[22px] text-center font-bold text-gray-500 mb-4'>Enter your login credentials</h2>
        {loginSuccess && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 flex items-center gap-2'>
            <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
              <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
            </svg>
            <span className='font-medium'>Login successful! Redirecting...</span>
          </div>
        )}

        {/* Email */}
        <div className='flex justify-start flex-col gap-2 mb-2'>
              <label 
                htmlFor='email' 
                className='text-lg text-gray-600 font-semibold'>
                Email
              </label>
              <input 
                type="text" id='email' 
                placeholder='Enter your email' 
                {...register("email")} 
                className='p-2 outline-1 outline-gray-300 rounded-md'/>
              <p 
                className='text-sm text-red-500'>
                {errors.email?.message}
              </p>
        </div>


        {/* Password */}
        <div  className='flex justify-start flex-col gap-2 mb-2'>
              <label htmlFor='password' className='text-lg text-gray-600 font-semibold'>
                Password
              </label>
              <div className='relative'>
                       <input 
                        type= {isEyeOn ? "text" : "password"}  
                        id="password" 
                        {...register("password")} 
                        className='p-2 outline-1 outline-gray-300 rounded-md w-full' 
                        placeholder='***********'
                        />
                        
                       {
                            isEyeOn?
                           <EyeOff
                            onClick={()=>{setIsEyeOn(false)}} 
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer'
                           />:
                           <Eye
                            onClick={()=>{setIsEyeOn(true)}}
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer'
                           />
                       }
                       
              </div>
                  
              <p className='text-sm text-red-500'>{errors.password?.message}</p>
        </div>
        {/* Submit */}
        <div className='flex items-center justify-center flex-col'>
          <button 
            type="submit" 
            disabled={isLoading}
            className='mx-auto mt-4 font-semibold bg-pink-400 block w-full text-md p-2 rounded-md text-white hover:bg-pink-600 disabled:opacity-70 disabled:cursor-not-allowed'
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              "Submit"
            )}
          </button>
           <p className='text-sm text-red-500'>{error?error:""}</p>
        </div>
       
        {/* Register */}
        <div className='mt-5 flex justify-center'>
          <p className='text-lg font-semibold text-gray-600'>Not registered? <NavLink to="/register" className="text-blue-600 hover:underline font-semibold">Create an Account</NavLink></p>
        </div>

      </form>
     </div>
  )
}

export default Login
