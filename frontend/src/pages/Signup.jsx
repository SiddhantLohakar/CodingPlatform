import React from 'react'
import { useState } from 'react'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import { registerUser } from '../features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import {Eye, EyeOff} from "lucide-react"




const user = z.object({
        firstName: z.string().min(2, 'firstName must atleast contain 2 characters'),
        email: z.email(),
        password: z.string().min(8, 'Password must be atleast 8 characters').max(16, 'Password must not exceed 16 chanracters').regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
        confirmPassword: z.string().min(8, 'Passwords do not match')
  }).refine((data)=> data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"]
  })



const Signup = () => {

  const {
    register, 
    handleSubmit,
    formState: {errors}
  } = useForm({resolver: zodResolver(user)})

  const dispatch = useDispatch()

   const {isAuthenticated, isLoading, error} = useSelector((state)=>state.auth)
   const [showSuccess, setShowSuccess] = useState(false)


  const [isEyeOn, setIsEyeOn] = useState(false)
  const [isConfirmEyeOn, setConfirmEyeOn] = useState(false)

   useEffect(()=>{
    if(isAuthenticated)
    {
      navigate("/")
      setShowSuccess(true)
    }
   }, [isAuthenticated])


  const onSubmit = (data)=>{
      dispatch(registerUser(data))
   }

  return (
    <div className='flex min-h-screen w-screen justify-center items-center bg-blue-950 font-sans'>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-white rounded-md p-4 sm:p-6 w-full max-w-md mx-4 '>
        <h1 className='text-2xl sm:text-3xl text-pink-600 font-bold text-center mb-5'>Register Here</h1>
        {/* Username */}
        <div className='flex justify-start flex-col gap-2 mb-2'>
              <label htmlFor='email' className='text-lg text-gray-600 font-semibold'>Username</label>
              <input type="text" id='email' placeholder='Enter your username' {...register("firstName")} className='p-2 outline-1 outline-gray-300 rounded-md'/>
              <p className='text-sm text-red-500'>{errors.firstName?.message}</p>
        </div>

        {/* Email */}
        <div className='flex justify-start flex-col gap-2 mb-2'>
              <label htmlFor='email' className='text-lg text-gray-600 font-semibold'>Email</label>
            
                <input type="text" id='email' placeholder='Enter your email' {...register("email")} className='p-2 outline-1 outline-gray-300 rounded-md'/>
                
              <p className='text-sm text-red-500'>{errors.email?.message}</p>
        </div>

         {/* Password */}
        <div  className='flex justify-start flex-col gap-2 mb-2'>
              <label htmlFor='password' className='text-lg text-gray-600 font-semibold'>Password</label>
              <div className='relative'>
                <input type={isEyeOn?"text" : "password"} id="password" {...register("password")} className='p-2 outline-1 outline-gray-300 rounded-md w-full' placeholder='Enter your password'/>
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

         {/* Confirm Password */}
        <div  className='flex justify-start flex-col gap-2 mb-2'>
              <label htmlFor='confirm-password' className='text-lg text-gray-600 font-semibold'>Confirm Password</label>
              <div className='relative'>
                <input type={isConfirmEyeOn? "text": "password"} id="confirm-password" {...register("confirmPassword")} className='p-2 outline-1 outline-gray-300 rounded-md w-full' placeholder='Connfirm Password'/>
                {
                    isConfirmEyeOn?
                    <EyeOff
                    onClick={()=>{setConfirmEyeOn(false)}} 
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer'
                    />:
                    <Eye
                    onClick={()=>{setConfirmEyeOn(true)}}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 cursor-pointer'
                    />
                   }
              </div>
              <p className='text-sm text-red-500'>{errors.confirmPassword?.message}</p>
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
        {/* Login */}
         <div className='mt-5 flex justify-center'>
          <p className='text-lg font-semibold text-gray-600'>Already have an accont? <a href='www.google.com' className='text-blue-600 underline'>Sign In</a></p>
        </div>
      </form>

      {showSuccess && (
          <div className='bg-green-100 text-green-700 p-3 rounded-md mb-4'>
            ✓ Account created successfully! Redirecting...
          </div>
        )}
    </div>
  )
}

export default Signup
