# 🎨 AI Output Format - Structured JSON Rendering

## Overview

ASM-Studio Pro now uses **structured JSON responses** from the AI to render beautiful, interactive execution simulations instead of plain text.

## Architecture

```
┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│  User    │─────▶│   AI     │─────▶│  Parser  │─────▶│  React   │
│  Types   │      │ Generates│      │ Extracts │      │ Renders  │
│  Code    │      │   JSON   │      │   Data   │      │  Modern  │
│          │      │          │      │          │      │    UI    │
└──────────┘      └──────────┘      └──────────┘      └──────────┘
```

## Benefits

✅ **Secure** - No XSS risks (vs HTML injection)  
✅ **Interactive** - React event handlers, animations  
✅ **Flexible** - Easy to modify UI without changing AI  
✅ **Type-safe** - TypeScript interfaces  
✅ **Beautiful** - Framer Motion animations, modern design  

## JSON Response Format

### Execution Response

When the user asks to "execute", "simulate", or "run" assembly code:

```json
{
  "file": {
    "name": "factorial.asm",
    "content": "ASSUME CS:CODE, DS:DATA\n...",
    "lineCount": 47,
    "language": "masm"
  },
  "problems": {
    "count": 0,
    "errors": [],
    "warnings": []
  },
  "build": {
    "status": "success",
    "time": "0.052s",
    "outputFile": "factorial.exe",
    "size": "312 bytes"
  },
  "execution": {
    "status": "completed",
    "totalSteps": 15,
    "currentStep": 0,
    "steps": [
      {
        "stepNumber": 1,
        "line": 10,
        "instruction": "MOV AX, DATA",
        "description": "Load DATA segment address into AX",
        "registerChanges": [
          {
            "register": "AX",
            "before": "0000h",
            "after": "0600h",
            "highlight": true
          }
        ],
        "flagChanges": [],
        "memoryChanges": []
      },
      {
        "stepNumber": 2,
        "line": 11,
        "instruction": "MOV DS, AX",
        "description": "Initialize DS register",
        "registerChanges": [
          {
            "register": "DS",
            "before": "0000h",
            "after": "0600h",
            "highlight": true
          }
        ],
        "flagChanges": [],
        "memoryChanges": []
      }
    ],
    "finalState": {
      "registers": {
        "AX": "0078h",
        "BX": "0000h",
        "CX": "0001h",
        "DX": "0000h"
      },
      "flags": {
        "CF": 0,
        "ZF": 0,
        "SF": 0,
        "OF": 0
      },
      "memory": [
        {
          "address": "DS:0000h",
          "value": "05",
          "label": "NUM"
        },
        {
          "address": "DS:0002h",
          "value": "78 00",
          "label": "RESULT"
        }
      ],
      "result": {
        "description": "5! = 120",
        "value": "0078h"
      }
    },
    "performance": {
      "instructions": 15,
      "cycles": 47,
      "time": "4.7μs",
      "efficiency": 85
    }
  },
  "aiSuggestions": [
    {
      "type": "optimization",
      "message": "Could save 2 cycles using IMUL",
      "line": 15
    }
  ]
}
```

### Error Response

When there are syntax or logical errors:

```json
{
  "problems": {
    "count": 2,
    "errors": [
      {
        "line": 15,
        "column": 5,
        "severity": "error",
        "message": "Type mismatch: Cannot move WORD to BYTE",
        "code": "MOV AL, RESULT",
        "suggestions": [
          {
            "fix": "MOV AX, RESULT",
            "description": "Use 16-bit register"
          }
        ]
      }
    ],
    "warnings": [
      {
        "line": 20,
        "severity": "warning",
        "message": "Unused variable: TEMP"
      }
    ]
  },
  "build": {
    "status": "failed"
  },
  "execution": null
}
```

## Component Structure

### Created Files

1. **Types** - `frontend/types/ai-response.ts`
   - TypeScript interfaces for all response data

2. **Parser** - `frontend/lib/ai-parser.ts`
   - Extracts JSON from markdown code blocks
   - Validates and normalizes data
   - Fallback to plain text

3. **Components**:
   - `StructuredExecutionPanel.tsx` - Interactive step-by-step execution
   - `ProblemsPanel.tsx` - Error and warning display
   - `BuildPanel.tsx` - Build information and symbol table
   - `AISuggestionsPanel.tsx` - AI optimization tips
   - `AIMessageRenderer.tsx` - Main renderer (routes to appropriate panel)

### Features

- ✨ **Smooth Animations** - Framer Motion transitions
- ⏯️ **Step Controls** - Next, Previous, First, Last
- 📊 **Progress Bar** - Visual execution progress
- 🎯 **Highlighted Changes** - Changed registers/flags/memory
- 📈 **Performance Metrics** - Instructions, cycles, efficiency
- 🎨 **Modern UI** - Tailwind CSS styling

## Usage

### For Users

Ask the AI to execute code:
```
"Execute this factorial program"
"Simulate the program step by step"
"Run this and show me the execution"
```

### For Developers

The AI system prompt automatically handles JSON output. The frontend:
1. Receives AI response
2. Parser extracts JSON
3. AIMessageRenderer displays appropriate components

## Testing

Try asking the AI:
```
"Simulate the factorial.asm program step by step"
```

Expected behavior:
- Beautiful execution panel appears
- Step-by-step controls work
- Register changes animate
- Final state shows with performance metrics

## Plain Text Fallback

For general questions, the AI responds with plain text:
```
User: "What is the MOV instruction?"
AI: "The MOV instruction copies data from source to destination..."
```

No JSON needed - renders as normal text.

## Notes

- AI must wrap JSON in \`\`\`json code block
- Only execution/simulation requests need JSON
- General chat uses plain text
- Parser handles both automatically
