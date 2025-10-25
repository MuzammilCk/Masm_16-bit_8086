"use client";

import React, { useState } from 'react';
import { Database, Search } from 'lucide-react';
import { Input } from '../ui/input';

interface MemoryEntry {
  offset: string;
  value: string;
  symbol?: string;
}

interface MemoryViewerProps {
  memory: MemoryEntry[];
  className?: string;
}

export function MemoryViewer({ memory, className = '' }: MemoryViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'hex' | 'decimal' | 'ascii'>('hex');

  // Debug: Log what we received
  React.useEffect(() => {
    console.log('💾 MemoryViewer received:', memory);
    console.log('💾 Memory entries:', memory.length);
    if (memory.length > 0) {
      console.log('💾 First entry:', memory[0]);
    }
  }, [memory]);

  const filteredMemory = memory.filter(
    (entry) =>
      entry.offset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatValue = (hexValue: string): string => {
    if (!hexValue || hexValue === '??' || hexValue === '?') return '??';
    
    try {
      const cleanHex = hexValue.replace(/H$/i, '').trim();
      const decimal = parseInt(cleanHex, 16);
      
      if (isNaN(decimal)) return hexValue;

      switch (viewMode) {
        case 'decimal':
          return decimal.toString().padStart(3, ' ');
        case 'ascii':
          return decimal >= 32 && decimal <= 126 ? String.fromCharCode(decimal) : '·';
        case 'hex':
        default:
          return cleanHex.padStart(2, '0').toUpperCase();
      }
    } catch {
      return hexValue;
    }
  };

  const MemoryRow = ({ entry }: { entry: MemoryEntry }) => {
    const isChanged = entry.value !== '00' && entry.value !== '??' && entry.value !== '?';

    return (
      <div
        className={`
          grid grid-cols-[120px_80px_1fr] gap-3 py-2 px-3
          border-b border-border/50 hover:bg-accent/30 transition-colors
          font-mono text-sm
        `}
      >
        <span className="text-muted-foreground font-medium">{entry.offset}</span>
        <span className={`font-bold ${isChanged ? 'text-primary' : 'text-muted-foreground'}`}>
          {formatValue(entry.value)}
        </span>
        <span className="text-foreground truncate" title={entry.symbol}>
          {entry.symbol || '—'}
        </span>
      </div>
    );
  };

  return (
    <div className={`bg-background border border-border rounded-lg flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold">Memory Viewer</h3>
          <span className="text-xs text-muted-foreground">
            ({memory.length} bytes)
          </span>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-1 bg-muted rounded-md p-1">
          {(['hex', 'decimal', 'ascii'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-2 py-1 text-xs font-medium rounded transition-colors
                ${
                  viewMode === mode
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search offset, symbol, or value..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Memory Content with Sticky Headers */}
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {/* Sticky Column Headers */}
        <div className="sticky top-0 z-10 grid grid-cols-[120px_80px_1fr] gap-3 py-2 px-3 bg-slate-800 border-b border-slate-700 shadow-sm">
          <span className="text-xs font-bold text-slate-300">OFFSET</span>
          <span className="text-xs font-bold text-slate-300">VALUE</span>
          <span className="text-xs font-bold text-slate-300">SYMBOL</span>
        </div>

        {/* Memory Rows */}
        {filteredMemory.length > 0 ? (
          filteredMemory.map((entry, idx) => (
            <MemoryRow key={`${entry.offset}-${idx}`} entry={entry} />
          ))
        ) : memory.length > 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No matching memory entries found
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm py-8">
            Run code to see memory content
          </div>
        )}
      </div>

      {/* Footer Info */}
      {memory.length > 0 && (
        <div className="p-2 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Showing {filteredMemory.length} of {memory.length} memory locations
          </p>
        </div>
      )}
    </div>
  );
}
