"use client";

import { useExecutionStore } from "@/store/executionStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface ExecutionPanelProps {
  onCollapse?: () => void;
}

export function ExecutionPanel({ onCollapse }: ExecutionPanelProps) {
  const { output, steps, currentStep } = useExecutionStore();

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4">
        <h3 className="text-sm font-semibold">Execution Output</h3>
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

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {output ? (
          <pre className="font-mono text-sm whitespace-pre-wrap">{output}</pre>
        ) : (
          <div className="text-muted-foreground text-sm">
            Click "Run" to execute your code
          </div>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <div className="mt-4 space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-2 rounded border ${
                  index === currentStep
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                <div className="text-xs text-muted-foreground">
                  Step {step.step} - {step.address}
                </div>
                <div className="font-mono text-sm">{step.instruction}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
