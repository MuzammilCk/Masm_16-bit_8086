"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, ChevronRight } from "lucide-react";
import { AIMessageRenderer } from "./AIMessageRenderer";
import { apiUrl } from "@/lib/api-config";
import { useEditorStore } from "@/store/editorStore";
import { useExecutionStore } from "@/store/executionStore";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIChatProps {
  onCollapse?: () => void;
}

export function AIChat({ onCollapse }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get context from stores
  const { code } = useEditorStore();
  const { output, executionResult, errors } = useExecutionStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem("geminiApiKey") || "";
      
      // Prepare context
      const context = {
        code: code || "",
        output: output || "",
        hasErrors: errors.length > 0,
        errors: errors.map(e => `Line ${e.line}: ${e.message}`).join("\n"),
        executionSuccess: executionResult?.success || false,
        registers: executionResult?.registers || null,
        flags: executionResult?.flags || null,
      };
      
      const response = await fetch(apiUrl("/api/ai/chat"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          context: context,
          apiKey: apiKey,
          conversationHistory: messages.slice(-6), // Send last 3 exchanges for context
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        role: "assistant",
        content: data.message || "I'm here to help with assembly language!",
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Please make sure the backend is running.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">AI Assistant</h3>
          {code && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded" title="Has code context">
              Code
            </span>
          )}
          {executionResult?.success && (
            <span className="text-xs bg-green-500/10 text-green-600 px-2 py-0.5 rounded" title="Has execution results">
              Results
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
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-muted-foreground text-sm text-center mt-8 space-y-3">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
            <p className="font-semibold text-foreground">Ask me anything about assembly language!</p>
            <div className="text-xs space-y-1 max-w-md mx-auto">
              <p className="text-muted-foreground">I can help you with:</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>Explaining your code line-by-line</li>
                <li>Understanding register values and flags</li>
                <li>Debugging errors in your program</li>
                <li>Learning 8086 instructions and syntax</li>
                <li>Understanding execution results</li>
              </ul>
              {code && (
                <p className="text-primary font-medium mt-2">
                  I can see your current code!
                </p>
              )}
              {executionResult?.success && (
                <p className="text-green-600 font-medium">
                  I can see your execution results!
                </p>
              )}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`${
                  message.role === "user"
                    ? "max-w-[80%] rounded-lg p-3 bg-primary text-primary-foreground"
                    : "w-full rounded-lg p-4 bg-secondary border border-border"
                }`}
              >
                {message.role === "user" ? (
                  <p className="text-sm">{message.content}</p>
                ) : (
                  <AIMessageRenderer content={message.content} />
                )}
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-secondary border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
