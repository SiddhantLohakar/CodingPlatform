import { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Homepage from './pages/Homepage'



function App() {
  const [count, setCount] = useState(0)

  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<Homepage/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Signup/>}></Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
