# MASM Studio - Interface Templates

## Response Templates for AI System

### Template 1: Compilation Success

```json
{
  "fileName": "program.asm",
  "compilation": {
    "status": "success",
    "errors": [],
    "warnings": []
  },
  "symbolTable": [
    {"label": "VAR1", "segment": "DATA", "type": "Variable", "size": "DB", "value": "10H"},
    {"label": "START", "segment": "CODE", "type": "Label", "size": "-", "value": "Entry point"}
  ],
  "initialMemory": [
    {"offset": "DS:0000", "value": "10", "symbol": "VAR1"}
  ],
  "execution": {
    "status": "success",
    "steps": [
      {"step": 1, "instruction": "MOV AX, DATA", "description": "Init DS", "registers": {"AX": "0B0A"}},
      {"step": 2, "instruction": "MOV DS, AX", "description": "Set data segment", "registers": {"DS": "0B0A"}},
      {"step": 3, "instruction": "MOV AL, VAR1", "description": "Load variable", "registers": {"AL": "10"}},
      {"step": 4, "instruction": "MOV AH, 4CH", "description": "Exit function", "registers": {"AH": "4C"}},
      {"step": 5, "instruction": "INT 21H", "description": "Terminate", "registers": {}}
    ],
    "finalState": {
      "registers": {
        "AX": "4C10", "BX": "0000", "CX": "0000", "DX": "0000",
        "SI": "0000", "DI": "0000", "SP": "FFFE", "BP": "0000",
        "CS": "0B1A", "DS": "0B0A", "ES": "0B0A", "SS": "0B1A", "IP": "000A"
      },
      "flags": {"ZF": "0", "SF": "0", "CF": "0", "OF": "0", "PF": "0"}
    }
  },
  "finalMemory": [
    {"offset": "DS:0000", "value": "10", "symbol": "VAR1"}
  ],
  "summary": "Program executed successfully. Loaded variable VAR1 (10H) into AL register."
}
```

### Template 2: Compilation Error

```json
{
  "fileName": "program.asm",
  "compilation": {
    "status": "error",
    "errors": [
      {
        "line": 12,
        "column": 9,
        "message": "Operand size mismatch",
        "explanation": "Cannot move a WORD-sized variable (RES) into a BYTE register (AL)",
        "suggestion": "Use a WORD register (AX) or access only the low byte with BYTE PTR",
        "example": "MOV AX, RES    ; Use 16-bit register\n; OR\nMOV AL, BYTE PTR RES    ; Access low byte"
      }
    ],
    "warnings": []
  },
  "symbolTable": [
    {"label": "RES", "segment": "DATA", "type": "Variable", "size": "DW", "value": "?"}
  ],
  "initialMemory": [],
  "execution": {
    "status": "error",
    "steps": [],
    "finalState": null
  },
  "finalMemory": [],
  "summary": "Compilation failed. Fix the errors above and try again."
}
```

### Template 3: Array Processing

```json
{
  "fileName": "array_sum.asm",
  "compilation": {
    "status": "success",
    "errors": [],
    "warnings": []
  },
  "symbolTable": [
    {"label": "ARRAY", "segment": "DATA", "type": "Variable", "size": "DB×5", "value": "10H,20H,30H,40H,50H"},
    {"label": "COUNT", "segment": "DATA", "type": "Variable", "size": "DB", "value": "05H"},
    {"label": "SUM", "segment": "DATA", "type": "Variable", "size": "DW", "value": "?"}
  ],
  "initialMemory": [
    {"offset": "DS:0000", "value": "10", "symbol": "ARRAY[0]"},
    {"offset": "DS:0001", "value": "20", "symbol": "ARRAY[1]"},
    {"offset": "DS:0002", "value": "30", "symbol": "ARRAY[2]"},
    {"offset": "DS:0003", "value": "40", "symbol": "ARRAY[3]"},
    {"offset": "DS:0004", "value": "50", "symbol": "ARRAY[4]"},
    {"offset": "DS:0005", "value": "05", "symbol": "COUNT"},
    {"offset": "DS:0006", "value": "??", "symbol": "SUM"}
  ],
  "execution": {
    "status": "success",
    "steps": [
      {"step": 1, "instruction": "MOV AX, DATA", "description": "Load segment addr", "registers": {"AX": "0B0A"}},
      {"step": 2, "instruction": "MOV DS, AX", "description": "Set DS", "registers": {"DS": "0B0A"}},
      {"step": 3, "instruction": "LEA SI, ARRAY", "description": "Point to array", "registers": {"SI": "0000"}},
      {"step": 4, "instruction": "MOV CL, COUNT", "description": "Load counter", "registers": {"CL": "05"}},
      {"step": 5, "instruction": "MOV AX, 0", "description": "Clear accumulator", "registers": {"AX": "0000"}},
      {"step": 6, "instruction": "ADD AL, [SI]", "description": "Add element", "registers": {"AL": "10"}},
      {"step": 7, "instruction": "INC SI", "description": "Next element", "registers": {"SI": "0001"}},
      {"step": 8, "instruction": "DEC CL", "description": "Decrement counter", "registers": {"CL": "04"}},
      {"step": 9, "instruction": "LOOP iteration", "description": "Repeat", "registers": {"CL": "04"}},
      {"step": 10, "instruction": "MOV SUM, AX", "description": "Store result", "registers": {"AX": "00F0"}}
    ],
    "finalState": {
      "registers": {
        "AX": "00F0", "BX": "0000", "CX": "0000", "DX": "0000",
        "SI": "0005", "DI": "0000", "SP": "FFFE", "BP": "0000",
        "CS": "0B1A", "DS": "0B0A", "ES": "0B0A", "SS": "0B1A", "IP": "0015"
      },
      "flags": {"ZF": "1", "SF": "0", "CF": "0", "OF": "0", "PF": "1"}
    }
  },
  "finalMemory": [
    {"offset": "DS:0000", "value": "10", "symbol": "ARRAY[0]"},
    {"offset": "DS:0001", "value": "20", "symbol": "ARRAY[1]"},
    {"offset": "DS:0002", "value": "30", "symbol": "ARRAY[2]"},
    {"offset": "DS:0003", "value": "40", "symbol": "ARRAY[3]"},
    {"offset": "DS:0004", "value": "50", "symbol": "ARRAY[4]"},
    {"offset": "DS:0005", "value": "05", "symbol": "COUNT"},
    {"offset": "DS:0006", "value": "F0", "symbol": "SUM"}
  ],
  "summary": "Array sum calculated successfully. Result: F0H (240 decimal) stored in SUM."
}
```

### Template 4: Chat Response (Plain Text)

```markdown
**Question:** Why do we need to initialize the DS register?

**Answer:**

Great question! The DS (Data Segment) register is crucial in 8086 assembly. Here's why:

**Simple Explanation:**
The 8086 uses segmented memory, meaning memory is divided into 64KB segments. When you access a variable, the CPU needs to know which segment it's in. That's what DS tells it!

**The Process:**
1. When your program loads, the assembler creates a DATA segment
2. The segment's address is stored in a special label (usually DATA)
3. You must manually load this address into DS
4. Now the CPU knows where to find your variables

**Code Example:**
```asm
MOV AX, DATA    ; Load segment address into AX
MOV DS, AX      ; Copy AX to DS (can't load DS directly)
```

**Why not automatic?**
The 8086 doesn't automatically set DS because you might want to access multiple data segments or switch between them.

**Common Mistake:**
Forgetting to initialize DS leads to reading/writing wrong memory locations - your program will crash or show garbage values!

**Key Takeaway:** Always initialize DS at the start of your program before accessing any variables. It's like giving the CPU a map to find your data!

Need more clarification? Just ask! 😊
```

### Template 5: Code Explanation

```markdown
**Your Code:**
```asm
MOV AX, DATA
MOV DS, AX
MOV CX, 5
MOV BX, 0
LOOP_START:
ADD BX, CX
DEC CX
JNZ LOOP_START
```

**Line-by-Line Explanation:**

**Line 1:** `MOV AX, DATA`
- Loads the segment address of DATA into AX register
- Needed because DS can't be loaded directly with immediate value

**Line 2:** `MOV DS, AX`
- Copies AX value to DS (Data Segment register)
- Now DS points to your data segment

**Line 3:** `MOV CX, 5`
- Initializes counter CX to 5
- This will be used for the loop

**Line 4:** `MOV BX, 0`
- Clears BX register (sets it to 0)
- BX will accumulate the sum

**Line 5:** `LOOP_START:` (Label)
- Marks the beginning of the loop
- Used as jump target

**Line 6:** `ADD BX, CX`
- Adds current CX value to BX
- BX = BX + CX

**Line 7:** `DEC CX`
- Decrements CX by 1
- Updates the Zero Flag (ZF)

**Line 8:** `JNZ LOOP_START`
- "Jump if Not Zero" - checks ZF
- If CX != 0, jump back to LOOP_START
- If CX = 0, continue to next instruction

**What This Does:**
Calculates: 5 + 4 + 3 + 2 + 1 = 15 (0FH)
Final Result: BX = 000FH

**Fun Fact:** This computes the sum of first 5 natural numbers! 🎯
```

### Template 6: Error Fix Suggestions

```markdown
**Error Detected:** Line 8 - Invalid instruction operand

**Problem:**
```asm
MOV [BX], [SI]    ; ❌ Can't move memory to memory directly
```

**Why This Fails:**
The 8086 doesn't support memory-to-memory moves in a single instruction. You need an intermediate register.

**Solution Options:**

**Option 1: Use accumulator (Most common)**
```asm
MOV AL, [SI]      ; Load from source
MOV [BX], AL      ; Store to destination
```

**Option 2: Use any register**
```asm
MOV DL, [SI]
MOV [BX], DL
```

**Option 3: Use MOVSB for string operations**
```asm
PUSH SI           ; Save SI
PUSH DI           ; Save DI
MOV SI, source
MOV DI, dest
MOVSB             ; Move byte
POP DI
POP SI
```

**Which to choose?**
- Option 1: Best for most cases (AL/AX is fastest)
- Option 2: If AL is already in use
- Option 3: When copying multiple bytes

Try one of these fixes and run again! 🚀
```

---

## Formatting Guidelines

### For JSON Responses
- Always return valid, parsable JSON
- No markdown code blocks wrapping JSON
- Use double quotes for strings
- Hex values as strings (e.g., "00F0")
- Keep descriptions under 10 words to save tokens

### For Text Responses
- Use markdown formatting
- Bold for **emphasis**
- Code blocks for assembly code
- Emojis for engagement (sparingly)
- Lists for clarity

### Tone Checklist
- ✅ Encouraging
- ✅ Clear
- ✅ Educational
- ✅ Patient
- ❌ Condescending
- ❌ Overly technical
- ❌ Discouraging

---

**Version:** 1.0.0  
**Last Updated:** October 2025
