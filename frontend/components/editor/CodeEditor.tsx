"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useEditorStore } from "@/store/editorStore";
import { useTheme } from "next-themes";
import { configureMASMLanguage } from "@/lib/monaco/language";
import { configureMonacoTheme } from "@/lib/monaco/theme";

export function CodeEditor() {
  const { code, setCode, cursorPosition, setCursorPosition } = useEditorStore();
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    
    // Configure MASM language
    configureMASMLanguage(monaco);
    
    // Configure custom theme
    configureMonacoTheme(monaco);
    
    // Track cursor position
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });
    
    // Focus editor
    editor.focus();
  }

  function handleEditorChange(value: string | undefined) {
    setCode(value || "");
  }

  return (
    <div className="h-full w-full">
      {mounted && (
        <Editor
          height="100%"
          defaultLanguage="masm"
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={theme === "dark" ? "asmstudio-dark" : "asmstudio-light"}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-jetbrains)",
          fontLigatures: true,
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          renderLineHighlight: "all",
          lineNumbers: "on",
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
          renderWhitespace: "selection",
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "off",
          automaticLayout: true,
        }}
        />
      )}
    </div>
  );
}
