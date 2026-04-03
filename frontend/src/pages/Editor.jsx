import React from 'react'
import { useParams } from 'react-router'
import axiosClient from '../utils/axiosClient'
import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react';
import { reorderTabsInTree, addTabToPanel, removeTabFromTree, splitPanelInTree, cleanupEmptyPanels } from '../utils/CodeEditorUtils/Reorder';
import SortableTabs from '../utils/CodeEditorUtils/SortableTabs';
import RenderNode from '../utils/CodeEditorUtils/RenderNode';
import { DragOverlay, closestCenter, pointerWithin } from '@dnd-kit/core';
import { DndContext } from "@dnd-kit/core";
import { GripVertical } from 'lucide-react';

const CodeEditor = () => {
  const {pid} = useParams()
  const [problem, setProblem] = useState([])
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

  const tree = {
    type: "row",
    children: [
      {
        type: "panel",
        id: "left",
        tabs: ["description", "solutions", "editorial", "submissions"]
      },
      {
        type: "column",
        children: [
          {
            type: "panel",
            id: "rightTop",
            tabs: ["code", "result"]
          },
          {
            type: "panel",
            id: "rightBottom",
            tabs: ["testcases"]
          }
        ]
      }
    ]
  }
  
  const [layout, setLayout] = useState(tree)

  // Helper to find which panel contains a tab
  const findPanelWithTab = (node, tabId) => {
    if (node.type === "panel") {
      if (node.tabs.includes(tabId)) return node.id;
    }
    if (node.children) {
      for (const child of node.children) {
        const result = findPanelWithTab(child, tabId);
        if (result) return result;
      }
    }
    return null;
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    
    if (!active || !over) {
      setIsDragging(false);
      setHoveredPanel(null);
      setDropPosition(null);
      setActiveTab(null);
      return;
    }

    const draggedTab = active.id;
    const sourcePanel = findPanelWithTab(layout, draggedTab);
    
    setLayout(prev => {
      let updated = prev;

      // CASE 1: Dragging over another tab (reorder within same panel)
      if (over.id !== draggedTab && over.data?.current?.type === 'tab') {
        const targetPanel = findPanelWithTab(prev, over.id);
        
        // Only reorder if in the same panel
        if (sourcePanel === targetPanel) {
          updated = reorderTabsInTree(updated, draggedTab, over.id);
        } else {
          // Move to different panel and place before the target tab
          updated = removeTabFromTree(updated, draggedTab);
          updated = addTabToPanel(updated, targetPanel, draggedTab, over.id);
        }
      }
      // CASE 2: Dragging over a panel (add to end)
     else if (over.data?.current?.type === 'panel') {
        const targetPanel = over.id;

        // ✅ Always remove first
        updated = removeTabFromTree(updated, draggedTab);

        // ✅ fallback for null dropPosition
        if (!dropPosition || dropPosition === "center") {
          
          updated = addTabToPanel(updated, targetPanel, draggedTab);
        } else {
         
          updated = splitPanelInTree(updated, targetPanel, dropPosition, draggedTab);
        }
      }

      updated = cleanupEmptyPanels(updated);

      return updated;
    });

    setIsDragging(false);
    setHoveredPanel(null);
    setDropPosition(null);
    setActiveTab(null);
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setHoveredPanel(null);
    setDropPosition(null);
    setActiveTab(null);
  };

  useEffect(()=>{
    async function getProblem() {
      const p = await axiosClient.get(`/problem/getProblem/${pid}`);
     
    } 
    getProblem();
  }, [pid])

  const handleMouseMove = (e, panelId) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;
    const edgeThreshold = 0.25;

    let position = "center";
    if (x < width * edgeThreshold) position = "left";
    else if (x > width * (1 - edgeThreshold)) position = "right";
    else if (y < height * edgeThreshold) position = "top";
    else if (y > height * (1 - edgeThreshold)) position = "bottom";

    setHoveredPanel(panelId);
    setDropPosition(position);
  }

  return (
   <>
    <div className="h-screen box-border p-3 bg-black">
         <nav></nav>
        <div className="w-full h-full">
          <DndContext
            collisionDetection={pointerWithin}
            onDragStart={(event) => {
              setIsDragging(true);
              setActiveTab(event.active.id); 
            }}
            onDragMove={(event) => {          // ← ADD THIS
              const { activatorEvent, delta } = event;
              const x = activatorEvent.clientX + delta.x;
              const y = activatorEvent.clientY + delta.y;

              // Find which panel element is under the pointer
              const el = document.elementFromPoint(x, y);
              const panelEl = el?.closest("[data-panel-id]");
              
              if (panelEl) {
                const panelId = panelEl.getAttribute("data-panel-id");
                const rect = panelEl.getBoundingClientRect();
                const relX = x - rect.left;
                const relY = y - rect.top;
                const edgeThreshold = 0.25;
                let position = "center";
                if (relX < rect.width * edgeThreshold) position = "left";
                else if (relX > rect.width * (1 - edgeThreshold)) position = "right";
                else if (relY < rect.height * edgeThreshold) position = "top";
                else if (relY > rect.height * (1 - edgeThreshold)) position = "bottom";

                setHoveredPanel(panelId);
                setDropPosition(position);
              } else {
                setHoveredPanel(null);
                setDropPosition(null);
              }
            }}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <RenderNode 
              node={layout}
              handleMouseMove={handleMouseMove}
              isDragging={isDragging}
              setHoveredPanel={setHoveredPanel}
              hoveredPanel={hoveredPanel}
              dropPosition={dropPosition}
            />
            
            <DragOverlay style={{ pointerEvents: "none" }}>
              {activeTab ? (
                <div className="p-3 flex items-center gap-2 bg-[#3b3b3b] text-white rounded-md shadow-lg">
                  <GripVertical size={14} />
                  {activeTab}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
    </div>
   </>
  )
}

export default CodeEditor