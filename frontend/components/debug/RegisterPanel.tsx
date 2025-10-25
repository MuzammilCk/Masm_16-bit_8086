"use client";

import React from 'react';
import { Cpu } from 'lucide-react';

interface RegisterPanelProps {
  registers: {
    AX?: string;
    BX?: string;
    CX?: string;
    DX?: string;
    SI?: string;
    DI?: string;
    BP?: string;
    SP?: string;
    CS?: string;
    DS?: string;
    ES?: string;
    SS?: string;
    IP?: string;
  };
  className?: string;
}

export function RegisterPanel({ registers, className = '' }: RegisterPanelProps) {
  const generalPurpose = ['AX', 'BX', 'CX', 'DX'];
  const index = ['SI', 'DI', 'BP', 'SP'];
  const segment = ['CS', 'DS', 'ES', 'SS'];
  const special = ['IP'];

  // Debug: Log what we received
  React.useEffect(() => {
    console.log('🔍 RegisterPanel received:', registers);
    console.log('🔍 Register keys:', Object.keys(registers));
  }, [registers]);

  // Convert and format register value
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return '0000';
    
    // If already a string, clean it
    if (typeof value === 'string') {
      // Remove 'H' suffix if present
      let cleaned = value.replace(/H$/i, '').trim();
      // Pad to 4 characters
      return cleaned.padStart(4, '0').toUpperCase();
    }
    
    // If number, convert to hex
    if (typeof value === 'number') {
      return value.toString(16).padStart(4, '0').toUpperCase();
    }
    
    // Fallback
    return String(value).padStart(4, '0').toUpperCase();
  };

  const RegisterRow = ({ name, value }: { name: string; value: string | undefined }) => {
    const displayValue = formatValue(value);
    const isNonZero = displayValue !== '0000';
    
    return (
      <div className="flex items-center justify-between py-1.5 px-2 hover:bg-accent/50 rounded text-sm">
        <span className="font-mono font-semibold text-muted-foreground">{name}</span>
        <span 
          className={`font-mono font-bold ${
            isNonZero ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          {displayValue}H
        </span>
      </div>
    );
  };

  const RegisterSection = ({ title, regs }: { title: string; regs: string[] }) => (
    <div className="mb-3">
      <h4 className="text-xs font-semibold text-muted-foreground mb-1 px-2">{title}</h4>
      <div className="space-y-0.5">
        {regs.map((reg) => (
          <RegisterRow key={reg} name={reg} value={registers[reg as keyof typeof registers]} />
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-background border border-border rounded-lg p-3 ${className}`}>
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
        <Cpu className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold">8086 Registers</h3>
      </div>

      <div className="space-y-2">
        <RegisterSection title="General Purpose" regs={generalPurpose} />
        <RegisterSection title="Index & Pointer" regs={index} />
        <RegisterSection title="Segment" regs={segment} />
        <RegisterSection title="Instruction Pointer" regs={special} />
      </div>

      {Object.keys(registers).length === 0 && (
        <div className="text-center text-muted-foreground text-sm py-4">
          Run code to see register values
        </div>
      )}
    </div>
  );
}
