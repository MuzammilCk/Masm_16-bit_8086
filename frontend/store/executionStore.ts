import { create } from "zustand";

interface Register {
  name: string;
  value: number;
  changed: boolean;
}

interface Flag {
  name: string;
  value: boolean;
  description: string;
}

interface ExecutionStep {
  step: number;
  address: string;
  instruction: string;
  explanation: string;
  registers: Record<string, number>;
  flags: Record<string, boolean>;
  memoryChanges: Array<{ address: number; value: number; type: "read" | "write" }>;
}

interface ExecutionStore {
  isExecuting: boolean;
  setIsExecuting: (executing: boolean) => void;
  
  currentStep: number;
  setCurrentStep: (step: number) => void;
  
  steps: ExecutionStep[];
  setSteps: (steps: ExecutionStep[]) => void;
  addStep: (step: ExecutionStep) => void;
  
  output: string;
  setOutput: (output: string) => void;
  appendOutput: (text: string) => void;
  
  errors: Array<{ line: number; message: string }>;
  setErrors: (errors: Array<{ line: number; message: string }>) => void;
  
  registers: Register[];
  setRegisters: (registers: Register[]) => void;
  
  flags: Flag[];
  setFlags: (flags: Flag[]) => void;
  
  reset: () => void;
}

const initialRegisters: Register[] = [
  { name: "AX", value: 0, changed: false },
  { name: "BX", value: 0, changed: false },
  { name: "CX", value: 0, changed: false },
  { name: "DX", value: 0, changed: false },
  { name: "SI", value: 0, changed: false },
  { name: "DI", value: 0, changed: false },
  { name: "BP", value: 0, changed: false },
  { name: "SP", value: 0x0100, changed: false },
  { name: "CS", value: 0x0700, changed: false },
  { name: "DS", value: 0, changed: false },
  { name: "SS", value: 0x0800, changed: false },
  { name: "ES", value: 0, changed: false },
  { name: "IP", value: 0, changed: false },
];

const initialFlags: Flag[] = [
  { name: "CF", value: false, description: "Carry Flag" },
  { name: "ZF", value: false, description: "Zero Flag" },
  { name: "SF", value: false, description: "Sign Flag" },
  { name: "OF", value: false, description: "Overflow Flag" },
  { name: "PF", value: false, description: "Parity Flag" },
  { name: "AF", value: false, description: "Auxiliary Carry Flag" },
];

export const useExecutionStore = create<ExecutionStore>((set) => ({
  isExecuting: false,
  setIsExecuting: (executing) => set({ isExecuting: executing }),
  
  currentStep: 0,
  setCurrentStep: (step) => set({ currentStep: step }),
  
  steps: [],
  setSteps: (steps) => set({ steps }),
  addStep: (step) => set((state) => ({ steps: [...state.steps, step] })),
  
  output: "",
  setOutput: (output) => set({ output }),
  appendOutput: (text) => set((state) => ({ output: state.output + text })),
  
  errors: [],
  setErrors: (errors) => set({ errors }),
  
  registers: initialRegisters,
  setRegisters: (registers) => set({ registers }),
  
  flags: initialFlags,
  setFlags: (flags) => set({ flags }),
  
  reset: () =>
    set({
      isExecuting: false,
      currentStep: 0,
      steps: [],
      output: "",
      errors: [],
      registers: initialRegisters,
      flags: initialFlags,
    }),
}));
