import {Group, Panel, Separator} from "react-resizable-panels"
import React from "react";
import SortableTabs from "./SortableTabs";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import Editor from '@monaco-editor/react';
import {
  BookOpen,
  Code2,
  FileText,
  History,
  Terminal,
  CheckCircle2,
  XCircle,
  Clock,
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
  dropPosition,
  problem,
  code,
  setCode,
  language,
  setLanguage,
  activeTabs,
  setActiveTabs,
  testResults,
  submittedProblems
}) => {


  // 🔹 ROW → horizontal split
  if (node.type === "row") {
    return (
      <Group orientation="horizontal" className="h-full">
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
                problem={problem}
                code={code}
                setCode={setCode}
                language={language}
                setLanguage = {setLanguage}
                activeTabs={activeTabs}
                setActiveTabs={setActiveTabs}
                testResults={testResults}
                submittedProblems={submittedProblems}
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
      <Group orientation="vertical" className="h-full">
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
                problem={problem}
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                activeTabs={activeTabs}
                setActiveTabs={setActiveTabs}
                testResults={testResults}
                submittedProblems={submittedProblems}
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

    const activeTabId = activeTabs[node.id] || node.tabs[0];

    const renderTabContent = (tabId) => {
      if (!problem) return <div className="text-gray-400">Loading...</div>;
    
      switch (tabId) {
       case "description":
        return (
          <div className="prose prose-invert max-w-none ">
            <h2 className="text-2xl font-bold text-white mb-4">{problem?.title}</h2>
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded text-sm font-medium ${
                problem?.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                problem?.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {problem?.difficulty?.charAt(0).toUpperCase() + problem?.difficulty?.slice(1)}
              </span>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
                {problem?.tags}
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">{problem?.description}</p>
            
            {/* Visible Test Cases Section */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Examples</h3>
              <div className="space-y-4">
                {problem?.visibleTestCases?.map((tc, i) => (
                  <div key={i} className="bg-[#2a2a2a] rounded-lg border border-[#3d3d3d] overflow-hidden">
                    <div className="px-4 py-2 bg-[#1e1e1e] border-b border-[#3d3d3d]">
                      <span className="text-sm font-medium text-gray-300">Example {i + 1}</span>
                    </div>
                    <div className="p-4 space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400 font-medium">Input:</span>
                        <div className="mt-1 p-3 bg-[#1e1e1e] rounded text-gray-200 font-mono border border-[#3d3d3d]">
                          {tc.input}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 font-medium">Output:</span>
                        <div className="mt-1 p-3 bg-[#1e1e1e] rounded text-gray-200 font-mono border border-[#3d3d3d]">
                          {tc.output}
                        </div>
                      </div>
                      {tc.explaination && (
                        <div>
                          <span className="text-gray-400 font-medium">Explanation:</span>
                          <div className="mt-1 text-gray-300 leading-relaxed">
                            {tc.explaination}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
          
        case "testcases":
          return (
            <div>
              <h3 className="font-semibold text-white mb-4">Test Cases</h3>
              <div className="space-y-3">
                {problem?.visibleTestCases?.map((tc, i) => {
                  const result = testResults.find((_, idx) => idx === i);
                  return (
                    <div key={i} className="bg-[#1e1e1e] rounded-lg border border-[#3d3d3d] overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border-b border-[#3d3d3d]">
                        {result ? (
                          result.passed ? (
                            <CheckCircle2 size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-500" />
                        )}
                        <span className="text-sm font-medium text-gray-300">Case {i + 1}</span>
                      </div>
                      <div className="p-4 space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">Input:</span>
                          <div className="mt-1 p-2 bg-[#0d0d0d] rounded text-gray-200 font-mono">{tc.input}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Expected Output:</span>
                          <div className="mt-1 p-2 bg-[#0d0d0d] rounded text-gray-200 font-mono">{tc.output}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
    
        case "code":
          return (
            <div className="h-full min-h-0">
            <Editor
              height="100%"
              language={language === 'c++' ? 'cpp' : language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Consolas, Monaco, monospace',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                cursorStyle: 'line',
                wordWrap: 'on'
              }}
            />

            </div>
          );
    
        case "result":
          if (testResults.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Clock size={48} className="mb-4 opacity-50" />
                <p>Run your code to see results</p>
              </div>
            );
          }

          const passedCount = testResults.filter(t => t.passed).length;
          const totalCount = testResults.length;

          return (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Test Results</h3>
                <p className={`text-lg font-semibold ${passedCount === totalCount ? 'text-green-400' : 'text-red-400'}`}>
                  {passedCount} / {totalCount} test cases passed
                </p>
              </div>
              <div className="space-y-3">
                {testResults.map((result, i) => (
                  <div 
                    key={i} 
                    className={`bg-[#1e1e1e] rounded-lg border ${
                      result.passed ? 'border-green-500/30' : 'border-red-500/30'
                    } overflow-hidden`}
                  >
                    <div className={`flex items-center gap-2 px-4 py-2 ${
                      result.passed ? 'bg-green-500/10' : 'bg-red-500/10'
                    } border-b ${
                      result.passed ? 'border-green-500/30' : 'border-red-500/30'
                    }`}>
                      {result.passed ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        result.passed ? 'text-green-400' : 'text-red-400'
                      }`}>
                        Test Case {i + 1} - {result.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <div className="p-4 space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Input:</span>
                        <div className="mt-1 p-2 bg-[#0d0d0d] rounded text-gray-200 font-mono">{result.input}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Expected:</span>
                        <div className="mt-1 p-2 bg-[#0d0d0d] rounded text-gray-200 font-mono">{result.output}</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Your Output:</span>
                        <div className={`mt-1 p-2 bg-[#0d0d0d] rounded font-mono ${
                          result.passed ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {result.actualOutput}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
    
        case "solutions":
          const solution = problem?.referenceSolution?.find(c => c.language === language);
          return (
            <div>
              <h3 className="font-semibold text-white mb-4">Reference Solution</h3>
              <Editor
                height="500px"
                language={language === 'c++' ? 'cpp' : language}
                value={solution?.completeCode || 'No solution available for this language'}
                theme="vs-dark"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'Consolas, Monaco, monospace',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          );

        case "editorial":
          return (
            <div className="text-gray-300">
              <h3 className="font-semibold text-white mb-4">Editorial</h3>
              <p>Editorial content coming soon...</p>
            </div>
          );

        case "submissions":
          return (
            <div className="text-gray-300">
              <h3 className="font-semibold text-white mb-4">Submissions</h3>

              {
                 submittedProblems?.length === 0 ? (
                <div className="text-center text-gray-400 mt-6">
                  No submissions yet. Submit your code to see history.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {submittedProblems?.map((submission, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-[#1e1e1e] hover:bg-[#2a2a2a] transition-all p-4 rounded-xl shadow-md border border-gray-700"
                    >
                      {/* LEFT: LANGUAGE + INFO */}
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-purple-400">
                          {submission.language.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-400">
                          Submission #{index + 1}
                        </span>
                      </div>

                      {/* RIGHT: STATUS */}
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            submission.status === "accepted"
                              ? "bg-green-900 text-green-400"
                              : "bg-red-900 text-red-400"
                          } hover:cursor-pointer hover:underline`}
                           onClick={()=>{
                            setCode(submission.inputCode)
                            setLanguage(submission.language)  
                          }}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                )
              }
              
            </div>
          );
    
        default:
          return <div className="text-gray-400">No content</div>;
      }
    };

    const isActivePanel = isOver;
    return (
      <div 
        ref={setNodeRef}
        data-panel-id={node.id}   
        className={`h-full bg-[#1e1e1e] text-white relative overflow-hidden flex flex-col transition-all ${
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

        {/* Tab Bar */}
        <div className="bg-[#2a2a2a] flex items-center border-b border-[#3d3d3d]">
          <SortableContext
            items={node.tabs}
            strategy={horizontalListSortingStrategy}
          >
            {node.tabs.map((tabId) => {
              const tab = tabMap[tabId];
              const isActive = activeTabId === tabId;
              return (
                <SortableTabs 
                  key={tabId} 
                  tab={{ ...tab, id: tabId }} 
                  isActive={isActive}
                  onClick={() => setActiveTabs(prev => ({ ...prev, [node.id]: tabId }))}
                />
              );
            })}
          </SortableContext>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-auto min-h-0">
          {node.tabs.length > 0
            ? renderTabContent(activeTabId)
            : <div className="text-gray-400">Empty Panel</div>}
        </div>
      </div>
    );
  }
};

export default RenderNode;