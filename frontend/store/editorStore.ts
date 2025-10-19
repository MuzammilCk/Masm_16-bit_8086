import { create } from "zustand";

interface CursorPosition {
  line: number;
  column: number;
}

interface EditorStore {
  code: string;
  setCode: (code: string) => void;
  
  cursorPosition: CursorPosition;
  setCursorPosition: (position: CursorPosition) => void;
  
  fileName: string;
  setFileName: (name: string) => void;
  
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  code: "",
  setCode: (code) => set({ code, isDirty: true }),
  
  cursorPosition: { line: 1, column: 1 },
  setCursorPosition: (position) => set({ cursorPosition: position }),
  
  fileName: "main.asm",
  setFileName: (name) => set({ fileName: name }),
  
  isDirty: false,
  setIsDirty: (dirty) => set({ isDirty: dirty }),
}));
