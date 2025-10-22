"use client";

import { useEffect } from "react";
import { useExecutionStore } from "@/store/executionStore";
import { useEditorStore } from "@/store/editorStore";
import { useStreamingExecution } from "@/hooks/useStreamingExecution";
import { StreamingExecutionPanel } from "./StreamingExecutionPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ExecutionPanelProps {
  onCollapse?: () => void;
}

export function ExecutionPanel({ onCollapse }: ExecutionPanelProps) {
  const { code } = useEditorStore();
  const { isExecuting, setIsExecuting } = useExecutionStore();
  const { state, execute, isStreaming } = useStreamingExecution();

  // Execute code when requested
  useEffect(() => {
    if (isExecuting && code) {
      execute(code);
      setIsExecuting(false);
    }
  }, [isExecuting, code, execute, setIsExecuting]);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Execution Output</h3>
          {isStreaming && (
            <span className="flex items-center gap-1 text-xs text-blue-500">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Streaming...
            </span>
          )}
        </div>
        {onCollapse && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onCollapse}
            className="h-6 w-6"
            title="Collapse panel"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Content - Use Streaming Panel */}
      <div className="flex-1 overflow-hidden">
        <StreamingExecutionPanel state={state} isStreaming={isStreaming} />
      </div>
    </div>
  );
}
