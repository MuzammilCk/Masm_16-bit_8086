"use client";

import { Button } from "@/components/ui/button";
import { Play, Square, Settings, PanelRightClose, PanelRightOpen, PanelBottomClose, PanelBottomOpen, Bug } from "lucide-react";
import { useExecutionStore } from "@/store/executionStore";
import { useEditorStore } from "@/store/editorStore";
import { useRef } from "react";
import { apiUrl } from "@/lib/api-config";

interface ToolbarProps {
  onToggleAI: () => void;
  onToggleOutput: () => void;
  onToggleDebug?: () => void;
  showAI: boolean;
  showOutput: boolean;
  showDebug?: boolean;
}

export function Toolbar({ onToggleAI, onToggleOutput, onToggleDebug, showAI, showOutput, showDebug }: ToolbarProps) {
  const { isExecuting, setIsExecuting, setOutput, setExecutionResult } = useExecutionStore();
  const { code } = useEditorStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("Error: No code to execute. Please write some assembly code first.");
      return;
    }

    // Get user's API key from token
    const token = localStorage.getItem("studentToken");
    if (!token) {
      setOutput("Error: Please sign in to execute code.");
      return;
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    setIsExecuting(true);
    setOutput("Executing code...\n");

    try {
      // Get user's API key from localStorage (stored during login)
      const apiKey = localStorage.getItem("geminiApiKey");

      const response = await fetch(apiUrl("/api/execute"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, apiKey }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Debug: Log the full response structure
      console.log('📊 Execution Result:', data);
      console.log('📊 Registers:', data.registers || data.execution?.finalState?.registers);
      console.log('📊 Flags:', data.flags || data.execution?.finalState?.flags);
      console.log('📊 Memory:', data.memory || data.finalMemory);
      
      // Check if there's an error in the response (e.g., invalid API key)
      if (!data.success && data.error) {
        setExecutionResult(null);
        setOutput(data.output || `Error: ${data.error}`);
        return;
      }
      
      // Store full execution result for debug panels
      setExecutionResult(data);
      
      // Format output for display
      const output = data.summary || data.output || "Execution completed successfully!";
      setOutput(output);
    } catch (error) {
      setExecutionResult(null);
      
      // Check if error is due to abort
      if (error instanceof Error && error.name === 'AbortError') {
        setOutput("Execution stopped by user.");
      } else {
        setOutput(
          `Error: ${error instanceof Error ? error.message : "Failed to execute code"}\n\n` +
          `Make sure the backend is running and accessible.`
        );
      }
    } finally {
      setIsExecuting(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    // Abort the ongoing request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsExecuting(false);
  };

  return (
    <div className="h-12 border-b border-border bg-background flex items-center justify-between px-4">
      {/* Left: File actions */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold">ASM-Studio Pro</span>
      </div>

      {/* Center: Execution controls */}
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleRun}
          disabled={isExecuting}
          className="button-hover"
        >
          <Play className="h-4 w-4 mr-2" />
          Run (F5)
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleStop}
          disabled={!isExecuting}
        >
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>
      </div>

      {/* Right: Settings */}
      <div className="flex items-center gap-2">
        {/* Toggle Output Panel */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleOutput}
          title={showOutput ? "Hide Output Panel" : "Show Output Panel"}
        >
          {showOutput ? (
            <PanelBottomClose className="h-4 w-4" />
          ) : (
            <PanelBottomOpen className="h-4 w-4" />
          )}
        </Button>

        {/* Toggle AI Panel */}
        <Button
          size="icon"
          variant="ghost"
          onClick={onToggleAI}
          title={showAI ? "Hide AI Assistant" : "Show AI Assistant"}
        >
          {showAI ? (
            <PanelRightClose className="h-4 w-4" />
          ) : (
            <PanelRightOpen className="h-4 w-4" />
          )}
        </Button>

        {/* Toggle Debug Panel */}
        {onToggleDebug && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onToggleDebug}
            title={showDebug ? "Hide Debug Panels" : "Show Debug Panels"}
          >
            <Bug className={`h-4 w-4 ${showDebug ? 'text-primary' : ''}`} />
          </Button>
        )}

        <Button size="icon" variant="ghost" title="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
