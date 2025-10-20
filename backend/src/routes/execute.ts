import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt for code execution
const EXECUTION_PROMPT = `You are an 8086 assembly language compiler and simulator. When given MASM code, you must:

1. Parse and validate the syntax
2. Simulate step-by-step execution
3. Track register changes (AX, BX, CX, DX, SI, DI, BP, SP, CS, DS, SS, ES, IP)
4. Track flag changes (CF, ZF, SF, OF, PF, AF)
5. Track memory reads/writes
6. Provide execution trace

Format your response EXACTLY like this:

✅ Code Compiled Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 EXECUTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lines of code: [number]
Instructions: [number]
Execution time: [time]

🔧 REGISTER STATE (After Execution)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AX: [value]h ([decimal])
BX: [value]h ([decimal])
CX: [value]h ([decimal])
DX: [value]h ([decimal])

DS: [value]h
CS: [value]h
SS: [value]h

🚩 FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CF: [0/1]  ZF: [0/1]  SF: [0/1]  OF: [0/1]  PF: [0/1]  AF: [0/1]

💾 MEMORY CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[address]  [value] ([label])  ← [Read/Written]

📝 EXECUTION TRACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: [instruction] → [effect]
Step 2: [instruction] → [effect]
...

✨ Program executed successfully!`;

// Execute assembly code
router.post('/', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Check if AI is configured
    if (!process.env.GEMINI_API_KEY) {
      // Fallback to mock data if no API key
      const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith(';'));
    
    const output = `✅ Code Compiled Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 EXECUTION SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lines of code: ${code.split('\n').length}
Instructions: ${lines.length}
Execution time: 0.002s

🔧 REGISTER STATE (After Execution)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AX: 0050h (80)    ← Result of addition
BX: 0000h (0)
CX: 0000h (0)
DX: 0000h (0)

DS: 0700h         ← Data segment
CS: 0800h         ← Code segment
SS: 0900h         ← Stack segment

🚩 FLAGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CF: 0  ZF: 0  SF: 0  OF: 0  PF: 0  AF: 0

💾 MEMORY CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
0700:0000  20h (OPR1)  ← Read
0700:0001  30h (OPR2)  ← Read
0700:0002  50h (RES)   ← Written (20h + 30h = 50h)

📝 EXECUTION TRACE (First 5 steps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: MOV AX, DATA     → AX = 0700h
Step 2: MOV DS, AX       → DS = 0700h
Step 3: MOV AL, OPR1     → AL = 20h
Step 4: ADD AL, OPR2     → AL = 50h (20h + 30h)
Step 5: MOV AH, 00H      → AH = 00h

✨ Program executed successfully!

⚠️  NOTE: This is simulated output. AI API key not configured.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      return res.json({
        success: true,
        output,
        steps: [],
        registers: {},
        flags: {},
      });
    }

    // Use AI to compile and execute the code
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent output
          maxOutputTokens: 2000,
        }
      });

      const prompt = `${EXECUTION_PROMPT}\n\nNow compile and execute this 8086 MASM code:\n\n\`\`\`asm\n${code}\n\`\`\`\n\nProvide the complete execution analysis.`;

      const result = await model.generateContent(prompt);
      const aiOutput = result.response.text();

      res.json({
        success: true,
        output: aiOutput,
        steps: [],
        registers: {},
        flags: {},
      });

    } catch (aiError: any) {
      console.error('AI Execution error:', aiError);
      
      // Fallback to mock data if AI fails
      const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith(';'));
      
      const fallbackOutput = `⚠️  AI Compilation Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error: ${aiError.message || 'Unknown AI error'}

Showing simulated output instead:

✅ Code Received
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Lines of code: ${code.split('\n').length}
Instructions: ${lines.length}

⚠️  Please check your GEMINI_API_KEY in backend/.env
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

      res.json({
        success: false,
        output: fallbackOutput,
        error: aiError.message,
      });
    }

  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      error: 'Failed to execute code',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
