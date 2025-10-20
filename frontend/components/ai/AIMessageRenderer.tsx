"use client";

import { useState } from "react";
import { AIResponse } from "@/types/ai-response";
import { parseAIResponse, isStructuredResponse } from "@/lib/ai-parser";
import { StructuredExecutionPanel } from "./StructuredExecutionPanel";
import { ProblemsPanel } from "./ProblemsPanel";
import { BuildPanel } from "./BuildPanel";
import { AISuggestionsPanel } from "./AISuggestionsPanel";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AIMessageRendererProps {
  content: string;
}

export function AIMessageRenderer({ content }: AIMessageRendererProps) {
  const response: AIResponse = parseAIResponse(content);
  const isStructured = isStructuredResponse(response);

  const [activeTab, setActiveTab] = useState<'build' | 'execution'>('execution');
  const [showProblems, setShowProblems] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Plain text response
  if (!isStructured) {
    return (
      <div className="prose prose-sm max-w-none">
        <p className="text-sm whitespace-pre-wrap text-foreground">
          {response.plainText}
        </p>
      </div>
    );
  }

  // Structured response
  return (
    <div className="space-y-4">
      {/* File Info */}
      {response.file && (
        <div className="p-3 bg-secondary/30 border border-border rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">File</p>
              <p className="text-sm font-mono font-semibold text-foreground">
                {response.file.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Lines</p>
              <p className="text-sm font-mono text-foreground">
                {response.file.lineCount}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Problems */}
      {response.problems && response.problems.count > 0 && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowProblems(!showProblems)}
            className="w-full justify-between"
          >
            <span className="text-sm font-semibold">
              Problems ({response.problems.count})
            </span>
            {showProblems ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {showProblems && <ProblemsPanel problems={response.problems} />}
        </div>
      )}

      {/* Build & Execution Tabs */}
      {(response.build || response.execution) && (
        <div className="space-y-3">
          {/* Tab Switcher */}
          <div className="flex gap-2 border-b border-border">
            {response.build && (
              <button
                onClick={() => setActiveTab('build')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'build'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                🔧 Build
              </button>
            )}
            {response.execution && (
              <button
                onClick={() => setActiveTab('execution')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'execution'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                ▶️ Execution
              </button>
            )}
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[200px]">
            {activeTab === 'build' && response.build && (
              <BuildPanel build={response.build} />
            )}
            {activeTab === 'execution' && response.execution && (
              <StructuredExecutionPanel execution={response.execution} />
            )}
          </div>
        </div>
      )}

      {/* AI Suggestions */}
      {response.aiSuggestions && response.aiSuggestions.length > 0 && (
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="w-full justify-between"
          >
            <span className="text-sm font-semibold">
              Suggestions ({response.aiSuggestions.length})
            </span>
            {showSuggestions ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {showSuggestions && (
            <AISuggestionsPanel suggestions={response.aiSuggestions} />
          )}
        </div>
      )}
    </div>
  );
}
