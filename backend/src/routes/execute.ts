import express from 'express';
import { getSystemPrompt } from '../utils/promptLoader';
import { Session } from '../models/Session';

const router = express.Router();

// Helper function to format JSON output as readable text
function formatExecutionOutput(data: any): string {
  if (data.error) {
    return `BUILD FAILED\n========================================================\n\nError: ${data.error}\n\n${data.rawOutput || ''}`;
  }

  let output = '';
  const hasErrors = data.compilation?.errors?.length > 0;

  // ============ BUILD PROCESS ============
  output += '[Build Process]\n';
  output += 'BUILD STARTED...\n\n';

  // Symbol Table (if compilation succeeded or has symbols)
  if (data.symbolTable && data.symbolTable.length > 0) {
    output += 'Symbol Table:\n';
    output += 'Label'.padEnd(15) + 'Segment'.padEnd(12) + 'Type'.padEnd(12) + 'Size'.padEnd(10) + 'Initial Value\n';
    output += '─'.repeat(70) + '\n';
    data.symbolTable.forEach((sym: any) => {
      output += `${(sym.label || '').padEnd(15)}${(sym.segment || '').padEnd(12)}${(sym.type || '').padEnd(12)}${(sym.size || '').padEnd(10)}${sym.value || ''}\n`;
    });
    output += '\n';
  }

  // Initial Memory Layout (if available)
  if (data.initialMemory && data.initialMemory.length > 0) {
    output += 'Initial Memory Layout (DATA Segment):\n';
    output += 'Offset'.padEnd(12) + 'Value (Hex)'.padEnd(15) + 'Symbol\n';
    output += '─'.repeat(50) + '\n';
    data.initialMemory.forEach((mem: any) => {
      output += `${(mem.offset || '').padEnd(12)}${(mem.value || '').padEnd(15)}${mem.symbol || ''}\n`;
    });
    output += '\n';
  }

  // Compilation result
  if (hasErrors) {
    output += 'BUILD FAILED.\n\n';
    output += '========================================================\n';
    output += 'ERRORS FOUND:\n';
    output += '========================================================\n\n';
    
    data.compilation.errors.forEach((err: any, idx: number) => {
      output += `Error ${idx + 1}: Line ${err.line}, Column ${err.column}\n`;
      output += `└─ ${err.message}\n\n`;
      
      if (err.explanation) {
        output += `WHY: ${err.explanation}\n\n`;
      }
      
      if (err.suggestion) {
        output += `FIX: ${err.suggestion}\n\n`;
        
        // Add example if suggestion contains code
        if (err.example) {
          output += `EXAMPLE: ${err.example}\n\n`;
        }
      }
      
      output += '='.repeat(50) + '\n';
    });
    
    output += '\nBUILD FAILED. Fix the errors above and click Run again.\n';
    return output;
  } else {
    output += 'BUILD SUCCEEDED.\n\n';
  }

  // ============ EXECUTION PROCESS ============
  output += '[Execution Process]\n';
  output += 'EXECUTION STARTED...\n\n';

  const exec = data.execution;
  if (exec?.steps && exec.steps.length > 0) {
    let loopCounter = 0;
    let inLoop = false;

    exec.steps.forEach((step: any, idx: number) => {
      const instruction = step.instruction || '';
      
      // Detect loop iterations
      if (instruction.includes('LOOP') || instruction.toLowerCase().includes('loop')) {
        loopCounter++;
        inLoop = true;
        output += `\nLoop Iteration ${loopCounter}\n`;
        if (step.description) output += `${step.description}\n`;
        if (step.registers) {
          Object.entries(step.registers).forEach(([reg, val]) => {
            output += `${reg}=${val}, `;
          });
          output = output.slice(0, -2) + '\n';
        }
      } else if (instruction.includes('MOV') && instruction.includes('4CH')) {
        // Termination
        output += `\nStep (Termination)\n`;
        output += `Instruction: ${instruction}`;
        if (step.registers) {
          Object.entries(step.registers).forEach(([reg, val]) => {
            output += ` → ${reg}=${val}`;
          });
        }
        output += '\n';
      } else if (instruction.includes('INT 21H')) {
        output += `Instruction: ${instruction} → Program terminated\n`;
        output += 'PROGRAM HALTED..\n';
      } else {
        // Regular step
        if (!inLoop || loopCounter === 0) {
          output += `Step ${idx + 1}\n`;
        }
        output += `Instruction: ${instruction}`;
        
        if (step.description) {
          output += ` → ${step.description}`;
        }
        
        if (step.registers) {
          Object.entries(step.registers).forEach(([reg, val]) => {
            output += ` → ${reg}=${val}`;
          });
        }
        output += '\n';
      }
    });
  }

  output += '\n';

  // ============ FINAL STATE SUMMARY ============
  output += '[Final State Summary]\n';
  
  // Final Registers
  if (exec?.finalState?.registers) {
    output += 'Final Registers:\n';
    const regs = exec.finalState.registers;
    ['AX', 'BX', 'CX', 'DX', 'SI', 'DI', 'BP', 'SP'].forEach(reg => {
      if (regs[reg] !== undefined) {
        output += `${reg}=${regs[reg]}  `;
      }
    });
    output += '\n';
    ['CS', 'DS', 'ES', 'SS', 'IP'].forEach(reg => {
      if (regs[reg] !== undefined) {
        output += `${reg}=${regs[reg]}  `;
      }
    });
    output += '\n\n';
  }

  // Final Memory State
  if (data.finalMemory && data.finalMemory.length > 0) {
    output += 'Final Memory State (DATA Segment):\n';
    output += 'Offset'.padEnd(12) + 'Value (Hex)'.padEnd(15) + 'Symbol\n';
    output += '─'.repeat(50) + '\n';
    data.finalMemory.forEach((mem: any) => {
      output += `${(mem.offset || '').padEnd(12)}${(mem.value || '').padEnd(15)}${mem.symbol || ''}\n`;
    });
    output += '\n';
  }

  // Flags
  if (exec?.finalState?.flags) {
    output += 'Final Flags:\n';
    const flags = exec.finalState.flags;
    Object.entries(flags).forEach(([flag, val]) => {
      output += `${flag}=${val}  `;
    });
    output += '\n\n';
  }

  // ============ CONCLUSION ============
  output += '[Conclusion]\n';
  if (data.summary) {
    output += `${data.summary}\n`;
  } else {
    output += 'Program executed successfully.\n';
  }
  output += 'PROCESS FINISHED with exit code 0.\n';

  return output;
}

// Validate MASM code structure
function validateMASMCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const lines = code.trim().split('\n').map(l => l.trim()).filter(l => l && !l.startsWith(';'));
  
  if (lines.length === 0) {
    errors.push('ERROR: Empty code - No assembly instructions found');
    return { valid: false, errors };
  }
  
  // Check for basic MASM structure
  const codeUpper = code.toUpperCase();
  const hasDataSegment = codeUpper.includes('DATA SEGMENT');
  const hasCodeSegment = codeUpper.includes('CODE SEGMENT');
  const hasStart = codeUpper.includes('START:');
  const hasEnd = codeUpper.includes('END ');
  const hasAssume = codeUpper.includes('ASSUME');
  
  // Must have CODE SEGMENT
  if (!hasCodeSegment) {
    errors.push('ERROR: Missing CODE SEGMENT - Every MASM program must have a CODE SEGMENT definition');
  }
  
  // Must have START label
  if (!hasStart) {
    errors.push('ERROR: Missing START label - Program entry point "START:" not found');
  }
  
  // Must have END directive
  if (!hasEnd) {
    errors.push('ERROR: Missing END directive - Program must end with "END START" or "END <label>"');
  }
  
  // Must have ASSUME directive
  if (!hasAssume) {
    errors.push('ERROR: Missing ASSUME directive - Must specify segment registers (e.g., ASSUME CS:CODE, DS:DATA)');
  }
  
  // If uses DATA, must have DATA SEGMENT and ENDS
  if (codeUpper.includes('MOV DS') || codeUpper.includes('MOV AX, DATA')) {
    if (!hasDataSegment) {
      errors.push('ERROR: Missing DATA SEGMENT - Code references data segment but DATA SEGMENT is not defined');
    }
    if (!codeUpper.includes('DATA ENDS')) {
      errors.push('ERROR: Missing DATA ENDS - DATA SEGMENT must be closed with "DATA ENDS"');
    }
  }
  
  // Must have CODE ENDS
  if (hasCodeSegment && !codeUpper.includes('CODE ENDS')) {
    errors.push('ERROR: Missing CODE ENDS - CODE SEGMENT must be closed with "CODE ENDS"');
  }
  
  // Check for balanced SEGMENT/ENDS
  const segmentCount = (codeUpper.match(/\bSEGMENT\b/g) || []).length;
  const endsCount = (codeUpper.match(/\bENDS\b/g) || []).length;
  if (segmentCount !== endsCount) {
    errors.push(`ERROR: Unbalanced segments - Found ${segmentCount} SEGMENT declaration(s) but ${endsCount} ENDS statement(s)`);
  }
  
  // Check for common syntax errors
  if (code.includes(',,')) {
    errors.push('ERROR: Syntax error - Double comma detected, check your operands');
  }
  
  // Check for instructions without operands where needed
  const instructionsNeedingOperands = ['MOV', 'ADD', 'SUB', 'MUL', 'DIV', 'CMP', 'AND', 'OR', 'XOR'];
  for (const inst of instructionsNeedingOperands) {
    const regex = new RegExp(`\\b${inst}\\s*$`, 'im');
    if (regex.test(code)) {
      errors.push(`ERROR: Incomplete instruction - ${inst} requires operands`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// Execute assembly code
router.post('/', async (req, res) => {
  try {
    const { code, apiKey, sessionId } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log('[/api/execute] Received code:', code);

    // Track session for admin dashboard
    const username = req.body.username || 'Anonymous';
    const sid = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      let session = await Session.findOne({ sessionId: sid });
      
      if (!session) {
        session = new Session({
          sessionId: sid,
          username,
          codeExecuted: code,
          executionCount: 1,
          errorMessages: [],
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        });
      } else {
        session.executionCount += 1;
        session.codeExecuted = code;
        session.lastActivity = new Date();
      }
      
      await session.save();
    } catch (sessionError) {
      console.error('Session tracking error:', sessionError);
      // Don't fail execution if session tracking fails
    }

    // Validate code structure before execution
    const validation = validateMASMCode(code);
    if (!validation.valid) {
      const errorOutput = `Code Validation Failed
========================================================

${validation.errors.join('\n\n')}

Common MASM Program Structure:
========================================================

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

========================================================

Required Elements:
1. ASSUME directive - Defines segment registers
2. DATA SEGMENT...DATA ENDS - For variables
3. CODE SEGMENT...CODE ENDS - For instructions
4. START: label - Program entry point
5. END START - Program termination
`;
      
      // Track validation error in session
      try {
        const session = await Session.findOne({ sessionId: sid });
        if (session) {
          session.errorMessages.push('Code validation failed: ' + validation.errors[0]);
          await session.save();
        }
      } catch (e) {
        console.error('Error tracking failed:', e);
      }
      
      return res.status(400).json({
        success: false,
        output: errorOutput,
        error: 'Code validation failed',
        validationErrors: validation.errors
      });
    }
    
    // Check if user provided API key
    if (!apiKey) {
      const errorOutput = `AI Execution Failed
========================================================

Error: No Gemini API key provided.

Please provide your Gemini API key during sign-in.
`;
      
      // Track error in session
      try {
        const session = await Session.findOne({ sessionId: sid });
        if (session) {
          session.errorMessages.push('No Gemini API key provided');
          await session.save();
        }
      } catch (e) {
        console.error('Error tracking failed:', e);
      }
      
      return res.status(400).json({ 
        success: false, 
        output: errorOutput, 
        error: 'No Gemini API key provided' 
      });
    }

    // Use AI to compile and execute the code
    try {
      // Use simplified system prompt to avoid token limits
      const systemPrompt = `You are an 8086 assembly language compiler and simulator. Analyze MASM syntax code.`;
      const userPrompt = `${systemPrompt}

Compile and execute this 8086 MASM code:

\`\`\`asm
${code}
\`\`\`

Provide the complete execution analysis in VALID JSON format with this structure:
{
  "fileName": "main.asm",
  "symbolTable": [{"label": "ARRAY", "segment": "DATA", "type": "Variable", "size": "DB×5", "value": "10H,20H,..."}],
  "initialMemory": [{"offset": "DS:0000", "value": "10", "symbol": "ARRAY[0]"}],
  "compilation": {
    "status": "success" or "error",
    "errors": [{"line": 1, "column": 1, "message": "error text", "explanation": "why this happened", "suggestion": "clear fix instruction", "example": "corrected code line"}],
    "warnings": ["warning text"]
  },
  "execution": {
    "status": "success" or "error",
    "steps": [{"step": 1, "instruction": "MOV AX, DATA", "description": "Init data segment", "registers": {"AX": "1000"}}],
    "finalState": {"registers": {"AX": "0000", "BX": "0000", "CX": "0000", "DX": "0000", "SI": "0000", "DI": "0000", "SP": "FFFE", "BP": "0000", "CS": "0B1A", "DS": "0B0A", "ES": "0B0A", "SS": "0B1A", "IP": "0000"}, "flags": {"ZF": "0", "SF": "0", "CF": "0", "OF": "0", "PF": "0"}},
    "output": ""
  },
  "finalMemory": [{"offset": "DS:0000", "value": "10", "symbol": "ARRAY[0]"}],
  "summary": "Program calculates sum of array elements. Final result stored in SUM."
}

IMPORTANT: 
1. Return ONLY the JSON object, no markdown code blocks, no explanations
2. Include complete symbol table with all variables and labels
3. Show initial memory layout for DATA segment
4. Provide step-by-step execution with register changes (keep descriptions BRIEF - max 10 words)
5. Include final memory state showing how values changed
6. Use hex values (e.g., "0005", "00F0") for consistency
7. For errors: provide clear, student-friendly suggestions with corrected code examples
8. Keep response concise to fit within token limit - prioritize accuracy over verbosity`;

      // Set the Gemini API Endpoint - using stable fast model
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "contents": [
            { "parts": [{"text": userPrompt}] }
          ],
          "generationConfig": {
            "temperature": 0.1,  // Lower for faster, more focused responses
            "maxOutputTokens": 4096,  // Increased to prevent truncation
            "topP": 0.95,
            "topK": 40
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error Response:', errorText);
        
        let errorJson: any = {};
        try {
          errorJson = JSON.parse(errorText);
        } catch (e) {
          // Not JSON
        }

        // Check for API key errors specifically
        if (response.status === 400 && (errorText.includes('API_KEY_INVALID') || errorText.includes('API key not valid'))) {
          const errorOutput = `Invalid API Key
========================================================

Your Gemini API key is invalid or has been revoked.

Error: ${errorJson.error?.message || 'API key not valid'}

How to fix:
1. Get a new API key from: https://aistudio.google.com/app/apikey
2. Sign out and sign in again with the new key
3. Make sure you copied the entire key (no extra spaces)

Note: Free tier API keys have usage limits. Check your quota at:
https://aistudio.google.com/app/apikey
`;
          return res.status(400).json({
            success: false,
            output: errorOutput,
            error: 'Invalid API key',
          });
        }

        if (response.status === 403 || response.status === 401) {
          const errorOutput = `API Key Authentication Failed
========================================================

Your API key is not authorized to use the Gemini API.

Error: ${errorJson.error?.message || response.statusText}

Possible reasons:
1. API key is invalid or expired
2. API key doesn't have permission for Gemini API
3. Your API quota has been exceeded

Get a new key: https://aistudio.google.com/app/apikey
`;
          return res.status(403).json({
            success: false,
            output: errorOutput,
            error: 'API key authentication failed',
          });
        }

        if (response.status === 429) {
          const errorOutput = `Rate Limit Exceeded
========================================================

You've exceeded the rate limit for the Gemini API.

Free tier limits:
- 15 requests per minute
- 1 million tokens per minute

What to do:
1. Wait a minute and try again
2. Consider upgrading your API plan
3. Check your usage at: https://aistudio.google.com/app/apikey
`;
          return res.status(429).json({
            success: false,
            output: errorOutput,
            error: 'Rate limit exceeded',
          });
        }

        throw new Error(`Gemini API error (${response.status}): ${errorJson.error?.message || response.statusText}`);
      }

      const data: any = await response.json();
      console.log('Gemini API Response:', JSON.stringify(data, null, 2));
      
      // Parse the Gemini JSON response
      let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      console.log('Raw response:', jsonText);
      
      // Strip markdown code blocks if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      console.log('Cleaned JSON:', jsonText);
      
      let parsedOutput;
      try {
        parsedOutput = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Truncated JSON length:', jsonText.length);
        
        // Check if response was truncated
        if (jsonText.length > 0 && !jsonText.endsWith('}')) {
          return res.status(500).json({
            success: false,
            output: `❌ AI Response Truncated\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\nThe AI response was too long and got cut off.\n\nThis usually happens with complex programs that have many steps.\n\n💡 Try:\n1. Simplify your code (fewer loops/instructions)\n2. Run smaller code sections\n3. The system is being optimized for better performance\n\nPlease try again with a simpler program.`,
            error: 'AI response truncated - exceeded token limit'
          });
        }
        
        parsedOutput = { error: 'Failed to parse AI response', rawOutput: jsonText };
      }

      // Convert JSON to formatted string for frontend display
      const formattedOutput = formatExecutionOutput(parsedOutput);

      res.json({
        success: true,
        output: formattedOutput,
        steps: parsedOutput.execution?.steps || [],
        registers: parsedOutput.execution?.finalState?.registers || {},
        flags: parsedOutput.execution?.finalState?.flags || {},
        memory: parsedOutput.finalMemory || [],
        symbolTable: parsedOutput.symbolTable || [],
        rawJson: parsedOutput, // Include raw JSON for future use
      });

    } catch (aiError: any) {
      console.error('AI Execution error:', aiError);
      
      // Track error in session
      try {
        const session = await Session.findOne({ sessionId: sid });
        if (session) {
          session.errorMessages.push(aiError.message || 'AI Execution Failed');
          await session.save();
        }
      } catch (e) {
        console.error('Error tracking failed:', e);
      }
      
      const errorOutput = `AI Execution Failed
========================================================

Error: ${aiError.message || 'Unknown AI error'}

This could be due to an invalid API key, network issues, or a problem with the AI provider.
Check your GEMINI_API_KEY.
`;
      res.status(500).json({
        success: false,
        output: errorOutput,
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
