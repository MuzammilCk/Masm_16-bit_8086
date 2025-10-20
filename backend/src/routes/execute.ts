import express from 'express';
import { getSystemPrompt } from '../utils/promptLoader';

const router = express.Router();

// OpenRouter configuration
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000';
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'ASM-Studio Pro';
const OPENROUTER_MODEL = 'x-ai/grok-code-fast-1';


// Execute assembly code
router.post('/', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    console.log('[/api/execute] Received code:', code);

    // Read API key inside the handler to ensure it's loaded
    const apiKey = process.env.OPENROUTER_API_KEY;

    // Check if AI is configured
    if (!apiKey) {
      const errorOutput = `❌ AI Execution Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error: AI provider not configured.

Please set the OPENROUTER_API_KEY in the backend/.env file and restart the server.
`;
      return res.status(500).json({ 
        success: false, 
        output: errorOutput, 
        error: 'AI provider not configured.' 
      });
    }

    // Use AI to compile and execute the code
    try {
      const reload = req.query.reloadPrompts === '1';
      const systemPrompt = await getSystemPrompt({ reload });
      const userPrompt = `${systemPrompt}\n\nNow compile and execute this 8086 MASM code:\n\n\`\`\`asm\n${code}\n\`\`\`\n\nProvide the complete execution analysis based on the templates provided.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': OPENROUTER_SITE_URL,
          'X-Title': OPENROUTER_SITE_NAME,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.statusText}`);
      }

      const data: any = await response.json();
      const aiOutput = data.choices[0]?.message?.content || 'No execution output available';

      res.json({
        success: true,
        output: aiOutput,
        steps: [],
        registers: {},
        flags: {},
      });

    } catch (aiError: any) {
      console.error('AI Execution error:', aiError);
      
      const errorOutput = `❌ AI Execution Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error: ${aiError.message || 'Unknown AI error'}

This could be due to an invalid API key, network issues, or a problem with the AI provider.
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
