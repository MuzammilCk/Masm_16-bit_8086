# 🚀 Quick Start - See Your Changes NOW!

## ✅ What Just Got Connected

Your **visual debug panels are now LIVE** in the editor! Here's how to see them:

---

## 1️⃣ Make Sure Backend is Running

```bash
cd backend
npm run dev
```

You should see:
```
🚀 MASM Studio Backend running on port 3001
```

---

## 2️⃣ Refresh Your Frontend

If your frontend is already running:
1. Go to http://localhost:3000/editor
2. **Refresh the page** (Ctrl+R or F5)

Or start it fresh:
```bash
cd frontend
npm run dev
```

---

## 3️⃣ Write & Run Code

Paste this simple program:

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

Click **"Run (F5)"**

---

## 4️⃣ Open Debug Panels

After execution completes, you'll see a new button:

**Option A:** Click the **Bug icon** 🐛 in the toolbar (top-right)  
**Option B:** Click the floating **"Debug"** button (bottom-right)

---

## 5️⃣ What You'll See

### **RegisterPanel** (Left)
```
AX: 4C3A
BX: 0000
CX: 0000
DX: 0000
...
```

### **FlagsPanel** (Middle)
- **ZF**: 0 (Zero Flag)
- **SF**: 0 (Sign Flag)
- **CF**: 0 (Carry Flag)
- Hover for descriptions!

### **MemoryViewer** (Right)
```
OFFSET      VALUE   SYMBOL
DS:0000     15      NUM1
DS:0001     25      NUM2
DS:0002     3A      RES
```

---

## 🎯 Features to Try

### In MemoryViewer:
1. **Search:** Type "RES" in the search box
2. **Change View:** Click "Decimal" or "ASCII" buttons
3. **Scroll:** See all memory locations

### With RegisterPanel:
- Changed values appear in **blue/primary color**
- Organized by category (General Purpose, Index, Segment)

### With FlagsPanel:
- **Hover** over any flag for description
- **Set flags** appear highlighted
- Color-coded for easy reading

---

## 🐛 Troubleshooting

### "Debug button doesn't appear"
- Make sure code executed successfully
- Check backend is running (http://localhost:3001/health)
- Look in browser console for errors

### "Panels are empty"
- The AI execution might have failed
- Check the execution output for errors
- Make sure your code compiles correctly

### "Can't see the panels"
- Try clicking the Bug icon in toolbar
- Make sure you clicked "Run" first
- Refresh the page and try again

---

## 🎉 Success!

You now have **LIVE VISUAL DEBUGGING** in your MASM Studio!

**What changed:**
- ✅ Debug panels integrated into editor
- ✅ Execution results stored for visualization
- ✅ Toggle button in toolbar
- ✅ 3-panel debug layout at bottom
- ✅ Full register, flag, and memory inspection

**No changes needed to backend** - it was already ready!

---

## 📚 Next Steps

Want to add more features? Check these guides:

1. **INTEGRATION_COMPLETE.md** - What's connected now
2. **COMPLETE_SETUP_GUIDE.md** - Full backend features
3. **FEATURES_IMPLEMENTED.md** - All available features

**All backend features are ready to be connected!**
- Authentication
- Code Sharing
- Classes & Assignments
- Tutorials & Achievements
- Real-time Collaboration

Just need to build the UI! 🎨
