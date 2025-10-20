"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { ExecutionPanel } from "@/components/execution/ExecutionPanel";
import { AIChat } from "@/components/ai/AIChat";
import { ResizablePanel } from "@/components/ui/resizable-panel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Terminal, Sparkles } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { useExecutionStore } from "@/store/executionStore";

export default function EditorPage() {
  const { code, setCode } = useEditorStore();
  const { isExecuting } = useExecutionStore();
  const [showAI, setShowAI] = useState(true);
  const [showOutput, setShowOutput] = useState(true);
  const [showEditor, setShowEditor] = useState(true);

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
        {showEditor && (
          <ResizablePanel
            defaultSize={!showOutput && !showAI ? 100 : !showOutput ? 70 : !showAI ? 60 : 40}
            minSize={30}
            maxSize={100}
          >
            <div className="h-full flex flex-col bg-background">
              <div className="h-10 border-b border-border flex items-center justify-between px-4">
                <h3 className="text-sm font-semibold">Code Editor</h3>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setShowEditor(false)}
                  className="h-6 w-6"
                  title="Collapse panel"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex-1">
                <CodeEditor />
              </div>
            </div>
          </ResizablePanel>
        )}
        
        {/* Middle: Execution Output */}
        {showOutput && (
          <ResizablePanel
            defaultSize={
              !showEditor && !showAI ? 100 :
              !showEditor ? 70 :
              !showAI ? 60 :
              35
            }
            minSize={20}
            maxSize={100}
          >
            <ExecutionPanel onCollapse={() => setShowOutput(false)} />
          </ResizablePanel>
        )}
        
        {/* Right: AI Chat */}
        {showAI && (
          <ResizablePanel
            defaultSize={
              !showEditor && !showOutput ? 100 :
              !showEditor ? 30 :
              !showOutput ? 40 :
              25
            }
            minSize={20}
            maxSize={100}
          >
            <AIChat onCollapse={() => setShowAI(false)} />
          </ResizablePanel>
        )}
        
        {/* Floating Expand Buttons */}
        {!showEditor && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowEditor(true)}
            className="fixed bottom-32 left-4 z-50 shadow-lg"
            title="Show Code Editor"
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Code Editor
          </Button>
        )}
        
        {!showOutput && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowOutput(true)}
            className="fixed bottom-20 right-4 z-50 shadow-lg"
            title="Show Execution Output"
          >
            <Terminal className="h-4 w-4 mr-2" />
            Output
            <ChevronLeft className="h-4 w-4 ml-2" />
          </Button>
        )}
        
        {!showAI && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowAI(true)}
            className="fixed bottom-8 right-4 z-50 shadow-lg"
            title="Show AI Assistant"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI Assistant
            <ChevronLeft className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
