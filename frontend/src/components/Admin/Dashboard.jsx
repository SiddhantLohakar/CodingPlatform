import React from 'react'
import ActionCard from '../ActionCard'
import {Plus, Pencil, Trash2} from "lucide-react"

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-gray-100">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-[90%] max-w-5xl">

        {/* CREATE */}
        <ActionCard
          icon={Plus}
          title="Create Problem"
          description="Add a new coding problem with test cases and constraints."
          buttonText="Create"
          color={{
            bg: "bg-green-600/20",
            text: "text-green-400",
            button: "bg-green-500 hover:bg-green-600"
          }}
          navlink = "/admin/create"
        />

        {/* UPDATE */}
        <ActionCard
          icon={Pencil}
          title="Update Problem"
          description="Modify existing problems, update constraints or test cases."
          buttonText="Update"
          color={{
            bg: "bg-blue-600/20",
            text: "text-blue-400",
            button: "bg-blue-500 hover:bg-blue-600"
          }}
          navlink = "/admin/update"
        />

        {/* DELETE */}
        <ActionCard
          icon={Trash2}
          title="Delete Problem"
          description="Remove problems permanently from the platform."
          buttonText="Delete"
          color={{
            bg: "bg-red-600/20",
            text: "text-red-400",
            button: "bg-red-500 hover:bg-red-600"
          }}
          navlink = "/admin/delete"
        />

      </div>
    </div>
  )
}

export default Dashboard
