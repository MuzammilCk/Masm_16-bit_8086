import express from 'express';
import { getSystemPrompt } from '../utils/promptLoader';

const router = express.Router();

// Gemini API configuration - using stable fast model for students
const GEMINI_MODEL = 'gemini-2.0-flash';

// System prompt is now loaded dynamically from prompts/ directory

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message, code } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Read API key at runtime
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'Please add GEMINI_API_KEY to environment variables'
      });
    }

    // Use simplified system prompt for chat (large prompts cause issues)
    const systemPrompt = `You are MASM Studio AI Assistant, an expert in 8086 assembly language programming using MASM (Microsoft Macro Assembler) syntax.

Your role is to help students learn 8086 assembly by:
- Answering questions clearly and educationally
- Explaining concepts step-by-step
- Providing code examples when helpful
- Being friendly, patient, and encouraging

Focus on teaching fundamentals like registers (AX, BX, CX, DX, SI, DI, SP, BP), memory addressing, flags, and common instructions (MOV, ADD, SUB, CMP, JMP, LOOP, INT, etc.).`;
    
    // Build prompt for Gemini
    let userPrompt = `${systemPrompt}\n\n`;

    if (code) {
      userPrompt += `Current code in editor:\n\`\`\`asm\n${code}\n\`\`\`\n\n`;
    }

    userPrompt += `User question: ${message}\n\nRespond in plain text, be helpful and educational.`;

    // Call Gemini API
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
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
          "temperature": 0.5,
          "maxOutputTokens": 2000,  // Reduced for faster responses
          "topP": 0.95
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    console.log('Gemini API Response (chat):', JSON.stringify(data, null, 2));
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from AI';
    console.log('Extracted AI Message:', aiMessage);

    res.json({
      success: true,
      message: aiMessage,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('AI Chat error:', error);
    
    res.status(500).json({
      error: 'Failed to get AI response',
      message: error.message || 'Unknown error occurred',
    });
  }
});

// Explain code
router.post('/explain', async (req, res) => {
  try {
    const { code, lineNumber } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    // Read API key at runtime
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured' 
      });
    }

    let userPrompt = `You are an 8086 assembly language tutor. Explain this code clearly and educationally:\n\n\`\`\`asm\n${code}\n\`\`\`\n\n`;
    
    if (lineNumber) {
      userPrompt += `Focus on line ${lineNumber}.\n\n`;
    }
    
    userPrompt += 'Provide a clear, step-by-step explanation of what this code does.';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
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
          "temperature": 0.4,
          "maxOutputTokens": 1000,
          "topP": 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const explanation = data.candidates[0]?.content.parts[0]?.text || 'No explanation available';

    res.json({
      success: true,
      explanation,
    });

  } catch (error: any) {
    console.error('Explain error:', error);
    res.status(500).json({
      error: 'Failed to explain code',
      message: error.message,
    });
  }
});

// Suggest fixes for errors
router.post('/fix', async (req, res) => {
  try {
    const { code, error: errorMessage } = req.body;

    if (!code || !errorMessage) {
      return res.status(400).json({ error: 'Code and error message are required' });
    }

    // Read API key at runtime
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const userPrompt = `You are an 8086 assembly language tutor. The student has this error:\n${errorMessage}\n\nIn this code:\n\`\`\`asm\n${code}\n\`\`\`\n\nProvide 2-3 specific fix options with code examples. Be concise and actionable.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
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
          "temperature": 0.3,
          "maxOutputTokens": 800,
          "topP": 0.9
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const suggestions = data.candidates[0]?.content.parts[0]?.text || 'No suggestions available';

    res.json({
      success: true,
      suggestions,
    });

  } catch (error: any) {
    console.error('Fix error:', error);
    res.status(500).json({
      error: 'Failed to generate fixes',
      message: error.message,
    });
  }
});

export default router;
