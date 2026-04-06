import React from 'react'
import { useParams } from 'react-router'
import axiosClient from '../utils/axiosClient'
import { useState, useEffect } from 'react'
import Editor from '@monaco-editor/react';
import { reorderTabsInTree, addTabToPanel, removeTabFromTree, splitPanelInTree, cleanupEmptyPanels } from '../utils/CodeEditorUtils/Reorder';
import RenderNode from '../utils/CodeEditorUtils/RenderNode';
import { DragOverlay, closestCenter, pointerWithin } from '@dnd-kit/core';
import { DndContext } from "@dnd-kit/core";
import { GripVertical } from 'lucide-react';
import { ChevronLeft, Play, Upload } from 'lucide-react';
import { getProblem, getSubmittedProblem } from '../utils/CodeEditorUtils/ProblemsFetching';

const CodeEditor = () => {
  const {pid} = useParams()
  const [problem, setProblem] = useState({})
  const [hoveredPanel, setHoveredPanel] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [activeTabs, setActiveTabs] = useState({
    left: 'description',
    rightTop: 'code',
    rightBottom: 'testcases'
  });
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProblems, setSubmittedProblems] = useState([]);


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

  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTabs(prev => ({ ...prev, rightTop: 'result' }));
    
    try {
      const response = await axiosClient.post('/submission/run', {
        problemId: pid,
        inputCode: code,
        language: language
      });
      
      setTestResults(response.data);
    } catch (error) {
      console.error('Error running code:', error);
      alert('Failed to run code. Please try again.');
      setTestResults([]);
    } finally {
      setIsRunning(false);
    }
  };



const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    const response = await axiosClient.post('/submission/submit', {
      problemId: pid,
      inputCode: code,
      language: language
    });
    
    // Show success/failure message
    if (response.data.status === 'accepted') {
      alert(`✅ ${response.data.message}\n\nRuntime: ${response.data.runtime}s\nMemory: ${response.data.memory} KB`);
    } else {
      alert(`❌ ${response.data.message}\n\nPlease review your code and try again.`);
    }
    
    // Optionally switch to submissions tab
    setActiveTabs(prev => ({ ...prev, left: 'submissions' }));
    
  } catch (error) {
    console.error('Error submitting code:', error);
    alert('Failed to submit code. Please try again.');
  } finally {
    const sProblem = getSubmittedProblem(pid);
    setIsSubmitting(false);
    setSubmittedProblems(sProblem.data);

  }
};
    
    


  useEffect(()=>{

    async function fetchData() {
    // 🔹 get problem
    const problem = await getProblem({pid, language});
    setProblem(problem.data);
    setCode(problem.initialCode);

    // 🔹 get submissions
    const sProblem = await getSubmittedProblem(pid);
    setSubmittedProblems(sProblem.data);
  }

  fetchData();

  }, [pid])



  useEffect(() => {
    // Update code when language changes
    if (problem?.startCode) {
      const newCode = problem.startCode.find(c => c.language === language)?.initialCode || '';
      setCode(newCode);
    }
  }, [language, problem]);



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
   <div className="h-screen flex flex-col bg-[#1a1a1a] overflow-hidden">
      {/* Navbar */}
      <nav className="h-14 bg-[#282828] border-b border-[#3d3d3d] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-white font-semibold text-lg">Nexus Code</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#3d3d3d] text-white px-3 py-1.5 rounded text-sm border border-[#4d4d4d] focus:outline-none focus:border-[#00a67e]"
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>
          
          <button 
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-[#3d3d3d] hover:bg-[#4d4d4d] text-white px-4 py-1.5 rounded text-sm font-medium transition disabled:opacity-50"
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run'}
          </button>
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || isRunning}
            className="flex items-center gap-2 bg-[#00a67e] hover:bg-[#00c896] text-white px-4 py-1.5 rounded text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={16} />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </nav>
 
      {/* Main Content */}
      <div className="flex-1 p-3 min-h-0">
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={(event) => {
            setIsDragging(true);
            setActiveTab(event.active.id); 
          }}
          onDragMove={(event) => {
            const { activatorEvent, delta } = event;
            const x = activatorEvent.clientX + delta.x;
            const y = activatorEvent.clientY + delta.y;
 
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
            handleMouseMove={() => {}}
            isDragging={isDragging}
            setHoveredPanel={setHoveredPanel}
            hoveredPanel={hoveredPanel}
            dropPosition={dropPosition}
            problem={problem}
            code={code}
            setCode={setCode}
            language={language}
            setLanguage = {setLanguage}
            activeTabs={activeTabs}
            setActiveTabs={setActiveTabs}
            testResults={testResults}
            submittedProblems = {submittedProblems}
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
  )
}

export default CodeEditor