import React from 'react'

const StatusCard = ({color, label, value, icon: Icon}) => {
  return (
    <div className='bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/70 transition-colors w-full min-h-25'>
        <div className="flex items-center justify-between">
                <div className=''>
                  <p className="text-gray-400 text-sm mb-1">{label}</p>
                  <p className="text-2xl font-bold text-white">{value}</p>
                </div>
                <Icon className={`w-8 h-8 ${color}`} />
              </div>
    </div>
      
  )
}

export default StatusCard
