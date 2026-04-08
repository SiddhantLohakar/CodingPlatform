import React from "react";
import { NavLink } from "react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";


const ActionCard = ({ icon: Icon, title, description, buttonText, color, navlink }) => {
  return (
    <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6 transition-all hover:shadow-2xl hover:scale-[1.02]">

      {/* ICON */}
      <div className={`p-4 rounded-full ${color.bg}`}>
        <Icon size={34} className={color.text} />
      </div>

      {/* TITLE */}
      <h2 className="text-xl font-semibold text-white text-center">
        {title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-sm text-center">
        {description}
      </p>

      {/* BUTTON */}
      <NavLink
        to={navlink}
        className={`w-full ${color.button} text-white font-medium py-2.5 rounded-lg shadow-md transition-all hover:scale-[1.02] text-center`}
      >
        {buttonText}
      </NavLink>
    </div>
  );
};

export default ActionCard;