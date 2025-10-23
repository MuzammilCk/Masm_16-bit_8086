# ✅ Code Validation & Error Handling Guide

## Overview

MASM Studio now includes comprehensive code validation that catches structural errors **before** execution, providing clear feedback and examples to help students write correct assembly code.

---

## 🎯 Problem Solved

**Before:** Incomplete or malformed code would execute anyway, leading to:
- ❌ Empty programs showing "Execution Complete" with no warnings
- ❌ Missing segments running without errors
- ❌ Incomplete instructions being processed
- ❌ Confusing results for students

**After:** Code is validated first, with:
- ✅ Clear error messages for missing elements
- ✅ Helpful structure templates
- ✅ Specific instructions for fixes
- ✅ No execution of invalid code

---

## 🔍 Validation Checks

### **1. Empty Code Detection**
```assembly
# Input: (empty or only comments)

# Error:
❌ Empty code: No assembly instructions found
```

### **2. Missing CODE SEGMENT**
```assembly
# Input:
START:
    MOV AX, 5

# Error:
❌ Missing CODE SEGMENT: Every MASM program must have a CODE SEGMENT definition
```

### **3. Missing START Label**
```assembly
# Input:
ASSUME CS:CODE
CODE SEGMENT
    MOV AX, 5
CODE ENDS

# Error:
❌ Missing START label: Program entry point "START:" not found
```

### **4. Missing END Directive**
```assembly
# Input:
ASSUME CS:CODE
CODE SEGMENT
START:
    MOV AX, 5
CODE ENDS

# Error:
❌ Missing END directive: Program must end with "END START" or "END <label>"
```

### **5. Missing ASSUME Directive**
```assembly
# Input:
DATA SEGMENT
DATA ENDS
CODE SEGMENT
START:
CODE ENDS
END START

# Error:
❌ Missing ASSUME directive: Must specify segment registers (e.g., ASSUME CS:CODE, DS:DATA)
```

### **6. Missing DATA SEGMENT**
```assembly
# Input:
ASSUME CS:CODE, DS:DATA
CODE SEGMENT
START:
    MOV AX, DATA  # References DATA but no DATA SEGMENT defined
    MOV DS, AX
CODE ENDS
END START

# Error:
❌ Missing DATA SEGMENT: Code references data segment but DATA SEGMENT is not defined
```

### **7. Missing DATA ENDS**
```assembly
# Input:
DATA SEGMENT
    NUM DB 10H
# Missing DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
CODE ENDS
END START

# Error:
❌ Missing DATA ENDS: DATA SEGMENT must be closed with "DATA ENDS"
```

### **8. Missing CODE ENDS**
```assembly
# Input:
ASSUME CS:CODE
CODE SEGMENT
START:
    MOV AX, 5
# Missing CODE ENDS
END START

# Error:
❌ Missing CODE ENDS: CODE SEGMENT must be closed with "CODE ENDS"
```

### **9. Unbalanced SEGMENT/ENDS**
```assembly
# Input:
DATA SEGMENT
DATA ENDS

CODE SEGMENT
START:
CODE ENDS

STACK SEGMENT
# Missing STACK ENDS

# Error:
❌ Unbalanced segments: Found 3 SEGMENT declaration(s) but 2 ENDS statement(s)
```

### **10. Incomplete Instructions**
```assembly
# Input:
START:
    MOV     # Missing operands
    ADD     # Missing operands

# Error:
❌ Incomplete instruction: MOV requires operands
❌ Incomplete instruction: ADD requires operands
```

### **11. Syntax Errors**
```assembly
# Input:
MOV AX,, BX  # Double comma

# Error:
❌ Syntax error: Double comma detected - check your operands
```

---

## 📋 Validation Error Display

When validation fails, students see:

```
❌ Code Validation Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Missing CODE SEGMENT: Every MASM program must have a CODE SEGMENT definition

❌ Missing START label: Program entry point "START:" not found

❌ Missing END directive: Program must end with "END START" or "END <label>"

💡 Common MASM Program Structure:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    ; Your variables here
    NUM1 DB 10H
DATA ENDS

CODE SEGMENT
START:
    ; Initialize data segment
    MOV AX, DATA
    MOV DS, AX
    
    ; Your code here
    MOV AL, NUM1
    
    ; Exit
    MOV AH, 4CH
    INT 21H
CODE ENDS

END START

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Required Elements:
1. ASSUME directive - Defines segment registers
2. DATA SEGMENT...DATA ENDS - For variables
3. CODE SEGMENT...CODE ENDS - For instructions
4. START: label - Program entry point
5. END START - Program termination
```

---

## 🎓 Educational Benefits

### **For Students:**
1. **Learn Structure** - See correct MASM format immediately
2. **Fix Errors Fast** - Know exactly what's missing
3. **Build Habits** - Reinforces proper code organization
4. **Reduce Frustration** - Clear guidance instead of confusion

### **For Instructors:**
1. **Consistent Standards** - All students write properly structured code
2. **Less Debugging** - Catch common mistakes early
3. **Better Submissions** - Students submit complete programs
4. **Track Issues** - Validation errors logged in admin dashboard

---

## 🔧 Implementation Details

### **Backend Validation (`backend/src/routes/execute.ts`)**

```typescript
function validateMASMCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for empty code
  // Check for required segments
  // Check for required directives
  // Check for balanced SEGMENT/ENDS
  // Check for syntax errors
  // Check for incomplete instructions
  
  return { valid: errors.length === 0, errors };
}
```

**Validation occurs:**
- ✅ Before AI execution
- ✅ After API key check
- ✅ Returns 400 status with helpful error message

### **Frontend Handling (`frontend/components/editor/Toolbar.tsx`)**

```typescript
// Parse response even on error status
const data = await response.json();

// Handle validation errors
if (!response.ok) {
  setExecutionResult(null);
  setOutput(data.output || `Error: ${data.error}`);
  return;
}
```

**Display:**
- ✅ Shows validation errors in output panel
- ✅ Includes template code
- ✅ Lists required elements
- ✅ No execution attempted

---

## 📊 Validation Rules Summary

| Check | Description | Severity |
|-------|-------------|----------|
| Empty Code | No instructions found | ❌ Error |
| CODE SEGMENT | Must be defined | ❌ Error |
| CODE ENDS | Must close CODE SEGMENT | ❌ Error |
| START Label | Entry point required | ❌ Error |
| END Directive | Program termination | ❌ Error |
| ASSUME | Segment register assignment | ❌ Error |
| DATA SEGMENT | Required if referencing DATA | ❌ Error |
| DATA ENDS | Must close DATA SEGMENT | ❌ Error |
| Balanced SEGMENT/ENDS | Equal count required | ❌ Error |
| Complete Instructions | Operands required | ❌ Error |
| Syntax | No double commas, etc. | ❌ Error |

---

## 🎯 Valid vs Invalid Examples

### **❌ Invalid: Missing Segments**
```assembly
START:
    MOV AX, 5
```
**Error:** Missing CODE SEGMENT, ASSUME, END directive

### **✅ Valid: Minimal Program**
```assembly
ASSUME CS:CODE

CODE SEGMENT
START:
    MOV AH, 4CH
    INT 21H
CODE ENDS

END START
```

### **❌ Invalid: Incomplete Instructions**
```assembly
ASSUME CS:CODE

CODE SEGMENT
START:
    MOV     # Missing operands!
    ADD     # Missing operands!
CODE ENDS

END START
```

### **✅ Valid: With Data Segment**
```assembly
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM DB 10H
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    MOV AL, NUM
    MOV AH, 4CH
    INT 21H
CODE ENDS

END START
```

---

## 🔄 Execution Flow

```
User clicks "Run"
    ↓
Frontend sends code to backend
    ↓
Backend validates code structure
    ↓
├─ Invalid? → Return 400 with errors + template
│              ↓
│           Display in output panel
│              ↓
│           No execution attempted
│
└─ Valid? → Proceed to AI execution
               ↓
            Generate assembly output
               ↓
            Return results to frontend
```

---

## 📈 Benefits

### **Code Quality:**
- ✅ Every program has proper structure
- ✅ No incomplete submissions
- ✅ Students learn best practices

### **Learning Experience:**
- ✅ Immediate feedback on mistakes
- ✅ Template code for reference
- ✅ Understanding of MASM requirements

### **Error Prevention:**
- ✅ Catches issues before execution
- ✅ Saves API calls on invalid code
- ✅ Reduces confusion

### **Teaching Aid:**
- ✅ Reinforces proper format
- ✅ Consistent error messages
- ✅ Self-guided correction

---

## 🧪 Testing Validation

### **Test Case 1: Empty Code**
```assembly
# Leave editor blank or only comments
```
Expected: Error about empty code

### **Test Case 2: Only Instructions**
```assembly
MOV AX, 5
ADD AX, 3
```
Expected: Multiple errors (missing segments, labels, directives)

### **Test Case 3: Missing END**
```assembly
ASSUME CS:CODE
CODE SEGMENT
START:
    MOV AX, 5
CODE ENDS
# Forgot END START
```
Expected: Error about missing END directive

### **Test Case 4: Unbalanced Segments**
```assembly
DATA SEGMENT
DATA ENDS

CODE SEGMENT
START:
# Forgot CODE ENDS
END START
```
Expected: Error about missing CODE ENDS

---

## 🚀 Future Enhancements

Potential improvements:

1. **Line-Specific Errors**
   - Point to exact line number
   - Highlight in editor
   - Quick-fix suggestions

2. **Warning System**
   - Non-critical issues
   - Best practice recommendations
   - Optimization hints

3. **Auto-Fix**
   - Generate missing segments
   - Add required directives
   - Format code properly

4. **Custom Templates**
   - Save common structures
   - Project-specific templates
   - Course-specific requirements

5. **Progressive Validation**
   - Different rules for beginner/advanced
   - Configurable strictness
   - Learning mode vs exam mode

---

## 📝 Configuration

Currently, validation is **always enabled** with no configuration needed.

Future config options might include:
```typescript
{
  strictMode: boolean,      // Enforce all rules
  allowEmptyData: boolean,  // DATA SEGMENT optional
  requireComments: boolean, // Enforce documentation
  maxLines: number,         // Limit program size
}
```

---

## ✨ Summary

**Status:** ✅ Fully implemented and active

**What It Does:**
- Validates MASM code structure before execution
- Provides clear, educational error messages
- Shows template code for reference
- Prevents execution of invalid code

**Impact:**
- Students write better code
- Fewer confusing errors
- Faster learning curve
- Higher code quality

**Result:** 
MASM Studio now teaches proper assembly programming from the first line of code! 🎉

---

**Need Help?** Check the validation errors carefully - they include everything you need to fix the issue!
