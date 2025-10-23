"use client";

import React from 'react';
import { Flag } from 'lucide-react';

interface FlagsPanelProps {
  flags: {
    ZF?: string;
    SF?: string;
    CF?: string;
    OF?: string;
    PF?: string;
    AF?: string;
    IF?: string;
    DF?: string;
    TF?: string;
  };
  className?: string;
}

const FLAG_DESCRIPTIONS: Record<string, string> = {
  ZF: 'Zero Flag - Set if result is zero',
  SF: 'Sign Flag - Set if result is negative',
  CF: 'Carry Flag - Set if carry/borrow occurred',
  OF: 'Overflow Flag - Set if signed overflow occurred',
  PF: 'Parity Flag - Set if even number of 1 bits',
  AF: 'Auxiliary Flag - Set if carry from low nibble',
  IF: 'Interrupt Flag - Enables/disables interrupts',
  DF: 'Direction Flag - String operation direction',
  TF: 'Trap Flag - Single-step mode for debugging',
};

export function FlagsPanel({ flags, className = '' }: FlagsPanelProps) {
  const mainFlags = ['ZF', 'SF', 'CF', 'OF', 'PF', 'AF'];
  const controlFlags = ['IF', 'DF', 'TF'];

  const FlagIndicator = ({ name, value }: { name: string; value: string | undefined }) => {
    const isSet = value === '1';
    const description = FLAG_DESCRIPTIONS[name];

    return (
      <div className="group relative">
        <div
          className={`
            flex items-center justify-center
            w-12 h-12 rounded-md border-2 font-mono font-bold text-sm
            transition-all duration-200 cursor-help
            ${
              isSet
                ? 'bg-primary/20 border-primary text-primary shadow-sm'
                : 'bg-muted border-border text-muted-foreground'
            }
          `}
          title={description}
        >
          <div className="text-center">
            <div className="text-xs font-bold">{name}</div>
            <div className="text-lg">{value === '1' ? '1' : '0'}</div>
          </div>
        </div>

        {/* Tooltip - appears below to avoid collisions */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 hidden group-hover:block z-[100] pointer-events-none">
          <div className="bg-slate-800 text-white border border-slate-700 rounded-md px-3 py-2 text-xs whitespace-nowrap shadow-xl">
            {description}
          </div>
        </div>
      </div>
    );
  };

  const FlagSection = ({ title, flagNames }: { title: string; flagNames: string[] }) => (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-muted-foreground mb-2">{title}</h4>
      <div className="flex flex-wrap gap-2">
        {flagNames.map((flagName) => (
          <FlagIndicator
            key={flagName}
            name={flagName}
            value={flags[flagName as keyof typeof flags]}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-background border border-border rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Flag className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">Status Flags</h3>
      </div>

      <div>
        <FlagSection title="Status & Arithmetic Flags" flagNames={mainFlags} />
        {controlFlags.some((f) => flags[f as keyof typeof flags] !== undefined) && (
          <FlagSection title="Control Flags" flagNames={controlFlags} />
        )}
      </div>

      {Object.keys(flags).length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-4">
          Run code to see flag states
        </div>
      )}
    </div>
  );
}
