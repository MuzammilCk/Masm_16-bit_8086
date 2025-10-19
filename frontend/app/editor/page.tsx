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
        {/* Left: Editor */}
        <ResizablePanel
          defaultSize={showAI ? 50 : 70}
          minSize={30}
          maxSize={80}
        >
          <div className="h-full flex flex-col">
            <CodeEditor />
          </div>
        </ResizablePanel>
        
        {/* Middle: Execution Output */}
        <ResizablePanel
          defaultSize={showAI ? 30 : 30}
          minSize={20}
          maxSize={60}
        >
          <ExecutionPanel />
        </ResizablePanel>
        
        {/* Right: AI Chat */}
        {showAI && (
          <ResizablePanel
            defaultSize={20}
            minSize={15}
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
