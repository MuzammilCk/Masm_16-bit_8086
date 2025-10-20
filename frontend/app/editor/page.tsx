"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { ExecutionPanel } from "@/components/execution/ExecutionPanel";
import { AIChat } from "@/components/ai/AIChat";
import { ResizablePanel } from "@/components/ui/resizable-panel";
import { useEditorStore } from "@/store/editorStore";
import { useExecutionStore } from "@/store/executionStore";

export default function EditorPage() {
  const { code, setCode } = useEditorStore();
  const { isExecuting } = useExecutionStore();
  const [showAI, setShowAI] = useState(true);
  const [showOutput, setShowOutput] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar 
        onToggleAI={() => setShowAI(!showAI)} 
        onToggleOutput={() => setShowOutput(!showOutput)}
        showAI={showAI}
        showOutput={showOutput}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor */}
        <ResizablePanel
          defaultSize={!showOutput && !showAI ? 100 : !showOutput ? 70 : !showAI ? 60 : 40}
          minSize={30}
          maxSize={100}
        >
          <div className="h-full flex flex-col bg-background">
            <div className="h-10 border-b border-border flex items-center px-4">
              <h3 className="text-sm font-semibold">Code Editor</h3>
            </div>
            <div className="flex-1">
              <CodeEditor />
            </div>
          </div>
        </ResizablePanel>
        
        {/* Middle: Execution Output */}
        {showOutput && (
          <ResizablePanel
            defaultSize={showAI ? 35 : 40}
            minSize={20}
            maxSize={60}
          >
            <ExecutionPanel />
          </ResizablePanel>
        )}
        
        {/* Right: AI Chat */}
        {showAI && (
          <ResizablePanel
            defaultSize={25}
            minSize={20}
            maxSize={40}
          >
            <AIChat />
          </ResizablePanel>
        )}
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
