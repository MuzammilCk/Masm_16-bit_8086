"use client";

import { Problems } from "@/types/ai-response";
import { AlertCircle, AlertTriangle } from "lucide-react";

interface ProblemsPanelProps {
  problems: Problems;
}

export function ProblemsPanel({ problems }: ProblemsPanelProps) {
  if (!problems || problems.count === 0) {
    return (
      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-md">
        <p className="text-green-500 text-sm flex items-center gap-2">
          <span className="text-lg">✅</span>
          No problems detected
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Errors */}
      {problems.errors.map((error, idx) => (
        <div
          key={`error-${idx}`}
          className="p-3 bg-red-500/10 border border-red-500/30 rounded-md"
        >
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-semibold text-sm">Error</span>
                {error.line && (
                  <span className="text-xs text-muted-foreground">
                    Line {error.line}
                    {error.column && `, Column ${error.column}`}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground">{error.message}</p>
              {error.code && (
                <pre className="mt-2 p-2 bg-secondary/50 rounded text-xs font-mono overflow-x-auto">
                  {error.code}
                </pre>
              )}
              {error.suggestions && error.suggestions.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-muted-foreground font-semibold">
                    Suggestions:
                  </p>
                  {error.suggestions.map((suggestion, sIdx) => (
                    <div
                      key={`suggestion-${sIdx}`}
                      className="p-2 bg-secondary/30 rounded text-xs"
                    >
                      <p className="text-primary font-mono">{suggestion.fix}</p>
                      <p className="text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Warnings */}
      {problems.warnings.map((warning, idx) => (
        <div
          key={`warning-${idx}`}
          className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md"
        >
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 font-semibold text-sm">Warning</span>
                {warning.line && (
                  <span className="text-xs text-muted-foreground">
                    Line {warning.line}
                    {warning.column && `, Column ${warning.column}`}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground">{warning.message}</p>
              {warning.code && (
                <pre className="mt-2 p-2 bg-secondary/50 rounded text-xs font-mono overflow-x-auto">
                  {warning.code}
                </pre>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
