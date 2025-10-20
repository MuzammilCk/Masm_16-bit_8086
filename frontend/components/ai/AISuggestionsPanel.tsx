"use client";

import { AISuggestion } from "@/types/ai-response";
import { Lightbulb, Zap, Info } from "lucide-react";

interface AISuggestionsPanelProps {
  suggestions: AISuggestion[];
}

export function AISuggestionsPanel({ suggestions }: AISuggestionsPanelProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const getIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'optimization':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'warning':
        return <Info className="h-4 w-4 text-orange-500" />;
      default:
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
    }
  };

  const getColorClasses = (type: AISuggestion['type']) => {
    switch (type) {
      case 'optimization':
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-500";
      case 'warning':
        return "bg-orange-500/10 border-orange-500/30 text-orange-500";
      default:
        return "bg-blue-500/10 border-blue-500/30 text-blue-500";
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-foreground">AI Suggestions</p>
      {suggestions.map((suggestion, idx) => (
        <div
          key={idx}
          className={`p-3 rounded-md border ${getColorClasses(suggestion.type)}`}
        >
          <div className="flex items-start gap-2">
            {getIcon(suggestion.type)}
            <div className="flex-1">
              <p className="text-sm text-foreground">{suggestion.message}</p>
              {suggestion.line && (
                <p className="text-xs text-muted-foreground mt-1">
                  Line {suggestion.line}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
