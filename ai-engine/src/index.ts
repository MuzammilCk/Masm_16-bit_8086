/**
 * MASM Studio - AI Engine Entry Point
 * 
 * This module integrates with Gemini 2.5 Flash to provide:
 * - Code compilation and validation
 * - Step-by-step execution simulation
 * - Interactive debugging
 * - Educational explanations
 * - Code optimization suggestions
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Load system prompts
async function loadSystemPrompts(): Promise<string> {
  const promptsDir = path.join(__dirname, '../../prompts');
  
  const corePrompt = await fs.readFile(
    path.join(promptsDir, 'CORE_SYSTEM_PROMPT.md'),
    'utf-8'
  );
  
  const templates = await fs.readFile(
    path.join(promptsDir, 'INTERFACE_TEMPLATES.md'),
    'utf-8'
  );
  
  // Combine prompts
  return `${corePrompt}\n\n---\n\n${templates}`;
}

// AI Engine Class
export class ASMStudioAI {
  private model: any;
  private systemPrompt: string = '';
  private conversationHistory: Array<{ role: string; content: string }> = [];

  async initialize() {
    // Load system prompts
    this.systemPrompt = await loadSystemPrompts();
    
    // Initialize Gemini model
    this.model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      systemInstruction: this.systemPrompt,
    });
    
    console.log('✅ MASM Studio AI Engine initialized');
  }

  /**
   * Process assembly code with AI
   */
  async processCode(code: string, userMessage?: string): Promise<string> {
    try {
      const prompt = userMessage 
        ? `${userMessage}\n\n\`\`\`asm\n${code}\n\`\`\``
        : `Compile and execute this assembly code:\n\n\`\`\`asm\n${code}\n\`\`\``;

      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: prompt,
      });

      // Start chat session with history
      const chat = this.model.startChat({
        history: this.conversationHistory.slice(0, -1), // Exclude current message
      });

      // Send message
      const result = await chat.sendMessage(prompt);
      const response = result.response.text();

      // Add AI response to history
      this.conversationHistory.push({
        role: 'model',
        content: response,
      });

      return response;
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process code with AI');
    }
  }

  /**
   * Ask a question about assembly language
   */
  async askQuestion(question: string): Promise<string> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: question,
      });

      const chat = this.model.startChat({
        history: this.conversationHistory.slice(0, -1),
      });

      const result = await chat.sendMessage(question);
      const response = result.response.text();

      this.conversationHistory.push({
        role: 'model',
        content: response,
      });

      return response;
    } catch (error) {
      console.error('AI question error:', error);
      throw new Error('Failed to process question');
    }
  }

  /**
   * Debug mode - set breakpoints and step through code
   */
  async debugCode(code: string, command: string): Promise<string> {
    try {
      const prompt = `Debug command: ${command}\n\nCode:\n\`\`\`asm\n${code}\n\`\`\``;
      
      this.conversationHistory.push({
        role: 'user',
        content: prompt,
      });

      const chat = this.model.startChat({
        history: this.conversationHistory.slice(0, -1),
      });

      const result = await chat.sendMessage(prompt);
      const response = result.response.text();

      this.conversationHistory.push({
        role: 'model',
        content: response,
      });

      return response;
    } catch (error) {
      console.error('AI debug error:', error);
      throw new Error('Failed to debug code');
    }
  }

  /**
   * Get optimization suggestions
   */
  async optimizeCode(code: string): Promise<string> {
    try {
      const prompt = `Analyze this code and provide optimization suggestions:\n\n\`\`\`asm\n${code}\n\`\`\``;
      
      const chat = this.model.startChat({
        history: this.conversationHistory,
      });

      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error('AI optimization error:', error);
      throw new Error('Failed to optimize code');
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return this.conversationHistory;
  }
}

// Export singleton instance
export const aiEngine = new ASMStudioAI();

// Initialize when run directly (for testing)
// Check if this module is the main entry point
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  aiEngine.initialize().then(() => {
    console.log('🤖 MASM Studio AI Engine ready');
  }).catch((error) => {
    console.error('Failed to initialize AI engine:', error);
    process.exit(1);
  });
}
