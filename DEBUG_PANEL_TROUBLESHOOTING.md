# 🐛 Debug Panel Troubleshooting Guide

## Overview

The Debug Panel shows register values, CPU flags, and memory contents after code execution. If it's not working, follow this guide.

---

## 🎯 Expected Behavior

### **After Running Code:**
1. ✅ Output panel shows execution results
2. ✅ Debug panel automatically appears at bottom
3. ✅ Shows:
   - **Registers** - AX, BX, CX, DX, SI, DI, BP, SP, CS, DS, ES, SS, IP
   - **Flags** - ZF, CF, SF, OF, PF
   - **Memory** - Data segment values

### **Debug Panel Location:**
- **Desktop:** Bottom of screen (800px height)
- **Mobile:** Bottom of screen (384px height)

---

## 🔍 Troubleshooting Steps

### **Step 1: Check Console Logs**

Open browser console (`F12` → Console tab) and look for:

```
📊 Execution Result: {success: true, ...}
📊 Registers: {AX: "1000", BX: "0000", ...}
📊 Flags: {ZF: "0", CF: "0", ...}
📊 Memory: [{offset: "DS:0000", value: "10", ...}]
🐛 Debug: Execution result received: {...}
🐛 Debug: Registers: {...}
🐛 Debug: Flags: {...}
🐛 Debug: Memory: [...]
```

**What to look for:**
- ✅ If you see these logs → Data is arriving from backend
- ❌ If missing → Backend not sending data properly
- ❌ If "null" or empty → Validation or execution error

---

### **Step 2: Verify Backend Response**

Check the backend response structure:

**Expected format:**
```json
{
  "success": true,
  "output": "BUILD SUCCEEDED...",
  "registers": {
    "AX": "1000",
    "BX": "0000",
    "CX": "0000",
    "DX": "0000",
    "SI": "0000",
    "DI": "0000",
    "BP": "0000",
    "SP": "FFFE",
    "CS": "0B1A",
    "DS": "0B0A",
    "ES": "0B0A",
    "SS": "0B1A",
    "IP": "0000"
  },
  "flags": {
    "ZF": "0",
    "SF": "0",
    "CF": "0",
    "OF": "0",
    "PF": "0"
  },
  "memory": [
    {"offset": "DS:0000", "value": "10", "symbol": "ARRAY[0]"}
  ],
  "steps": [...],
  "symbolTable": [...]
}
```

**Check in Network tab:**
1. Open DevTools (`F12`)
2. Go to Network tab
3. Click "Run" in editor
4. Find `/api/execute` request
5. Check Response → Should match format above

---

### **Step 3: Test with Working Code**

Use this guaranteed-to-work test program:

```assembly
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM1 DB 10H
    NUM2 DB 20H
    RESULT DB ?
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, NUM1
    ADD AL, NUM2
    MOV RESULT, AL
    
    MOV AH, 4CH
    INT 21H
CODE ENDS

END START
```

**After running:**
- Check console for debug logs
- Debug panel should appear automatically
- Should show:
  - `AL` with value from NUM1+NUM2
  - `DS` with data segment address
  - Memory showing NUM1, NUM2, RESULT values

---

### **Step 4: Manual Toggle**

If auto-show doesn't work, try manual toggle:

1. **Desktop:** Click bug icon (🐛) in toolbar
2. **Mobile:** Scroll down, click floating "Debug" button
3. Debug panel should appear

If clicking does nothing:
- Check console for React errors
- Verify `showDebug` state is changing (React DevTools)

---

### **Step 5: Check Component Rendering**

Open React DevTools:

1. Install React DevTools extension
2. Open DevTools → Components tab
3. Find `EditorPage` component
4. Check state:
   - `executionResult` - Should have data after run
   - `showDebug` - Should be `true` when panel visible
   - `registers`, `flags`, `memory` - Check values

---

## 🚨 Common Issues & Fixes

### **Issue 1: Debug Panel Not Appearing**

**Symptom:** Code runs successfully but no debug panel

**Causes:**
1. `executionResult.success` is false
2. Validation error (no execution happened)
3. Frontend not storing result

**Fix:**
```javascript
// Check in console:
console.log('executionResult:', executionResult);
console.log('showDebug:', showDebug);

// Should see:
// executionResult: {success: true, registers: {...}, ...}
// showDebug: true
```

If `executionResult` is null:
- Backend returned error
- Validation failed
- Check Output panel for errors

---

### **Issue 2: Debug Panel Shows "Run code to see register values"**

**Symptom:** Panel appears but shows placeholder text

**Cause:** `registers` object is empty `{}`

**Fix:**
Check backend is sending registers in correct format:
```typescript
// Backend should send:
registers: parsedOutput.execution?.finalState?.registers || {}

// Not:
registers: parsedOutput.registers // Wrong path!
```

**Verify in backend code:**
```typescript
// File: backend/src/routes/execute.ts
res.json({
  success: true,
  registers: parsedOutput.execution?.finalState?.registers || {},
  // ^^^ This line is critical!
  flags: parsedOutput.execution?.finalState?.flags || {},
  memory: parsedOutput.finalMemory || [],
});
```

---

### **Issue 3: Panel Appears But Empty/Broken**

**Symptom:** Panel visible but no data or errors

**Causes:**
1. Wrong data structure from backend
2. Component props not receiving data
3. TypeScript type mismatch

**Fix:**
```typescript
// Debug in page.tsx:
<RegisterPanel 
  registers={executionResult.registers || {}}
/>

// Add console log before:
console.log('Passing to RegisterPanel:', executionResult.registers);
```

Expected format:
```javascript
{
  "AX": "1000",
  "BX": "0000",
  // etc...
}
```

---

### **Issue 4: Debug Panel Cut Off / Hidden**

**Symptom:** Panel exists but not visible on screen

**Causes:**
1. CSS height issue
2. Parent overflow hidden
3. Z-index problem

**Fix:**
- Scroll down to see panel
- Check CSS:
```css
/* Should have: */
.debug-panel {
  height: 320px; /* or h-80 */
  flex-shrink: 0; /* Don't collapse */
  overflow: auto;
}
```

---

### **Issue 5: Unicode Characters Breaking Display**

**Symptom:** Garbled text or syntax errors

**Fix:** Already fixed! All Unicode replaced with ASCII. If still seeing issues:
- Hard refresh (`Ctrl+Shift+R`)
- Clear browser cache
- Restart backend server

---

## 🧪 Testing Checklist

Run through this checklist:

### **Frontend Running:**
- [ ] `cd frontend && npm run dev`
- [ ] Accessible at http://localhost:3000
- [ ] No console errors on page load

### **Backend Running:**
- [ ] `cd backend && npm run dev`
- [ ] Accessible at http://localhost:5000
- [ ] No startup errors

### **Authentication:**
- [ ] Logged in with API key
- [ ] API key valid and working
- [ ] Check localStorage has `geminiApiKey`

### **Code Execution:**
- [ ] Code has proper MASM structure
- [ ] Passes validation (no validation errors)
- [ ] Executes successfully (see BUILD SUCCEEDED)
- [ ] Output panel shows results

### **Debug Panel:**
- [ ] Panel appears automatically after run
- [ ] Shows register values (not placeholders)
- [ ] Shows flag values
- [ ] Shows memory contents
- [ ] Can toggle panel on/off

---

## 📊 Debug Panel Components

### **1. Register Panel**
- Shows all 8086 registers
- Groups: General Purpose, Index/Pointer, Segment, IP
- Highlights non-zero values
- Format: `AX=1000H`

### **2. Flags Panel**
- Shows 6 CPU flags
- Interactive tooltips on hover
- Color-coded: Set (green) vs Clear (gray)
- Flags: ZF, CF, SF, OF, PF, AF

### **3. Memory Viewer**
- Shows data segment memory
- Searchable by offset or symbol
- View modes: Hex, Decimal, ASCII
- Format: `Offset | Value | Symbol`

---

## 🔧 Developer Tools

### **Check Zustand Store:**
```javascript
// In browser console:
window.store = useExecutionStore.getState();
console.log('Execution Result:', window.store.executionResult);
console.log('Registers:', window.store.executionResult?.registers);
```

### **Force Show Debug Panel:**
```javascript
// In browser console:
const { setShowDebug } = useExecutionStore.getState();
setShowDebug(true);
```

### **Inspect Component Props:**
```javascript
// React DevTools → Components → RegisterPanel
// Check props.registers value
```

---

## 🎯 Quick Test Script

Copy this into browser console to test:

```javascript
// Test if debug panel can appear
const result = {
  success: true,
  registers: {
    AX: "1000", BX: "0000", CX: "0000", DX: "0000",
    SI: "0000", DI: "0000", BP: "0000", SP: "FFFE",
    CS: "0B1A", DS: "0B0A", ES: "0B0A", SS: "0B1A", IP: "0000"
  },
  flags: {
    ZF: "0", SF: "0", CF: "0", OF: "0", PF: "0"
  },
  memory: [
    {offset: "DS:0000", value: "10", symbol: "NUM1"}
  ]
};

// Set execution result
useExecutionStore.getState().setExecutionResult(result);

// Debug panel should appear automatically
// If not, check console for errors
```

---

## 📝 Expected Console Output

When everything works:

```
📊 Execution Result: {success: true, output: "...", registers: {...}, ...}
📊 Registers: {AX: "1000", BX: "0000", ...}
📊 Flags: {ZF: "0", CF: "0", ...}
📊 Memory: [{offset: "DS:0000", value: "10", symbol: "NUM1"}]
🐛 Debug: Execution result received: {success: true, ...}
🐛 Debug: Registers: {AX: "1000", ...}
🐛 Debug: Flags: {ZF: "0", ...}
🐛 Debug: Memory: [{...}]
```

---

## 🚀 Final Checklist

If debug panel still not working:

1. **Restart everything:**
   ```bash
   # Backend
   cd backend
   npm run dev
   
   # Frontend (new terminal)
   cd frontend
   npm run dev
   ```

2. **Clear browser cache:**
   - `Ctrl+Shift+Delete` → Clear cache
   - Or hard refresh: `Ctrl+Shift+R`

3. **Check file changes applied:**
   - `frontend/app/editor/page.tsx` - Has auto-show useEffect
   - `backend/src/routes/execute.ts` - Returns correct structure

4. **Test with minimal code:**
   - Use the test program above
   - Should always work if system is healthy

5. **Check browser compatibility:**
   - Chrome/Edge: ✅ Recommended
   - Firefox: ✅ Should work
   - Safari: ⚠️ May have issues
   - IE: ❌ Not supported

---

## 💡 Need More Help?

**Check these files:**
- `frontend/app/editor/page.tsx` - Main editor with debug panel
- `frontend/components/debug/RegisterPanel.tsx` - Register display
- `frontend/components/debug/FlagsPanel.tsx` - Flags display
- `frontend/components/debug/MemoryViewer.tsx` - Memory display
- `backend/src/routes/execute.ts` - Execution API endpoint

**Console commands:**
```javascript
// Check store state
useExecutionStore.getState()

// Check execution result
useExecutionStore.getState().executionResult

// Force show debug
useExecutionStore.getState().setShowDebug(true)
```

---

**Status:** ✅ Debug panel should auto-show after code execution and display register/flag/memory data!
