"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { ExecutionPanel } from "@/components/execution/ExecutionPanel";
import { AIChat } from "@/components/ai/AIChat";
import { ResizablePanel } from "@/components/ui/resizable-panel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Terminal, Sparkles, Bug, Code, Menu } from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { useExecutionStore } from "@/store/executionStore";
import { RegisterPanel } from "@/components/debug/RegisterPanel";
import { FlagsPanel } from "@/components/debug/FlagsPanel";
import { MemoryViewer } from "@/components/debug/MemoryViewer";

type MobileTab = 'editor' | 'output' | 'ai';

export default function EditorPage() {
  const router = useRouter();
  const { code, setCode } = useEditorStore();
  const { isExecuting, executionResult } = useExecutionStore();
  const [showAI, setShowAI] = useState(false);
  const [showOutput, setShowOutput] = useState(true);
  const [showEditor, setShowEditor] = useState(true);
  const [showDebug, setShowDebug] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('editor');
  
  // Auto-show debug panel when executionResult is available
  useEffect(() => {
    if (executionResult && executionResult.success) {
      console.log('🐛 Debug: Execution result received:', executionResult);
      console.log('🐛 Debug: Registers:', executionResult.registers);
      console.log('🐛 Debug: Flags:', executionResult.flags);
      console.log('🐛 Debug: Memory:', executionResult.memory);
      setShowDebug(true);
    }
  }, [executionResult]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check if student is logged in
  useEffect(() => {
    const savedToken = localStorage.getItem("studentToken");
    if (!savedToken) {
      // Not logged in - redirect to login
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Don't render editor until authentication check is complete
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Toolbar */}
      <Toolbar 
        onToggleAI={() => setShowAI(!showAI)} 
        onToggleOutput={() => setShowOutput(!showOutput)}
        onToggleDebug={() => setShowDebug(!showDebug)}
        showAI={showAI}
        showOutput={showOutput}
        showDebug={showDebug}
      />
      
      {/* Mobile Tabs */}
      {isMobile && (
        <div className="flex border-b border-border bg-muted/30 shrink-0">
          <button
            onClick={() => setMobileTab('editor')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'editor'
                ? 'text-primary border-b-2 border-primary bg-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="h-4 w-4" />
            Editor
          </button>
          <button
            onClick={() => setMobileTab('output')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'output'
                ? 'text-primary border-b-2 border-primary bg-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Output
          </button>
          <button
            onClick={() => setMobileTab('ai')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              mobileTab === 'ai'
                ? 'text-primary border-b-2 border-primary bg-background'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            AI
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden md:flex-row flex-col min-h-0">
        {/* Left: Code Editor */}
        {(isMobile ? mobileTab === 'editor' : showEditor) && (
          <ResizablePanel
            defaultSize={!showOutput && !showAI ? 100 : !showOutput ? 70 : !showAI ? 50 : 40}
            minSize={30}
            maxSize={100}
            className={isMobile ? 'w-full' : ''}
          >
            <div className="h-full flex flex-col bg-background">
              {!isMobile && (
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
              )}
              <div className="flex-1">
                <CodeEditor />
              </div>
            </div>
          </ResizablePanel>
        )}
        
        {/* Middle: Execution Output */}
        {(isMobile ? mobileTab === 'output' : showOutput) && (
          <ResizablePanel
            defaultSize={
              !showEditor && !showAI ? 100 :
              !showEditor ? 70 :
              !showAI ? 50 :
              35
            }
            minSize={20}
            maxSize={100}
            className={isMobile ? 'w-full' : ''}
          >
            <ExecutionPanel onCollapse={() => !isMobile && setShowOutput(false)} />
          </ResizablePanel>
        )}
        
        {/* Right: AI Chat */}
        {(isMobile ? mobileTab === 'ai' : showAI) && (
          <ResizablePanel
            defaultSize={
              !showEditor && !showOutput ? 100 :
              !showEditor ? 30 :
              !showOutput ? 40 :
              25
            }
            minSize={20}
            maxSize={100}
            className={isMobile ? 'w-full' : ''}
          >
            <AIChat onCollapse={() => !isMobile && setShowAI(false)} />
          </ResizablePanel>
        )}
        
        {/* Floating Expand Buttons - Desktop Only */}
        {!isMobile && (
          <>
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
            
            {/* Debug Panel Toggle Button */}
            {!showDebug && executionResult && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowDebug(true)}
                className="fixed bottom-20 right-4 z-50 shadow-lg"
                title="Show Debug Panels"
              >
                <Bug className="h-4 w-4 mr-2" />
                Debug
                <ChevronLeft className="h-4 w-4 ml-2" />
              </Button>
            )}
          </>
        )}
      </div>
      
      {/* Debug Panels (Bottom Section) */}
      {showDebug && executionResult && (
        <div className={`border-t border-border bg-background shrink-0 ${
          isMobile ? 'h-96' : 'h-80'
        }`}>
          <div className="h-full flex flex-col">
            {/* Debug Header */}
            <div className="h-10 border-b border-border flex items-center justify-between px-4 bg-muted/30 shrink-0">
              <div className="flex items-center gap-2">
                <Bug className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Debug Information</h3>
                <span className="text-xs text-muted-foreground">
                  ({Object.keys(executionResult.registers || {}).length} registers)
                </span>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowDebug(false)}
                className="h-6 w-6"
                title="Hide debug panels"
              >
                <ChevronLeft className="h-4 w-4 rotate-90" />
              </Button>
            </div>
            
            {/* Debug Content Grid - Responsive */}
            <div className={`flex-1 gap-4 p-4 overflow-auto ${
              isMobile ? 'flex flex-col' : 'grid grid-cols-3'
            }`}>
              <RegisterPanel 
                registers={executionResult.registers || {}}
              />
              <FlagsPanel 
                flags={executionResult.flags || {}}
              />
              <MemoryViewer 
                memory={executionResult.memory || []}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Status Bar */}
      <StatusBar />
    </div>
  );
}
