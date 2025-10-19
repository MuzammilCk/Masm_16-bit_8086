"use client";

import { Button } from "@/components/ui/button";
import { Play, Square, Moon, Sun, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { useExecutionStore } from "@/store/executionStore";
import { useEffect, useState } from "react";

interface ToolbarProps {
  onToggleAI: () => void;
}

export function Toolbar({ onToggleAI }: ToolbarProps) {
  const { theme, setTheme } = useTheme();
  const { isExecuting } = useExecutionStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering theme-dependent UI after mount
  useEffect(() => {
    setMounted(true);
  }, []);

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
          disabled={isExecuting}
          className="button-hover"
        >
          <Play className="h-4 w-4 mr-2" />
          Run (F5)
        </Button>

        <Button
          size="sm"
          variant="outline"
          disabled={!isExecuting}
        >
          <Square className="h-4 w-4 mr-2" />
          Stop
        </Button>
      </div>

      {/* Right: Settings */}
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          disabled={!mounted}
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </Button>

        <Button size="icon" variant="ghost">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
