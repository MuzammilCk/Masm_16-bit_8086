import express from 'express';
import { getSystemPrompt } from '../utils/promptLoader';

const router = express.Router();

// OpenRouter configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'ASM-Studio Pro';
const OPENROUTER_MODEL = 'x-ai/grok-code-fast-1';

// System prompt is now loaded dynamically from prompts/ directory

// Chat with AI
router.post('/chat', async (req, res) => {
  try {
    const { message, code } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured',
        message: 'Please add OPENROUTER_API_KEY to environment variables'
      });
    }

    // Load system prompt dynamically
    const systemPrompt = await getSystemPrompt();
    
    // Build messages array
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    if (code) {
      messages.push({
        role: 'system',
        content: `Current code in editor:\n\`\`\`asm\n${code}\n\`\`\``
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) {
      const errorData: any = await response.json();
      throw new Error(`OpenRouter API error: ${errorData.error?.message || response.statusText}`);
    }

    const data: any = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'No response from AI';

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

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ 
        error: 'AI service not configured' 
      });
    }

    let userPrompt = `Explain this 8086 assembly code:\n\`\`\`asm\n${code}\n\`\`\`\n\n`;
    
    if (lineNumber) {
      userPrompt += `Focus on line ${lineNumber}.\n\n`;
    }
    
    userPrompt += 'Provide a clear, educational explanation.';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: await getSystemPrompt() },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const explanation = data.choices[0]?.message?.content || 'No explanation available';

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

    if (!OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const userPrompt = `The student has this error:\n${errorMessage}\n\nIn this code:\n\`\`\`asm\n${code}\n\`\`\`\n\nProvide 2-3 specific fix options with code examples. Be concise and actionable.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_SITE_NAME,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: await getSystemPrompt() },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data: any = await response.json();
    const suggestions = data.choices[0]?.message?.content || 'No suggestions available';

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
