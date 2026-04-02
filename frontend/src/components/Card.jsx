import React from 'react'


const colorVariants = {
  violet: {
    gradientFrom: "from-violet-500/10",
    border: "border-violet-500/20",
    text: "text-violet-400",
    bg: "bg-violet-500/20",
    hoverShadow: "hover:shadow-violet-500/20"
  },
  fuchsia: {
    gradientTo: "to-fuchsia-500/10"
  },

  emerald: {
    gradientFrom: "from-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500/20",
    hoverShadow: "hover:shadow-emerald-500/20"
  },
  teal: {
    gradientTo: "to-teal-500/10"
  },

  amber: {
    gradientFrom: "from-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500/20",
    hoverShadow: "hover:shadow-amber-500/20"
  },
  orange: {
    gradientTo: "to-orange-500/10"
  }
};


const Card = ({color, toColor, description, name, start,icon: Icon}) => {
   
  return (
    <div className={`bg-linear-to-br from-${color}-500/10 to-${toColor}-500/10 border border-${color}-500/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-${color}-500/20`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-3 bg-${color}-500/20 rounded-xl group-hover:bg-${color}-500/30 transition-colors ` }>
                <Icon className={`w-6 h-6 text-${color}-400`} />
              </div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
            </div>
            <p className="text-gray-400 text-lg">{description}</p>
            <div className={`mt-4 flex items-center gap-2 text-${color}-400 text-sm font-medium`}>
              <span>{start}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
    </div>
  )
}

export default Card
