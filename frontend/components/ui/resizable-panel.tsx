"use client";

import { ReactNode } from "react";

interface ResizablePanelProps {
  children: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
}: ResizablePanelProps) {
  // TODO: Implement actual resizing logic
  return (
    <div className="h-full overflow-auto border-r border-border">
      {children}
    </div>
  );
}
