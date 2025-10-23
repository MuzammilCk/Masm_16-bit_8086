"use client";

import { useEditorStore } from "@/store/editorStore";
import { useExecutionStore } from "@/store/executionStore";

export function StatusBar() {
  const { cursorPosition, fileName } = useEditorStore();
  const { errors } = useExecutionStore();

  return (
    <div className="h-6 border-t border-border bg-secondary flex items-center justify-between px-2 md:px-4 text-xs text-muted-foreground shrink-0">
      {/* Left: File info */}
      <div className="flex items-center gap-2 md:gap-4">
        <span className="hidden md:inline">{fileName}</span>
        <span>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </span>
      </div>

      {/* Right: Status */}
      <div className="flex items-center gap-2 md:gap-4">
        {errors.length > 0 ? (
          <span className="text-destructive">
            {errors.length} {errors.length === 1 ? "error" : "errors"}
          </span>
        ) : (
          <span className="text-success">Ready</span>
        )}
      </div>
    </div>
  );
}
