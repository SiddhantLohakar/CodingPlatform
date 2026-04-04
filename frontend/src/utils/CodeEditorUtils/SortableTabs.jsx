import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SortableTabs = ({ tab, isActive, onClick }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging 
  } = useSortable({
    id: tab.id,
    data: {
      type: 'tab',
      tabId: tab.id
    }
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    opacity: isDragging ? 0 : 1,
  };

  const Icon = tab.icon;

  return (
    <button
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`px-4 py-2.5 flex gap-2 items-center border-b-2 transition-all ${
        isActive 
          ? 'bg-[#1e1e1e] border-[#00a67e] text-white' 
          : 'bg-[#2a2a2a] border-transparent text-gray-400 hover:bg-[#333333] hover:text-gray-200'
      }`}
    >
      {/* DRAG HANDLE */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={14} className="opacity-50 hover:opacity-100" />
      </span>

      {/* CLICKABLE AREA */}
      <span className="flex gap-2 items-center text-sm font-medium">
        <Icon size={16} color={isActive ? tab.color : 'currentColor'} />
        {tab.label}
      </span>
    </button>
  )
}

export default SortableTabs