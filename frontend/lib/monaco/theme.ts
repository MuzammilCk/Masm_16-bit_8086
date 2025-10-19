import { Monaco } from "@monaco-editor/react";

export function configureMonacoTheme(monaco: Monaco) {
  // Dark theme (GitHub Dark)
  monaco.editor.defineTheme("asmstudio-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "8b949e", fontStyle: "italic" },
      { token: "keyword", foreground: "ff7b72" },
      { token: "keyword.control", foreground: "ff7b72", fontStyle: "bold" },
      { token: "variable.parameter", foreground: "79c0ff" },
      { token: "number", foreground: "a5d6ff" },
      { token: "number.hex", foreground: "a5d6ff" },
      { token: "number.binary", foreground: "a5d6ff" },
      { token: "string", foreground: "a5d6ff" },
      { token: "type.identifier", foreground: "d2a8ff" },
      { token: "identifier", foreground: "c9d1d9" },
      { token: "operator", foreground: "ff7b72" },
      { token: "delimiter", foreground: "c9d1d9" },
      { token: "delimiter.bracket", foreground: "c9d1d9" },
    ],
    colors: {
      "editor.background": "#161b22",
      "editor.foreground": "#c9d1d9",
      "editor.lineHighlightBackground": "#21262d",
      "editor.selectionBackground": "#3b5360",
      "editor.inactiveSelectionBackground": "#2d333b",
      "editorCursor.foreground": "#58a6ff",
      "editorLineNumber.foreground": "#6e7681",
      "editorLineNumber.activeForeground": "#c9d1d9",
      "editorIndentGuide.background": "#21262d",
      "editorIndentGuide.activeBackground": "#30363d",
      "editorWhitespace.foreground": "#484f58",
      "editorBracketMatch.background": "#3b536040",
      "editorBracketMatch.border": "#58a6ff",
    },
  });

  // Light theme
  monaco.editor.defineTheme("asmstudio-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d", fontStyle: "italic" },
      { token: "keyword", foreground: "d73a49" },
      { token: "keyword.control", foreground: "d73a49", fontStyle: "bold" },
      { token: "variable.parameter", foreground: "005cc5" },
      { token: "number", foreground: "005cc5" },
      { token: "number.hex", foreground: "005cc5" },
      { token: "number.binary", foreground: "005cc5" },
      { token: "string", foreground: "032f62" },
      { token: "type.identifier", foreground: "6f42c1" },
      { token: "identifier", foreground: "24292e" },
      { token: "operator", foreground: "d73a49" },
      { token: "delimiter", foreground: "24292e" },
      { token: "delimiter.bracket", foreground: "24292e" },
    ],
    colors: {
      "editor.background": "#ffffff",
      "editor.foreground": "#24292e",
      "editor.lineHighlightBackground": "#f6f8fa",
      "editor.selectionBackground": "#c8e1ff",
      "editor.inactiveSelectionBackground": "#e1e4e8",
      "editorCursor.foreground": "#0969da",
      "editorLineNumber.foreground": "#57606a",
      "editorLineNumber.activeForeground": "#24292e",
      "editorIndentGuide.background": "#e1e4e8",
      "editorIndentGuide.activeBackground": "#d0d7de",
      "editorWhitespace.foreground": "#d0d7de",
      "editorBracketMatch.background": "#c8e1ff40",
      "editorBracketMatch.border": "#0969da",
    },
  });
}
