# 🤖 AI Context-Aware Assistant Guide

## Overview

The AI Assistant now has full awareness of your code, execution results, and errors - making it a truly intelligent coding companion!

---

## 🎯 What the AI Can See

### **1. Your Code**
The AI has access to everything in the editor:
- All assembly instructions
- Variable declarations
- Comments
- Code structure

### **2. Execution Results**
After running code, the AI knows:
- Final register values (AX, BX, CX, DX, etc.)
- CPU flags (ZF, CF, SF, OF, PF)
- Execution output
- Success or failure status

### **3. Errors**
When errors occur, the AI sees:
- Error messages
- Line numbers
- Validation issues
- Compilation failures

### **4. Conversation History**
The AI remembers:
- Last 3 message exchanges
- Context from previous questions
- Your learning progression

---

## ✨ Context Indicators

In the AI Assistant header, you'll see badges:

```
🌟 AI Assistant  [Code]  [Results]
```

- **Code** badge (blue) - AI can see your current code
- **Results** badge (green) - AI can see execution results

---

## 💬 Example Conversations

### **Before Running Code:**

**You:** "What does MOV AX, DATA do?"

**AI sees:**
```
CURRENT CODE IN EDITOR:
```asm
ASSUME CS:CODE, DS:DATA
DATA SEGMENT
    NUM DB 10H
DATA ENDS
CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
```

**AI responds:** "The instruction `MOV AX, DATA` loads the address of the DATA segment into the AX register. In your code, this is preparing to initialize the DS register with the data segment address..."

---

### **After Running Code:**

**You:** "Why is AX showing 1000H?"

**AI sees:**
```
CURRENT CODE IN EDITOR: [your code]

LAST EXECUTION OUTPUT:
BUILD SUCCEEDED
Final Registers: AX=1000 BX=0000 ...

FINAL REGISTER VALUES:
AX=1000 BX=0000 CX=0000 DX=0000 SI=0000 DI=0000 BP=0000 SP=FFFE

FLAGS: ZF=0 CF=0 SF=0 OF=0 PF=0
```

**AI responds:** "AX contains 1000H because that's the segment address of your DATA segment. When you executed `MOV AX, DATA`, the assembler loaded this address. This is typical - segment addresses in 8086 are 16-bit values representing the start of memory segments..."

---

### **When Errors Occur:**

**You:** "Why isn't my code working?"

**AI sees:**
```
CURRENT CODE IN EDITOR: [your code]

CURRENT ERRORS:
Line 5: Missing CODE SEGMENT
Line 8: Missing END directive
```

**AI responds:** "Your code has two structure issues:

1. Line 5 is missing the CODE SEGMENT definition. Every MASM program needs to define its code segment.
2. Line 8 is missing the END directive. Programs must end with 'END START'.

Here's how to fix it:
```asm
CODE SEGMENT
START:
    ; your code here
    MOV AH, 4CH
    INT 21H
CODE ENDS

END START
```"

---

## 🎓 Smart Question Examples

### **Code Explanation:**
- "Explain my code"
- "What does line 10 do?"
- "Walk me through this program step by step"

### **Debugging:**
- "Why is my loop not terminating?"
- "Why is the Zero Flag set?"
- "What's wrong with my code?"

### **Learning:**
- "How do I add two numbers?"
- "Explain the difference between AX and AL"
- "What's the purpose of the stack?"

### **Results Analysis:**
- "Why is BX still zero?"
- "Is this the expected output?"
- "What do these register values mean?"

### **Optimization:**
- "Can I make this code faster?"
- "Is there a better way to do this?"
- "How can I simplify this?"

---

## 🔍 How Context Flows

### **Step 1: Write Code**
```assembly
ASSUME CS:CODE, DS:DATA

DATA SEGMENT
    NUM1 DB 10H
    NUM2 DB 20H
DATA ENDS

CODE SEGMENT
START:
    MOV AX, DATA
    MOV DS, AX
    
    MOV AL, NUM1
    ADD AL, NUM2
    
    MOV AH, 4CH
    INT 21H
CODE ENDS

END START
```

**AI now sees:** Your code structure, variables, instructions

---

### **Step 2: Run Code**
Click "Run" → Backend executes → Results appear

**AI now sees:**
- Code + Results
- Register values: AL=30H (10H + 20H)
- Flags: ZF=0, CF=0, etc.
- Output: "BUILD SUCCEEDED..."

---

### **Step 3: Ask Questions**

**Example 1:** "Why is AL 30H?"

**AI uses context:**
```
Code: MOV AL, NUM1 (10H) + ADD AL, NUM2 (20H)
Result: AL=30H
Calculation: 10H + 20H = 30H (48 decimal)
```

**Response:** "AL is 30H because your code adds NUM1 (10H) and NUM2 (20H). In hexadecimal: 10H + 20H = 30H, which is 48 in decimal. This is the expected result of your addition."

---

**Example 2:** "Should I use AX or AL here?"

**AI uses context:**
```
Code shows: NUM1 DB 10H, NUM2 DB 20H
Both are BYTE (8-bit) variables
```

**Response:** "You should use AL (not AX) because NUM1 and NUM2 are defined as DB (Define Byte), which means they're 8-bit values. AL is the low byte of AX and handles 8-bit operations. Using AX would work but is unnecessary and might cause confusion."

---

## 🚀 Advanced Features

### **Multi-Turn Conversations**

**Turn 1:**
You: "What does my loop do?"
AI: [Explains loop with reference to your code]

**Turn 2:**
You: "How can I optimize it?"
AI: [Suggests optimization, knowing your exact loop structure]

**Turn 3:**
You: "Will that change the result?"
AI: [Analyzes impact based on current register values]

---

### **Error Recovery**

**Scenario:** Code has validation errors

**You:** "How do I fix this?"

**AI Response:**
```
You have 3 validation errors:
1. Missing CODE SEGMENT (Line 5)
2. Missing DATA ENDS (Line 8)
3. Missing END directive

Here's your code with fixes:
[Shows corrected version with highlights]
```

---

### **Learning Path Awareness**

The AI adapts explanations based on what you're working on:

- **Beginner code** (simple MOV) → Basic explanations
- **Advanced code** (complex loops) → Technical details
- **Error-prone code** → Patient, step-by-step guidance

---

## 📊 What Gets Sent to AI

### **Full Context Payload:**

```typescript
{
  message: "Why is AX 1000H?",
  context: {
    code: "[your full code]",
    output: "[execution output, first 500 chars]",
    hasErrors: false,
    errors: "",
    executionSuccess: true,
    registers: {
      AX: "1000", BX: "0000", CX: "0000", ...
    },
    flags: {
      ZF: "0", CF: "0", SF: "0", ...
    }
  },
  conversationHistory: [
    {role: "user", content: "previous question"},
    {role: "assistant", content: "previous answer"},
    // ... last 3 exchanges
  ]
}
```

---

## 🎯 Best Practices

### **Be Specific:**
❌ "Help me"
✅ "Why is the Zero Flag set after my ADD instruction?"

### **Reference Your Code:**
❌ "How do loops work?"
✅ "Explain the loop in my code" (AI sees your actual loop)

### **Ask Follow-ups:**
The AI remembers context, so you can build on previous questions:
1. "What does this code do?"
2. "Why did you choose CX for the counter?"
3. "What if I used BX instead?"

### **Leverage Execution Results:**
After running code:
- "Are these register values correct?"
- "Why is the flag pattern different than expected?"
- "Did my loop execute the right number of times?"

---

## 🔒 Privacy & Security

### **What AI Sees:**
✅ Your code in the editor
✅ Execution results
✅ Error messages
✅ Register/flag values

### **What AI Doesn't See:**
❌ Your API key (except to make requests)
❌ Other students' code
❌ Your personal information
❌ File names or project structure

### **Data Handling:**
- Context sent per-message (not stored)
- Conversation history limited to last 3 exchanges
- Uses your own Gemini API key
- No persistent storage of conversations

---

## 💡 Tips & Tricks

### **Tip 1: Run Before Asking**
For best results about specific outcomes:
1. Write your code
2. Click Run
3. Then ask questions (AI has full context)

### **Tip 2: Check Context Badges**
Look at the header badges:
- **Code badge** = AI knows your code
- **Results badge** = AI knows execution results
- Both badges = AI has complete picture!

### **Tip 3: Be Conversational**
The AI understands context, so talk naturally:
- "Why did that happen?"
- "Can you explain the third line?"
- "What's wrong here?"

### **Tip 4: Ask for Alternatives**
- "Show me another way to do this"
- "Is this the best approach?"
- "What if I used a different register?"

---

## 🐛 Troubleshooting

### **AI Doesn't See My Code**

**Check:**
1. Is there code in the editor?
2. Does the header show "Code" badge?
3. Look in console (`F12`) for request payload

**Fix:** Hard refresh (`Ctrl+Shift+R`)

---

### **AI Doesn't See Execution Results**

**Check:**
1. Did you click "Run"?
2. Did execution succeed (no errors)?
3. Does header show "Results" badge?

**Fix:** Run code again, check for errors

---

### **AI Gives Generic Answers**

**Possible causes:**
- Context not being sent (check Network tab)
- API key issue
- Code too large (>5000 chars might be truncated)

**Fix:** 
- Check console for errors
- Verify API key is valid
- Try shorter code examples

---

## 📝 Example Prompts

### **For Code Understanding:**
```
- "Explain this program"
- "What's the purpose of line 15?"
- "Walk me through the execution flow"
- "What do these instructions do together?"
```

### **For Debugging:**
```
- "Why isn't this working?"
- "What's wrong with my loop?"
- "Why is the result incorrect?"
- "Help me understand this error"
```

### **For Learning:**
```
- "How does this instruction work?"
- "What's the difference between MOV and LEA?"
- "Explain memory addressing in my code"
- "Why did you use that register?"
```

### **For Optimization:**
```
- "Can I make this faster?"
- "Is there redundant code here?"
- "What's a better way to do this?"
- "Should I use a different instruction?"
```

---

## ✨ Summary

**The AI Assistant now:**
- ✅ Sees your complete code
- ✅ Knows your execution results
- ✅ Understands your errors
- ✅ Remembers conversation context
- ✅ Provides contextual, relevant answers
- ✅ Adapts to your learning level
- ✅ References specific lines and values

**Result:** A truly intelligent coding companion that understands exactly what you're working on and can provide targeted, helpful guidance! 🎉

---

**Ready to try it?** Write some code, run it, then ask the AI about your results! The context-aware responses will amaze you.
