"use client";

import { ReactNode } from "react";

interface ResizablePanelProps {
  children: ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

export function ResizablePanel({
  children,
  defaultSize = 50,
  minSize = 20,
  maxSize = 80,
  className = "",
}: ResizablePanelProps) {
  // Check if we're in mobile mode (indicated by w-full className)
  const isMobilePanel = className.includes('w-full');
  
  return (
    <div 
      className={`h-full overflow-auto ${isMobilePanel ? '' : 'border-r border-border'} ${className}`}
      style={isMobilePanel ? {
        // Mobile: Take full width and height
        flex: '1 1 100%',
        width: '100%',
        minWidth: '100%',
        maxWidth: '100%'
      } : {
        // Desktop: Use percentage-based sizing
        flex: `0 0 ${defaultSize}%`,
        minWidth: `${minSize}%`,
        maxWidth: `${maxSize}%`
      }}
    >
      {children}
    </div>
  );
}
