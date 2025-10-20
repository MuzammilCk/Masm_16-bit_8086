// TypeScript interfaces for structured AI response data

export interface RegisterChange {
  register: string;
  before: string;
  after: string;
  highlight?: boolean;
}

export interface FlagChange {
  flag: string;
  before: number;
  after: number;
}

export interface MemoryChange {
  address: string;
  before: string;
  after: string;
  label?: string;
}

export interface ExecutionStep {
  stepNumber: number;
  line: number;
  instruction: string;
  description: string;
  registerChanges: RegisterChange[];
  flagChanges: FlagChange[];
  memoryChanges: MemoryChange[];
}

export interface Symbol {
  segment: string;
  name: string;
  type: string;
  offset: string;
  value: string;
}

export interface BuildInfo {
  status: 'success' | 'failed';
  time?: string;
  outputFile?: string;
  size?: string;
  symbols?: Symbol[];
  collapsed?: boolean;
}

export interface ErrorInfo {
  line: number;
  column?: number;
  severity: 'error' | 'warning';
  message: string;
  code?: string;
  suggestions?: Array<{
    fix: string;
    description: string;
  }>;
}

export interface Problems {
  count: number;
  errors: ErrorInfo[];
  warnings: ErrorInfo[];
}

export interface FileInfo {
  name: string;
  content: string;
  lineCount: number;
  language: string;
}

export interface FinalState {
  registers: Record<string, string>;
  flags: Record<string, number>;
  memory: Array<{
    address: string;
    value: string;
    label?: string;
  }>;
  result?: {
    description: string;
    value: string;
  };
}

export interface Performance {
  instructions: number;
  cycles: number;
  time: string;
  efficiency: number;
}

export interface ExecutionInfo {
  status: 'completed' | 'error' | 'pending';
  totalSteps: number;
  currentStep: number;
  steps: ExecutionStep[];
  finalState?: FinalState;
  performance?: Performance;
}

export interface AISuggestion {
  type: 'optimization' | 'warning' | 'info';
  message: string;
  line?: number;
}

export interface AIResponse {
  file?: FileInfo;
  problems?: Problems;
  build?: BuildInfo;
  execution?: ExecutionInfo;
  aiSuggestions?: AISuggestion[];
  // For plain text responses (fallback)
  plainText?: string;
}
