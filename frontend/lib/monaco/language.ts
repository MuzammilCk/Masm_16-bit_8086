import { Monaco } from "@monaco-editor/react";

export function configureMASMLanguage(monaco: Monaco) {
  // Register MASM language
  monaco.languages.register({ id: "masm" });

  // Define syntax highlighting
  monaco.languages.setMonarchTokensProvider("masm", {
    defaultToken: "",
    tokenPostfix: ".asm",
    ignoreCase: true,

    // Keywords
    keywords: [
      "ASSUME", "SEGMENT", "ENDS", "END", "DB", "DW", "DD", "DQ", "DT",
      "EQU", "ORG", "PROC", "ENDP", "MACRO", "ENDM", "INCLUDE",
      "PUBLIC", "EXTRN", "OFFSET", "PTR", "BYTE", "WORD", "DWORD",
    ],

    // Instructions
    instructions: [
      "MOV", "ADD", "SUB", "MUL", "DIV", "INC", "DEC", "NEG", "CMP",
      "AND", "OR", "XOR", "NOT", "TEST", "SHL", "SHR", "SAL", "SAR",
      "ROL", "ROR", "RCL", "RCR", "JMP", "JE", "JZ", "JNE", "JNZ",
      "JG", "JGE", "JL", "JLE", "JA", "JAE", "JB", "JBE", "JC", "JNC",
      "JO", "JNO", "JS", "JNS", "JP", "JPE", "JNP", "JPO", "JCXZ",
      "CALL", "RET", "PUSH", "POP", "PUSHF", "POPF", "INT", "IRET",
      "LOOP", "LOOPE", "LOOPZ", "LOOPNE", "LOOPNZ", "NOP", "HLT",
      "LEA", "LDS", "LES", "LAHF", "SAHF", "XCHG", "XLAT", "IN", "OUT",
      "MOVS", "MOVSB", "MOVSW", "CMPS", "CMPSB", "CMPSW",
      "SCAS", "SCASB", "SCASW", "LODS", "LODSB", "LODSW",
      "STOS", "STOSB", "STOSW", "REP", "REPE", "REPZ", "REPNE", "REPNZ",
      "CLC", "STC", "CMC", "CLD", "STD", "CLI", "STI", "ADC", "SBB",
      "DAA", "DAS", "AAA", "AAS", "AAM", "AAD", "CBW", "CWD",
    ],

    // Registers
    registers: [
      "AX", "BX", "CX", "DX", "SI", "DI", "BP", "SP",
      "AL", "BL", "CL", "DL", "AH", "BH", "CH", "DH",
      "CS", "DS", "SS", "ES", "IP", "FLAGS",
    ],

    // Operators
    operators: ["+", "-", "*", "/", "MOD", "SHL", "SHR", "AND", "OR", "XOR", "NOT"],

    // Tokenizer rules
    tokenizer: {
      root: [
        // Comments
        [/;.*$/, "comment"],

        // Labels
        [/^[a-zA-Z_][a-zA-Z0-9_]*:/, "type.identifier"],

        // Keywords
        [
          /\b(?:ASSUME|SEGMENT|ENDS|END|DB|DW|DD|DQ|DT|EQU|ORG|PROC|ENDP|MACRO|ENDM|INCLUDE|PUBLIC|EXTRN|OFFSET|PTR|BYTE|WORD|DWORD)\b/,
          "keyword",
        ],

        // Instructions
        [
          /\b(?:MOV|ADD|SUB|MUL|DIV|INC|DEC|NEG|CMP|AND|OR|XOR|NOT|TEST|SHL|SHR|SAL|SAR|ROL|ROR|RCL|RCR|JMP|JE|JZ|JNE|JNZ|JG|JGE|JL|JLE|JA|JAE|JB|JBE|JC|JNC|JO|JNO|JS|JNS|JP|JPE|JNP|JPO|JCXZ|CALL|RET|PUSH|POP|PUSHF|POPF|INT|IRET|LOOP|LOOPE|LOOPZ|LOOPNE|LOOPNZ|NOP|HLT|LEA|LDS|LES|LAHF|SAHF|XCHG|XLAT|IN|OUT|MOVS|MOVSB|MOVSW|CMPS|CMPSB|CMPSW|SCAS|SCASB|SCASW|LODS|LODSB|LODSW|STOS|STOSB|STOSW|REP|REPE|REPZ|REPNE|REPNZ|CLC|STC|CMC|CLD|STD|CLI|STI|ADC|SBB|DAA|DAS|AAA|AAS|AAM|AAD|CBW|CWD)\b/,
          "keyword.control",
        ],

        // Registers
        [
          /\b(?:AX|BX|CX|DX|SI|DI|BP|SP|AL|BL|CL|DL|AH|BH|CH|DH|CS|DS|SS|ES|IP|FLAGS)\b/,
          "variable.parameter",
        ],

        // Numbers (hex, binary, decimal)
        [/\b[0-9A-Fa-f]+[Hh]\b/, "number.hex"],
        [/\b[01]+[Bb]\b/, "number.binary"],
        [/\b\d+\b/, "number"],

        // Strings
        [/'[^']*'/, "string"],
        [/"[^"]*"/, "string"],

        // Identifiers
        [/[a-zA-Z_][a-zA-Z0-9_]*/, "identifier"],

        // Operators
        [/[+\-*/]/, "operator"],

        // Brackets
        [/[\[\]]/, "delimiter.bracket"],
        [/[,:]/, "delimiter"],
      ],
    },
  });

  // Configure auto-completion
  monaco.languages.registerCompletionItemProvider("masm", {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        // Instructions
        ...["MOV", "ADD", "SUB", "MUL", "DIV", "INC", "DEC", "CMP", "JMP", "CALL", "RET", "PUSH", "POP", "INT", "LOOP"].map(
          (instruction) => ({
            label: instruction,
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: instruction,
            range,
            documentation: `${instruction} instruction`,
          })
        ),
        
        // Registers
        ...["AX", "BX", "CX", "DX", "AL", "BL", "CL", "DL", "AH", "BH", "CH", "DH", "SI", "DI", "BP", "SP", "CS", "DS", "SS", "ES"].map(
          (register) => ({
            label: register,
            kind: monaco.languages.CompletionItemKind.Variable,
            insertText: register,
            range,
            documentation: `${register} register`,
          })
        ),
        
        // Directives
        ...["SEGMENT", "ENDS", "ASSUME", "DB", "DW", "END"].map((directive) => ({
          label: directive,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: directive,
          range,
          documentation: `${directive} directive`,
        })),
      ];

      return { suggestions };
    },
  });
}
