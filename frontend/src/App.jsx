import {useDispatch, useSelector} from 'react-redux'
import { checkAuth } from './features/auth/authSlice'
import { useEffect} from 'react'
import {BrowserRouter, Route, Routes, Navigate,  useNavigate} from 'react-router'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Homepage from './pages/Homepage'
import { Loader2 } from "lucide-react";
import CodeEditor from './pages/Editor'
import Admin from './pages/Admin'
import CreateProblem from './components/Admin/CreateProblem'
import UpdateProblem from './components/Admin/UpdateProblem'
import DeleteProblem from './components/Admin/DeleteProblem'
import Dashboard from './components/Admin/Dashboard'

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
    </div>
  );
};





function App() {
  
  const dispatch = useDispatch();
  const {isAuthenticated, isLoading, data} = useSelector((state)=>state.auth)

  

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
      <Route path="/problem/:pid" element={isAuthenticated? <CodeEditor/> : <Navigate to="/login"/>}></Route>
      <Route path="/admin" element={isAuthenticated && data.role == "admin" ? <Admin/> : <Navigate to = "/login"/>}>
          <Route index element={<Dashboard/>}></Route>
          <Route path="create" element={<CreateProblem/>}></Route>
          <Route path="update" element={<UpdateProblem/>}></Route>
          <Route path="delete" element={<DeleteProblem/>}></Route>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
