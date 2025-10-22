import express from 'express';

const router = express.Router();

// SSE endpoint for streaming execution
router.post('/stream', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log('[/api/execute/stream] Starting SSE stream for code:', code.substring(0, 50) + '...');

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

    // Helper to send SSE events
    const sendEvent = (eventType: string, data: any) => {
      res.write(`event: ${eventType}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      // Step 1: Send parsing status
      sendEvent('status', { 
        stage: 'parsing', 
        progress: 10,
        message: 'Parsing assembly code...'
      });

      await new Promise(resolve => setTimeout(resolve, 200)); // Visual delay

      // Step 2: Send building status
      sendEvent('status', { 
        stage: 'building', 
        progress: 30,
        message: 'Building symbol table...'
      });

      await new Promise(resolve => setTimeout(resolve, 200));

      // Step 3: Call Gemini API for full execution
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        sendEvent('error', { 
          message: 'AI provider not configured. Please set GEMINI_API_KEY.' 
        });
        res.end();
        return;
      }

      // Start progress simulation
      let progressCounter = 50;
      const progressInterval = setInterval(() => {
        progressCounter = Math.min(progressCounter + 2, 60);
        sendEvent('status', { 
          stage: 'compiling', 
          progress: progressCounter,
          message: 'AI analyzing code...'
        });
      }, 300);

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
            "temperature": 0.1,
            "maxOutputTokens": 4096,
            "topP": 0.95,
            "topK": 40
          }
        })
      });

      // Clear progress interval
      clearInterval(progressInterval);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        sendEvent('error', { 
          message: `AI API error: ${response.statusText}` 
        });
        res.end();
        return;
      }

      const data: any = await response.json();
      let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Clean response
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      let parsedOutput;
      try {
        parsedOutput = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Raw response:', jsonText.substring(0, 500));
        sendEvent('error', { 
          message: 'Failed to parse AI response. Please try again.' 
        });
        res.end();
        return;
      }

      // Step 4: Send symbol table
      if (parsedOutput.symbolTable && parsedOutput.symbolTable.length > 0) {
        sendEvent('symbols', { 
          symbols: parsedOutput.symbolTable,
          initialMemory: parsedOutput.initialMemory || [],
          progress: 60
        });
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Step 5: Check compilation status
      const hasErrors = parsedOutput.compilation?.status === 'error';
      
      if (hasErrors) {
        sendEvent('compilation-error', {
          errors: parsedOutput.compilation.errors || [],
          progress: 100
        });
        res.end();
        return;
      }

      sendEvent('status', { 
        stage: 'executing', 
        progress: 70,
        message: 'Executing instructions...'
      });

      // Step 6: Stream execution steps
      const steps = parsedOutput.execution?.steps || [];
      const totalSteps = steps.length;

      for (let i = 0; i < totalSteps; i++) {
        const step = steps[i];
        const progress = 70 + (i / totalSteps) * 25;
        
        sendEvent('step', {
          step,
          stepNumber: i + 1,
          totalSteps,
          progress
        });
        
        // Small delay for visual effect
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Step 7: Send final state
      sendEvent('complete', {
        finalState: parsedOutput.execution?.finalState || {},
        finalMemory: parsedOutput.finalMemory || [],
        summary: parsedOutput.summary || 'Execution completed.',
        progress: 100
      });

      res.end();

    } catch (aiError: any) {
      console.error('Stream execution error:', aiError);
      sendEvent('error', { 
        message: aiError.message || 'Unknown execution error' 
      });
      res.end();
    }

  } catch (error: any) {
    console.error('SSE endpoint error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
