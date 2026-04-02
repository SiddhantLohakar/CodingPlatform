import {useDispatch, useSelector} from 'react-redux'
import { checkAuth } from './features/auth/authSlice'
import { useEffect} from 'react'
import {BrowserRouter, Route, Routes, Navigate,  useNavigate} from 'react-router'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Homepage from './pages/Homepage'
import Editor from './pages/Editor'
import { Loader2 } from "lucide-react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
    </div>
  );
};





function App() {
  
  const dispatch = useDispatch();
  const {isAuthenticated, isLoading} = useSelector((state)=>state.auth)
  

  useEffect(()=>{
    dispatch(checkAuth())
  }, [])

  

  if(isLoading)
  return <Spinner/>
  
  

  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={isAuthenticated? <Homepage/> : <Navigate to="/login"/>}></Route>
      <Route path='/login' element={isAuthenticated? <Navigate to="/"/> :<Login/>}></Route>
      <Route path='/register' element={isAuthenticated? <Navigate to="/"/> : <Signup/>}></Route>
      <Route path="/problem/:pid" element={isAuthenticated? <Editor/> : <Navigate to="/login"/>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
