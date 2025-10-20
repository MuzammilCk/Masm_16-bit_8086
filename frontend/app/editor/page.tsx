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

const DEFAULT_CODE = `ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    OPR1 DB 20H
    OPR2 DB 30H
    RES DW ?
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, OPR1
    ADD AL, OPR2
    MOV AH, 00H
    MOV RES, AX
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START`;

export default function EditorPage() {
  const { code, setCode } = useEditorStore();
  const { isExecuting } = useExecutionStore();
  const [showAI, setShowAI] = useState(true);

  // Initialize with default code if empty
  if (!code) {
    setCode(DEFAULT_CODE);
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Toolbar */}
      <Toolbar onToggleAI={() => setShowAI(!showAI)} />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Code Editor */}
        <ResizablePanel
          defaultSize={showAI ? 40 : 60}
          minSize={30}
          maxSize={70}
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
        <ResizablePanel
          defaultSize={showAI ? 35 : 40}
          minSize={20}
          maxSize={60}
        >
          <ExecutionPanel />
        </ResizablePanel>
        
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
