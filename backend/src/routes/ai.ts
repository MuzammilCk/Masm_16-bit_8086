import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// System prompt for ASM-Studio AI Assistant
const SYSTEM_PROMPT = `You are an expert assembly language tutor for the ASM-Studio Pro IDE. You specialize in MASM (Microsoft Macro Assembler) for 8086 architecture.

Your role:
- Help students understand 8086 assembly language concepts
- Debug code and explain errors clearly
- Provide step-by-step explanations
- Suggest optimizations
- Be encouraging and patient

Guidelines:
- Keep responses concise but thorough
- Use analogies when explaining complex concepts
- Provide code examples when helpful
- Always explain WHY, not just WHAT
- Be friendly and encouraging

When analyzing code:
- Point out syntax errors with line numbers
- Explain register usage
- Clarify memory addressing modes
- Suggest best practices`;

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message, code, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'Please add GEMINI_API_KEY to environment variables'
      });
    }

    // Build context
    let contextMessage = SYSTEM_PROMPT + '\n\n';
    
    if (code) {
      contextMessage += `Current code in editor:\n\`\`\`asm\n${code}\n\`\`\`\n\n`;
    }
    
    contextMessage += `Student question: ${message}`;

    // Get AI model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    // Generate response
    const result = await model.generateContent(contextMessage);
    const response = result.response;
    const text = response.text();

    res.json({
      success: true,
      message: text,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('AI Chat error:', error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API_KEY')) {
      return res.status(500).json({
        error: 'Invalid API key',
        message: 'Please check your Gemini API key configuration'
      });
    }
    
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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp' 
    });

    let prompt = `${SYSTEM_PROMPT}\n\nExplain this 8086 assembly code:\n\`\`\`asm\n${code}\n\`\`\`\n\n`;
    
    if (lineNumber) {
      prompt += `Focus on line ${lineNumber}.\n\n`;
    }
    
    prompt += 'Provide a clear, educational explanation.';

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

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

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp' 
    });

    const prompt = `${SYSTEM_PROMPT}\n\nThe student has this error:\n${errorMessage}\n\nIn this code:\n\`\`\`asm\n${code}\n\`\`\`\n\nProvide 2-3 specific fix options with code examples. Be concise and actionable.`;

    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

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
