# ASM-Studio Pro - Interface Templates
**Version**: 1.0.0  
**Purpose**: Standard output formatting templates for consistent user experience

---

## COMPLETE RESPONSE TEMPLATE

```markdown
## [📁 File: main.asm]
```asm
; Complete source code with syntax highlighting
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    OPR1 DB 20H
    OPR2 DB 30H
    RES DW ?
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, OPR1
    ADD AL, OPR2
    MOV AH, 00H
    MOV RES, AX
    
    MOV AH, 4CH
    INT 21H
CODE ENDS
END START
```

## [⚠️ Problems]
```
✓ No problems detected. Ready to build.
```

## [🔧 Build Output]
```
>>> BUILD STARTED
[Timestamp: 2025-10-16 23:13:45]

📦 Assembling main.asm...
   - Parsing directives... ✓
   - Resolving symbols... ✓
   - Generating machine code... ✓

📊 Symbol Table:
┌──────────┬──────┬──────┬────────┬────────┬───────────────┐
│ Segment  │ Name │ Type │ Size   │ Offset │ Initial Value │
├──────────┼──────┼──────┼────────┼────────┼───────────────┤
│ DATA     │ OPR1 │ VAR  │ BYTE   │ 0000h  │ 20h           │
│ DATA     │ OPR2 │ VAR  │ BYTE   │ 0001h  │ 30h           │
│ DATA     │ RES  │ VAR  │ WORD   │ 0002h  │ ???? (unint.) │
│ CODE     │ START│ LABEL│ -      │ 0000h  │ Entry Point   │
└──────────┴──────┴──────┴────────┴────────┴───────────────┘

✅ BUILD SUCCEEDED
   Output: main.exe (286 bytes)
   Time: 0.043s
```

## [▶️ Execution]
```
>>> EXECUTION STARTED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1 │ ADDRESS: CS:0000h
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Instruction: MOV AX, DATA
💡 Load DATA segment address into AX
⚙️ AX ← 0600h
📊 AX: 0000h → 0600h ✓

[... additional steps ...]

>>> PROGRAM TERMINATED
   Exit Code: 0 (Success)
```

## [📊 Final State]
```
🎯 Final Register State:
   AX = 0050h    BX = 0000h    CX = 0000h    DX = 0000h
   SI = 0000h    DI = 0000h    BP = 0000h    SP = 0100h
   CS = 0700h    DS = 0600h    SS = 0800h    ES = 0000h

🚩 Flags: CF=0 ZF=0 SF=0 OF=0 PF=1 AF=0

💾 Memory Changes:
   DS:0002h = 0050h (RES) ✓

📝 Result: OPR1 (20h) + OPR2 (30h) = 50h ✓
```
```

---

## ERROR DISPLAY TEMPLATE

```markdown
## [⚠️ Problems]
```
● Line 15, Col 5: Error: Type mismatch
  MOV AL, RES
          ^^^
  
  Problem: AL is 8-bit, but RES is defined as DW (16-bit)
  
  💡 Why this matters:
     The 8086 requires operand sizes to match.
  
  ✅ Possible Fixes:
  
     Option 1: Use AX instead (16-bit register)
     MOV AX, RES
     
     Option 2: Access only the low byte of RES
     MOV AL, BYTE PTR RES
     
     Option 3: Redefine RES as a byte
     RES DB ?
  
  ❓ Which approach fits your program's logic?

● Line 23, Col 1: Warning: Unused label 'UNUSED_LOOP'
```
```

---

## STEP EXECUTION TEMPLATE (DETAILED)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 5 │ ADDRESS: CS:0008h
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 Instruction: ADD AL, BL

🔍 Disassembly: 02 C3    ; ADD AL, BL (2 bytes)

💡 Explanation:
   Add the value in BL register to AL register.
   This performs 8-bit unsigned addition.

⚙️ Execution:
   Source: BL = 30h (48 decimal)
   Destination: AL = 20h (32 decimal)
   Operation: AL ← AL + BL = 20h + 30h = 50h

📊 Register Changes:
   AL: 20h → 50h ✓
   (AX: 0020h → 0050h)
   
🚩 Flags:
   CF = 0  (No carry - result fits in 8 bits)
   ZF = 0  (Result is not zero)
   SF = 0  (Result is positive)
   OF = 0  (No signed overflow)
   PF = 1  (Even parity - 4 bits set in 50h = 01010000)
   AF = 0  (No auxiliary carry)

💾 Memory: [No changes]
```

---

## CONCEPT EXPLANATION TEMPLATE

```markdown
📚 CONCEPT: Carry Flag (CF)

The Carry Flag indicates unsigned arithmetic overflow.

🎯 When is CF set?
   • Addition: Result > 255 (8-bit) or > 65535 (16-bit)
   • Subtraction: Borrow needed (result would be negative)

💡 Real-world analogy:
   Think of CF like the "1" you carry in elementary school:
   
     255 (FFh)
   +   1
   ─────────
     256     ← Overflows 8 bits, CF=1, AL wraps to 00h

🔍 In your code:
   Line 8: ADD AL, BL
   
   If AL=FFh and BL=01h:
   • Result: AL = 00h (wrapped around)
   • CF = 1 (overflow occurred)
   • Line 9 checks with JNC

🎓 Pro tip:
   Use CF for multi-precision arithmetic (numbers > 16 bits)
   with ADC (Add with Carry) instruction.
```

---

## OPTIMIZATION SUGGESTION TEMPLATE

```markdown
🚀 OPTIMIZATION OPPORTUNITIES

Your code works correctly! Here are improvements:

┌─────────────────────────────────────────────────────────────┐
│ 1. Use ADC Instead of Manual Carry Handling                 │
└─────────────────────────────────────────────────────────────┘

Current (Lines 8-11):
   ADD AL, BL
   JNC SKIP
   INC AH
   SKIP:

Optimized:
   ADD AL, BL
   ADC AH, 0      ; Automatically add carry to AH

💾 Savings: 1 instruction, no conditional jump
📈 Performance: ~40% faster (7 cycles vs 12 cycles)
🎯 Clarity: Intent is clearer

┌─────────────────────────────────────────────────────────────┐
│ 2. Zero Register with XOR                                   │
└─────────────────────────────────────────────────────────────┘

Current (Line 5):
   MOV AH, 00H    ; 3 bytes, 4 cycles

Optimized:
   XOR AH, AH     ; 2 bytes, 3 cycles

💾 Savings: 1 byte, 1 cycle
📈 Performance: 25% faster

❓ Want me to apply these optimizations?
```

---

## MEMORY VISUALIZATION TEMPLATE

```
💾 MEMORY VIEWER - DATA Segment (DS:0600h)

Offset │ +0 +1 +2 +3 +4 +5 +6 +7 │ ASCII    │ Variables
───────┼─────────────────────────┼──────────┼──────────────
0000h  │ 20 30 50 00 48 65 6C 6C │  0P.Hell │ OPR1, OPR2, RES
0008h  │ 6F 00 00 00 00 00 00 00 │ o....... │ MSG
0010h  │ 00 00 00 00 00 00 00 00 │ ........ │

Legend:
🟢 Recently written    🔵 Recently read    ⚪ Unchanged

Variable Details:
• OPR1 (DS:0000h) = 20h (32 decimal) [BYTE]
• OPR2 (DS:0001h) = 30h (48 decimal) [BYTE]
• RES  (DS:0002h) = 0050h (80 decimal) [WORD] ✓ Modified
• MSG  (DS:0004h) = "Hello" [STRING]
```

---

## REGISTER STATE TEMPLATE

```
🎯 REGISTER STATE

   AX (Accumulator)                 BX (Base)
   ┌────────┬────────┐             ┌────────┬────────┐
   │   AH   │   AL   │             │   BH   │   BL   │
   │  00h   │  50h   │             │  00h   │  30h   │
   └────────┴────────┘             └────────┴────────┘
   = 0050h (80 dec)                = 0030h (48 dec)
   ↑ Changed (Step 6)              ↑ Changed (Step 4)

   CX (Counter)                     DX (Data)
   ┌────────┬────────┐             ┌────────┬────────┐
   │   CH   │   CL   │             │   DH   │   DL   │
   │  00h   │  00h   │             │  00h   │  00h   │
   └────────┴────────┘             └────────┴────────┘
   = 0000h                         = 0000h

Segment Registers:
   CS = 0700h  (Code)      DS = 0600h  (Data)
   SS = 0800h  (Stack)     ES = 0000h  (Extra)

Pointers:
   IP = 0012h  (Instruction)    SP = 0100h  (Stack)
   SI = 0000h  (Source Index)   DI = 0000h  (Dest Index)
   BP = 0000h  (Base Pointer)

🚩 Flags: CF=0 ZF=0 SF=0 OF=0 PF=1 AF=0
```

---

## FAST MODE TEMPLATE

```
>>> BUILD OK (0.02s)
>>> EXEC OK (8 steps, 0.04s)
>>> AX=0050h BX=0030h CX=0000h DX=0000h
>>> [RES]=0050h ✓
>>> EXIT 0
```

---

## DEBUG MODE TEMPLATE

```
🐛 DEBUGGER ACTIVE

Breakpoint set at: SKIP (CS:0011h)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 5 │ CS:0008h │ ADD AL, BL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before:
   AL=20h BL=30h CF=0
   
Execution:
   AL ← AL + BL = 20h + 30h = 50h
   
After:
   AL=50h BL=30h CF=0 ZF=0 SF=0 OF=0 PF=1
   
Memory Accesses: None
Cycles: 3
Time: 0.3μs @ 10MHz

debugger> step
```

---

## TEACH MODE TEMPLATE

```
📚 LEARNING MODE ACTIVE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 3 │ MOV DS, AX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 What it does:
   Sets the Data Segment register to point to our data.

💡 Why we need this:
   The 8086 uses segmented memory. Think of it like floors in a building:
   - CS = Floor where code lives
   - DS = Floor where data lives
   
   We must tell DS which "floor" our variables are on!

🎯 Common mistake:
   Forgetting this step causes your program to read garbage data
   from the wrong memory location.

⚠️ Important:
   You can't do MOV DS, DATA directly. The 8086 requires you to
   use a general register (like AX) as an intermediary.

🎓 Try this:
   What would happen if we skipped lines 1-2? Try removing them
   and see the error!

Next: We'll load our first variable into AL...
```

---

## SYMBOL TABLE TEMPLATE

```
📊 SYMBOL TABLE

┌──────────┬──────────┬──────┬────────┬────────┬───────────────┐
│ Segment  │ Name     │ Type │ Size   │ Offset │ Initial Value │
├──────────┼──────────┼──────┼────────┼────────┼───────────────┤
│ DATA     │ OPR1     │ VAR  │ BYTE   │ 0000h  │ 20h           │
│ DATA     │ OPR2     │ VAR  │ BYTE   │ 0001h  │ 30h           │
│ DATA     │ RES      │ VAR  │ WORD   │ 0002h  │ ???? (unint.) │
│ DATA     │ MSG      │ VAR  │ BYTE[6]│ 0004h  │ "Hello$"      │
├──────────┼──────────┼──────┼────────┼────────┼───────────────┤
│ CODE     │ START    │ LABEL│ -      │ 0000h  │ Entry Point   │
│ CODE     │ SKIP     │ LABEL│ -      │ 0011h  │ -             │
│ CODE     │ ADD_PROC │ PROC │ -      │ 0020h  │ Procedure     │
└──────────┴──────────┴──────┴────────┴────────┴───────────────┘

Total: 5 variables, 3 labels, 1 procedure
Data Segment Size: 10 bytes
Code Segment Size: 45 bytes
```

---

## EXECUTION SUMMARY TEMPLATE

```
┌─────────────────────────────────────────────────────────────┐
│                    EXECUTION SUMMARY                         │
└─────────────────────────────────────────────────────────────┘

📈 Statistics:
   Total Instructions: 8
   Total Cycles: ~47 (estimated)
   Execution Time: ~4.7μs @ 10MHz 8086
   Memory Reads: 3
   Memory Writes: 1
   Jumps Taken: 0
   Jumps Not Taken: 1

🎯 Program Logic:
   This program adds two 8-bit numbers (OPR1 + OPR2) and stores
   the result in a 16-bit variable (RES).
   
   Operation: 20h + 30h = 50h ✓
   
   The program correctly handles potential carries by:
   1. Clearing AH register
   2. Adding operands in AL
   3. Storing 16-bit result (AH:AL) to RES

✅ Execution completed successfully
   No errors or warnings
   All test cases passed
```

---

**END OF INTERFACE TEMPLATES**
