import React from 'react'
import { useParams } from 'react-router'
import axiosClient from '../utils/axiosClient'
import { useState, useEffect } from 'react'

const Editor = () => {

  const {pid} = useParams()
  const [problem, setProblem] = useState([])

  useEffect(()=>{
     
    
    async function getProblem()
     {
        const p = await axiosClient.get(`/problem/getProblem/${pid}`);
        console.log(p);
     } 
     getProblem();
  }, [pid])


  return (
    <div>
      Hello Editor
    </div>
  )
}

export default Editor
