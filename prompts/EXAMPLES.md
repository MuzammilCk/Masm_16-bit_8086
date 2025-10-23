# ASM-Studio Pro - Complete Interaction Examples

## Example 1: Simple Addition Program

### User Input (Code)
```asm
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM1 DB 15H
    NUM2 DB 25H
    RES DB ?
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, NUM1
    ADD AL, NUM2
    MOV RES, AL
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

### AI Response (JSON)
```json
{
  "fileName": "addition.asm",
  "compilation": {
    "status": "success",
    "errors": [],
    "warnings": []
  },
  "symbolTable": [
    {"label": "NUM1", "segment": "DATA", "type": "Variable", "size": "DB", "value": "15H"},
    {"label": "NUM2", "segment": "DATA", "type": "Variable", "size": "DB", "value": "25H"},
    {"label": "RES", "segment": "DATA", "type": "Variable", "size": "DB", "value": "?"},
    {"label": "START", "segment": "CODE", "type": "Label", "size": "-", "value": "Entry"}
  ],
  "initialMemory": [
    {"offset": "DS:0000", "value": "15", "symbol": "NUM1"},
    {"offset": "DS:0001", "value": "25", "symbol": "NUM2"},
    {"offset": "DS:0002", "value": "00", "symbol": "RES"}
  ],
  "execution": {
    "status": "success",
    "steps": [
      {"step": 1, "instruction": "MOV AX, DATA", "description": "Load segment address", "registers": {"AX": "0B0A"}},
      {"step": 2, "instruction": "MOV DS, AX", "description": "Initialize DS", "registers": {"DS": "0B0A"}},
      {"step": 3, "instruction": "MOV AL, NUM1", "description": "Load first number", "registers": {"AL": "15"}},
      {"step": 4, "instruction": "ADD AL, NUM2", "description": "Add second number", "registers": {"AL": "3A"}},
      {"step": 5, "instruction": "MOV RES, AL", "description": "Store result", "registers": {}},
      {"step": 6, "instruction": "MOV AH, 4CH", "description": "Exit function", "registers": {"AH": "4C"}},
      {"step": 7, "instruction": "INT 21H", "description": "Terminate program", "registers": {}}
    ],
    "finalState": {
      "registers": {
        "AX": "4C3A", "BX": "0000", "CX": "0000", "DX": "0000",
        "SI": "0000", "DI": "0000", "SP": "FFFE", "BP": "0000",
        "CS": "0B1A", "DS": "0B0A", "ES": "0B0A", "SS": "0B1A", "IP": "000E"
      },
      "flags": {"ZF": "0", "SF": "0", "CF": "0", "OF": "0", "PF": "1"}
    }
  },
  "finalMemory": [
    {"offset": "DS:0000", "value": "15", "symbol": "NUM1"},
    {"offset": "DS:0001", "value": "25", "symbol": "NUM2"},
    {"offset": "DS:0002", "value": "3A", "symbol": "RES"}
  ],
  "summary": "Addition completed successfully. 15H + 25H = 3AH (58 decimal). Result stored in RES."
}
```

---

## Example 2: Error - Size Mismatch

### User Input (Code with Error)
```asm
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM DW 1234H
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, NUM    ; ❌ Error: WORD to BYTE
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

### AI Response (JSON)
```json
{
  "fileName": "error_example.asm",
  "compilation": {
    "status": "error",
    "errors": [
      {
        "line": 11,
        "column": 9,
        "message": "Operand size mismatch",
        "explanation": "Cannot move WORD-sized variable NUM (16-bit) into BYTE register AL (8-bit). The destination is too small to hold the data.",
        "suggestion": "Use a 16-bit register (AX, BX, CX, or DX) to match the WORD size, or explicitly access only the low byte with BYTE PTR.",
        "example": "Option 1: MOV AX, NUM    ; Use 16-bit register\nOption 2: MOV AL, BYTE PTR NUM    ; Get only low byte\nOption 3: MOV AL, BYTE PTR NUM\n         MOV AH, BYTE PTR NUM+1    ; Get both bytes"
      }
    ],
    "warnings": []
  },
  "symbolTable": [
    {"label": "NUM", "segment": "DATA", "type": "Variable", "size": "DW", "value": "1234H"}
  ],
  "initialMemory": [
    {"offset": "DS:0000", "value": "34", "symbol": "NUM (low)"},
    {"offset": "DS:0001", "value": "12", "symbol": "NUM (high)"}
  ],
  "execution": {
    "status": "error",
    "steps": [],
    "finalState": null
  },
  "finalMemory": [],
  "summary": "Compilation failed due to size mismatch error. Fix the error and try again."
}
```

---

## Example 3: Chat Question

### User Input (Chat)
```
User: "What's the difference between MOV and LEA?"
```

### AI Response (Plain Text)
```markdown
**Great question!** MOV and LEA are often confused but do very different things:

### MOV (Move Data)
**What it does:** Copies the **value** from source to destination

**Example:**
```asm
MOV AX, VAR    ; Load the VALUE stored at VAR into AX
```
If VAR contains 1234H, then AX = 1234H

### LEA (Load Effective Address)
**What it does:** Calculates and loads the **address** of a variable

**Example:**
```asm
LEA SI, VAR    ; Load the ADDRESS of VAR into SI
```
If VAR is at offset 0005H, then SI = 0005H

### Simple Analogy 🏠
- **MOV** = "Give me what's inside the box"
- **LEA** = "Tell me where the box is located"

### When to Use Each?

**Use MOV when:**
- You want the actual data value
- Reading/writing variables
- Most arithmetic operations

**Use LEA when:**
- You need to work with arrays
- Passing pointers to procedures
- Dynamic memory addressing
- Complex addressing calculations

### Code Example:
```asm
DATA SEGMENT
    ARRAY DB 10H, 20H, 30H, 40H, 50H
DATA ENDS

CODE SEGMENT
    MOV AL, ARRAY      ; AL = 10H (first element value)
    LEA SI, ARRAY      ; SI = offset of ARRAY (address)
    MOV AL, [SI]       ; AL = 10H (value at address in SI)
    
    ; LEA is especially useful for arrays:
    LEA SI, ARRAY      ; Point to start
    MOV AL, [SI+2]     ; Access third element (30H)
CODE ENDS
```

### Pro Tip 💡
You can often replace `MOV SI, OFFSET ARRAY` with `LEA SI, ARRAY` - they're equivalent, but LEA is more flexible with complex addressing!

**Still confused?** Try both in your code and see the difference! 🚀
```

---

## Example 4: Array Processing with Loop

### User Input (Code)
```asm
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    ARRAY DB 5, 10, 15, 20, 25
    COUNT DB 5
    SUM DW 0
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    LEA SI, ARRAY
    MOV CL, COUNT
    MOV AX, 0
    
LOOP_START:
    ADD AL, [SI]
    ADC AH, 0
    INC SI
    DEC CL
    JNZ LOOP_START
    
    MOV SUM, AX
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

### AI Response (JSON - Condensed for loops)
```json
{
  "fileName": "array_sum.asm",
  "compilation": {
    "status": "success",
    "errors": [],
    "warnings": []
  },
  "symbolTable": [
    {"label": "ARRAY", "segment": "DATA", "type": "Variable", "size": "DB×5", "value": "5,10,15,20,25"},
    {"label": "COUNT", "segment": "DATA", "type": "Variable", "size": "DB", "value": "5"},
    {"label": "SUM", "segment": "DATA", "type": "Variable", "size": "DW", "value": "0"},
    {"label": "LOOP_START", "segment": "CODE", "type": "Label", "size": "-", "value": "Loop entry"}
  ],
  "initialMemory": [
    {"offset": "DS:0000", "value": "05", "symbol": "ARRAY[0]"},
    {"offset": "DS:0001", "value": "0A", "symbol": "ARRAY[1]"},
    {"offset": "DS:0002", "value": "0F", "symbol": "ARRAY[2]"},
    {"offset": "DS:0003", "value": "14", "symbol": "ARRAY[3]"},
    {"offset": "DS:0004", "value": "19", "symbol": "ARRAY[4]"},
    {"offset": "DS:0005", "value": "05", "symbol": "COUNT"},
    {"offset": "DS:0006", "value": "00", "symbol": "SUM (low)"},
    {"offset": "DS:0007", "value": "00", "symbol": "SUM (high)"}
  ],
  "execution": {
    "status": "success",
    "steps": [
      {"step": 1, "instruction": "MOV AX, DATA", "description": "Load segment", "registers": {"AX": "0B0A"}},
      {"step": 2, "instruction": "MOV DS, AX", "description": "Set DS", "registers": {"DS": "0B0A"}},
      {"step": 3, "instruction": "LEA SI, ARRAY", "description": "Point to array", "registers": {"SI": "0000"}},
      {"step": 4, "instruction": "MOV CL, COUNT", "description": "Load counter", "registers": {"CL": "05"}},
      {"step": 5, "instruction": "MOV AX, 0", "description": "Clear sum", "registers": {"AX": "0000"}},
      {"step": 6, "instruction": "ADD AL, [SI]", "description": "Add element 1", "registers": {"AL": "05"}},
      {"step": 7, "instruction": "ADC AH, 0", "description": "Handle carry", "registers": {"AH": "00"}},
      {"step": 8, "instruction": "INC SI", "description": "Next element", "registers": {"SI": "0001"}},
      {"step": 9, "instruction": "DEC CL", "description": "Count down", "registers": {"CL": "04"}},
      {"step": 10, "instruction": "JNZ LOOP_START", "description": "Continue loop", "registers": {}},
      {"step": 11, "instruction": "ADD AL, [SI]", "description": "Add element 2", "registers": {"AL": "0F"}},
      {"step": 12, "instruction": "Loop iterations 3-5", "description": "Process remaining", "registers": {"AL": "4B", "SI": "0005", "CL": "00"}},
      {"step": 13, "instruction": "MOV SUM, AX", "description": "Store result", "registers": {}},
      {"step": 14, "instruction": "MOV AH, 4CH", "description": "Exit function", "registers": {"AH": "4C"}},
      {"step": 15, "instruction": "INT 21H", "description": "Terminate", "registers": {}}
    ],
    "finalState": {
      "registers": {
        "AX": "4C4B", "BX": "0000", "CX": "0000", "DX": "0000",
        "SI": "0005", "DI": "0000", "SP": "FFFE", "BP": "0000",
        "CS": "0B1A", "DS": "0B0A", "ES": "0B0A", "SS": "0B1A", "IP": "0020"
      },
      "flags": {"ZF": "1", "SF": "0", "CF": "0", "OF": "0", "PF": "1"}
    }
  },
  "finalMemory": [
    {"offset": "DS:0000", "value": "05", "symbol": "ARRAY[0]"},
    {"offset": "DS:0001", "value": "0A", "symbol": "ARRAY[1]"},
    {"offset": "DS:0002", "value": "0F", "symbol": "ARRAY[2]"},
    {"offset": "DS:0003", "value": "14", "symbol": "ARRAY[3]"},
    {"offset": "DS:0004", "value": "19", "symbol": "ARRAY[4]"},
    {"offset": "DS:0005", "value": "05", "symbol": "COUNT"},
    {"offset": "DS:0006", "value": "4B", "symbol": "SUM (low)"},
    {"offset": "DS:0007", "value": "00", "symbol": "SUM (high)"}
  ],
  "summary": "Array sum calculated successfully. Sum of [5,10,15,20,25] = 75 (4BH). Result stored in SUM with carry handling."
}
```

---

## Example 5: Code Optimization Request

### User Input (Chat)
```
User: "Can you optimize this code?"

CODE:
MOV AL, 0
ADD AL, 1
ADD AL, 1
ADD AL, 1
ADD AL, 1
ADD AL, 1
```

### AI Response (Plain Text)
```markdown
**Great code to optimize!** Let's make this more efficient:

### Your Original Code (5 instructions)
```asm
MOV AL, 0
ADD AL, 1
ADD AL, 1
ADD AL, 1
ADD AL, 1
ADD AL, 1
; Result: AL = 5
```

### Optimized Version 1 (1 instruction) ⚡
```asm
MOV AL, 5
; Result: AL = 5
; Saves: 4 instructions, much faster!
```

### Why This Works:
If you're just setting AL to 5, directly loading it is best!

### Optimized Version 2 (Loop - if count is variable)
```asm
MOV AL, 0
MOV CX, 5
LOOP_ADD:
    INC AL
    LOOP LOOP_ADD
; Result: AL = 5
; Better if the count changes
```

### Performance Comparison:

| Version | Instructions | Clock Cycles* | Best Use Case |
|---------|-------------|---------------|---------------|
| Original | 6 | ~24 | Never (inefficient) |
| Direct MOV | 1 | ~4 | Fixed value known |
| Loop | 3 + loop | ~15 | Variable count |

*Approximate 8086 cycles

### Pro Tips 💡

1. **Know the result?** → Use direct MOV
2. **Variable count?** → Use LOOP
3. **Large counts?** → Consider multiplication
   ```asm
   MOV AL, 1
   MOV CL, 5
   MUL CL    ; AL = AL * 5
   ```

### Real-World Lesson:
In assembly, every instruction matters! Always ask:
- "Can I calculate this at compile time?"
- "Can I use fewer instructions?"
- "Is there a dedicated instruction for this?"

**Want me to optimize any specific code?** Just ask! 🚀
```

---

## Example 6: Debugging Session

### User Input (Chat)
```
User: "My program crashes. Help debug!"

CODE:
MOV AX, DATA
MOV AL, [1000H]
```

### AI Response (Plain Text)
```markdown
**Found the problem!** 🔍 Let's debug this step by step:

### Issue 1: DS Not Initialized ❌
```asm
MOV AX, DATA
; You loaded DATA address into AX...
; But never copied it to DS!
```

**Problem:** When you access memory `[1000H]`, the CPU uses DS as the segment register. Since DS isn't initialized, it points to a random/wrong segment!

**Fix:**
```asm
MOV AX, DATA
MOV DS, AX      ; ✅ Add this line!
```

### Issue 2: Size Mismatch ❌
```asm
MOV AL, [1000H]
```

**Problem:** AL is 8-bit, but without size specification, the assembler might assume WORD. Also, direct address 1000H is unusual - you probably meant an offset.

**Better Approach:**
```asm
; If you want to read from offset 1000H in DATA segment:
MOV BX, 1000H
MOV AL, [BX]

; OR if you have a variable:
MOV AL, BYTE PTR [1000H]
```

### Corrected Version ✅
```asm
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    ; Your variables here
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA      ; Load segment address
    MOV DS, AX        ; Initialize DS ✅
    
    ; Now safe to access memory:
    MOV BX, 1000H
    MOV AL, [BX]      ; Read byte from DS:1000H
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

### Debugging Checklist for Future:
1. ✅ **Always initialize DS** before accessing variables
2. ✅ **Match sizes** (BYTE/WORD) correctly
3. ✅ **Use proper addressing** (labels or BX/SI/DI)
4. ✅ **Check segment assumptions** (CS, DS, ES, SS)

### Pro Tip 💡
Use this template at the start of every program:
```asm
MOV AX, DATA
MOV DS, AX
; Now you're safe!
```

Try the corrected version and let me know if it works! 🚀
```

---

**Version:** 1.0.0  
**Last Updated:** October 2025  
**Purpose:** Training examples for ASM-Studio Pro AI system
