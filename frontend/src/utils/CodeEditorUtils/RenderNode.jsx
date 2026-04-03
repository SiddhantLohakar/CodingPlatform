import {Group, Panel, Separator} from "react-resizable-panels"
import React from "react";
import SortableTabs from "./SortableTabs";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  BookOpen,
  Code2,
  FileText,
  History,
  Terminal,
} from "lucide-react";

const tabMap = {
  description: { label: "Description", icon: FileText, color: "#007bff" },
  solutions: { label: "Solutions", icon: Code2, color: "#007bff" },
  editorial: { label: "Editorial", icon: BookOpen, color: "#ffb700" },
  submissions: { label: "Submissions", icon: History, color: "#007bff" },
  code: { label: "Code", icon: Code2, color: "#00ffcc" },
  result: { label: "Result", icon: Terminal, color: "#00ffcc" },
  testcases: { label: "Test Cases", icon: FileText, color: "#00ffcc" }
};

const RenderNode = ({ 
  node,
  handleMouseMove,
  isDragging,
  setHoveredPanel,
  hoveredPanel,
  dropPosition 
}) => {

  // 🔹 ROW → horizontal split
  if (node.type === "row") {
    return (
      <Group orientation="horizontal">
        {node.children.map((child, index) => (
          <React.Fragment key={index}>
            <Panel>
              <RenderNode 
                node={child}
                handleMouseMove={handleMouseMove}
                isDragging={isDragging}
                setHoveredPanel={setHoveredPanel}
                hoveredPanel={hoveredPanel}
                dropPosition={dropPosition} 
              />
            </Panel>
            {index < node.children.length - 1 && (
              <Separator className="w-2 bg-black hover:bg-blue-500" />
            )}
          </React.Fragment>
        ))}
      </Group>
    );
  }

  // 🔹 COLUMN → vertical split
  if (node.type === "column") {
    return (
      <Group orientation="vertical">
        {node.children.map((child, index) => (
          <React.Fragment key={index}>
            <Panel>
              <RenderNode 
                node={child}
                handleMouseMove={handleMouseMove}
                isDragging={isDragging}
                setHoveredPanel={setHoveredPanel}
                hoveredPanel={hoveredPanel}
                dropPosition={dropPosition}
              />
            </Panel>
            {index < node.children.length - 1 && (
              <Separator className="h-2 bg-black hover:bg-blue-500" />
            )}
          </React.Fragment>
        ))}
      </Group>
    );
  }

  // 🔹 PANEL → actual UI with droppable area
  if (node.type === "panel") {
    const { setNodeRef, isOver } = useDroppable({
      id: node.id,
      data: {
        type: 'panel',
        panelId: node.id
      }
    });
    const isActivePanel = isOver;
    return (
      <div 
        ref={setNodeRef}
        data-panel-id={node.id}   
        className={`h-full bg-[#262626] text-white relative overflow-hidden transition-all ${
          isOver ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        {isDragging && isActivePanel && dropPosition && (
        <div className="absolute inset-0 pointer-events-none z-50">

          {dropPosition === "center" && (
            <div className="absolute inset-0 border-2 border-blue-500 bg-blue-500/10" />
          )}

          {dropPosition === "left" && (
            <div className="absolute left-0 top-0 h-full w-1/3 bg-blue-500/20 border-l-4 border-blue-500" />
          )}

          {dropPosition === "right" && (
            <div className="absolute right-0 top-0 h-full w-1/3 bg-blue-500/20 border-r-4 border-blue-500" />
          )}

          {dropPosition === "top" && (
            <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-500/20 border-t-4 border-blue-500" />
          )}

          {dropPosition === "bottom" && (
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-500/20 border-b-4 border-blue-500" />
          )}

        </div>
      )}
        <div className="bg-[#333333] flex items-center">
          <SortableContext
            items={node.tabs}
            strategy={horizontalListSortingStrategy}
          >
            {node.tabs.map((tabId) => {
              const tab = tabMap[tabId];
              return (
                <SortableTabs key={tabId} tab={{ ...tab, id: tabId }} />
              );
            })}
          </SortableContext>
        </div>

        {/* 🔹 CONTENT AREA */}
        <div className="flex-1 p-4">
          {node.tabs.length > 0
            ? `Showing: ${node.tabs[0]}`
            : "Empty Panel"}
        </div>
      </div>
    );
  }
};

export default RenderNode;