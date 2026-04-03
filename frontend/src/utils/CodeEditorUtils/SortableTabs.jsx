import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const SortableTabs = ({ tab }) => {
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
    opacity: isDragging ? 0 : 1, // Hide original when dragging (DragOverlay shows copy)
  };

  const Icon = tab.icon;

  return (
    <button
      ref={setNodeRef}
      style={style}
      className="p-3 hover:bg-[#3b3b3b] flex gap-2 items-center"
    >
      {/* DRAG HANDLE */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} />
      </span>

      {/* CLICKABLE AREA */}
      <span className="flex gap-1 items-center">
        <Icon size={20} color={tab.color} />
        {tab.label}
      </span>
    </button>
  )
}

export default SortableTabs