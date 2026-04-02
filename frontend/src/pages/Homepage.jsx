import React from 'react'
import Navbar from '../components/Navbar'
import Card from '../components/Card'
import StatusCard from '../components/StatusCard'
import { Code, Calendar, BookOpen, CheckCircle, Flame, Trophy, Search, Circle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axiosClient from '../utils/axiosClient'
import difficultyColors from '../utils/difficultyColors'
import { Link } from 'react-router'

const cardArray = [
  {
    color: "violet",
    toColor: "fuchsia",
    icon: Code,
    name: "DSA Visualizer",
    description: "Visualize algorithms and data structures in real-time",
    start: "Explore"
  },
  {
    color: "emerald",
    toColor: "teal",
    icon: Calendar,
    name: "183 Days",
    description: "Curated course to master coding interviews",
    start: "Start Learning"
  },
  {
    color: "amber",
    toColor: "orange",
    icon: BookOpen,
    name: "Revision",
    description: "Review previously solved problems and notes",
    start: "Review Now"
  }
]


 const stats = [
    { label: "Problems Solved", value: "0", icon: CheckCircle, color: "text-emerald-400" },
    { label: "Current Streak", value: "0", icon: Flame, color: "text-orange-400" },
    { label: "Rank", value: "#1", icon: Trophy, color: "text-yellow-400" },
  ];

const Homepage = () => {

  // Variables 
  const [solvedProblems, setSolvedProblems] =  useState([]); 
  const [allProblems, setAllProblems] = useState([])
  const [filters, setFilters] =  useState({
    difficulty : "all",
    status: "all",
    topics: "all",
    search: ""
  })
  const {data} = useSelector((state) => state.auth)
  

  // fetching data
  useEffect( ()=>{
    async function getSolvedProblem()
    {
       const sp = await axiosClient.get("/problem/getSolvedProblemByUser");
       setSolvedProblems(sp.data);
    }

    async function getAllProblems()
    {
        const ap = await axiosClient.get("/problem/getAllProblems", {
          params: {
          page: 1,
          limit: 20
          }
        })


       setAllProblems(ap.data.data);
    }
   
    getSolvedProblem(); 
    getAllProblems();

  },[data])


  // filtering logic
  const filteredProblems =  allProblems.filter((value)=>{
      
      const diff = filters.difficulty == "all" || filters.difficulty == value.difficulty;
      const status = filters.status == "all" || solvedProblems.some((sol) => {return (sol._id === value._id)});
      const topics = filters.topics == "all" || value.tags == filters.topics
      const search = filters.search == "" || value.title.toLowerCase().includes(filters.search.toLowerCase())
     
     return diff && status && topics && search;
  })  

  // filtering based on the solved or not
  const filteredProblemsWithSolved = filteredProblems.map((value)=>{
      const isSolved  = solvedProblems.some((sol)=>{return (sol._id === value._id)});
      return {...value, isSolved};
  })

  
  // functions for the filterchanges


  const handleDifficultyChange = (e) =>{
    // setting new filters
    setFilters((prev)=>{
        return {...prev,  difficulty: e.target.value}
    })
  }

  const handleTopicChange = (e) =>{
    // setting new filters
    setFilters((prev)=>{
        return {...prev,  topics: e.target.value}
    })
  }
  
  const handleStatusChange = (e) =>{
    // setting new filters
    setFilters((prev)=>{
        return {...prev,  status: e.target.value}
    })
  }

  const handleSearch =  (e)=>{
    setFilters((prev)=>{
        return {...prev,  search: e.target.value}
    })
  }




  // Function for the handling click on any problem
  const goToProblem = (id)=>{

  }



  return (
    <div className='min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100'>
      
    <Navbar/>
     <div className="flex flex-col sm:flex-row max-w-7xl mx-auto px-6 py-8 gap-5">
      {
        cardArray.map((card)=>{
          return <Card key={card.name} color={card.color} toColor={card.toColor} start={card.start} description={card.description} name={card.name} icon = {card.icon}></Card>
        })
      }

     </div>
     <div className="flex flex-col sm:flex-row max-w-7xl mx-auto px-6 py-8 gap-5">
      {
        stats.map((stat)=>{
          return <StatusCard key={stat.label} color = {stat.color} value = {stat.value} label = {stat.label} icon = {stat.icon} />
        })
      }
     </div>

     <div className='flex flex-col sm:flex-row max-w-7xl mx-auto px-6 py-8 gap-3'>
      <div className='flex-2 relative'>
        <input type="text" className = "outline-gray-600 rounded-md w-full p-2 border pl-10" placeholder='Search for problems' onChange={handleSearch}/>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'/>
      </div>
      <div  className='flex-1'>
        <select name="difficulty" id="difficulty"  className='outline-gray-600 rounded-md w-full p-2 border  pr-8 bg-slate-800' onChange={handleDifficultyChange}>
          <option value="all">Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
      <div  className='flex-1' onChange={handleStatusChange}>
        <select name="Problems" id="problem"  className='outline-gray-600 rounded-md w-full p-2 border pr-8 bg-slate-800'>
          <option value="all">All Problem</option>
          <option value="solved">Solved Problem</option>
        </select>
      </div>
      <div  className='flex-1'  onChange={handleTopicChange}>
        <select name="topics" id="topics"  className='outline-gray-600 rounded-md w-full p-2 border pr-8 bg-slate-800'>
          <option value="all">Topic</option>
          <option value="array">array</option>
          <option value="graph">graph</option>
          <option value="linkedList">linkedList</option>
          <option value="dp">dp</option>
          <option value="stack">stack</option>
          <option value="queue">queue</option>
          <option value="string">string</option>

        </select>
      </div>
     </div>
    
    
   

    
     <div className='max-w-7xl mx-auto  px-6 py-8'>
       <div className='bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden p-3'>

       
        <table className='w-full'>
          <thead className='bg-slate-900 border-b border-slate-700'>
            <tr className='text-1.5xl'>
              <th>STATUS</th>
              <th>NAME</th>
              <th>DIFFICULTY</th>
              <th>TOPICS</th>
            </tr>
          </thead>
          <tbody>
            {
              filteredProblemsWithSolved.map((value)=>{
                return (
                   <tr  className='text-lg' key={value._id}>
                    <td className='p-6'>{value.isSolved ? <CheckCircle className='text-emerald-400 mx-auto'/> : <Circle className='text-red-400 mx-auto'/> }</td>
                    <td className='text-center hover:text-blue-400 hover:cursor-pointer' ><Link to = {`/problem/${value._id}`}>{value.title}</Link></td>
                    <td className='text-center'><span className= {`${difficultyColors[value.difficulty]} rounded-md p-1 w-[50%] inline-block`}>{value.difficulty}</span></td>
                    <td className='text-center'>{value.tags}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        </div>
     </div>
    
    </div>
  )
}

export default Homepage
