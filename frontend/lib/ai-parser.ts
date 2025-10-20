import { AIResponse } from '@/types/ai-response';

/**
 * Parses AI response and extracts structured JSON data
 * Handles both JSON and plain text responses
 */
export function parseAIResponse(response: string): AIResponse {
  try {
    // First, try to extract JSON from markdown code block
    const jsonMatch = response.match(/```json\s*\n([\s\S]*?)\n```/);
    
    if (jsonMatch) {
      const jsonString = jsonMatch[1];
      const parsed = JSON.parse(jsonString);
      return validateAndNormalize(parsed);
    }
    
    // Try to parse as direct JSON
    try {
      const parsed = JSON.parse(response);
      return validateAndNormalize(parsed);
    } catch {
      // Not valid JSON, treat as plain text
      return {
        plainText: response
      };
    }
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    return {
      plainText: response,
      problems: {
        count: 1,
        errors: [{
          line: 0,
          severity: 'error',
          message: 'Failed to parse AI response'
        }],
        warnings: []
      }
    };
  }
}

/**
 * Validates and normalizes the parsed data to ensure all required fields exist
 */
function validateAndNormalize(data: any): AIResponse {
  const normalized: AIResponse = {};

  // Normalize file info
  if (data.file) {
    normalized.file = {
      name: data.file.name || 'untitled.asm',
      content: data.file.content || '',
      lineCount: data.file.lineCount || 0,
      language: data.file.language || 'masm'
    };
  }

  // Normalize problems
  if (data.problems) {
    normalized.problems = {
      count: data.problems.count || 0,
      errors: Array.isArray(data.problems.errors) ? data.problems.errors : [],
      warnings: Array.isArray(data.problems.warnings) ? data.problems.warnings : []
    };
  }

  // Normalize build info
  if (data.build) {
    normalized.build = {
      status: data.build.status || 'failed',
      time: data.build.time,
      outputFile: data.build.outputFile,
      size: data.build.size,
      symbols: data.build.symbols,
      collapsed: data.build.collapsed
    };
  }

  // Normalize execution info
  if (data.execution) {
    normalized.execution = {
      status: data.execution.status || 'pending',
      totalSteps: data.execution.totalSteps || 0,
      currentStep: data.execution.currentStep || 0,
      steps: Array.isArray(data.execution.steps) ? data.execution.steps : [],
      finalState: data.execution.finalState,
      performance: data.execution.performance
    };
  }

  // Normalize AI suggestions
  if (data.aiSuggestions && Array.isArray(data.aiSuggestions)) {
    normalized.aiSuggestions = data.aiSuggestions;
  }

  return normalized;
}

/**
 * Checks if a response is structured (JSON) or plain text
 */
export function isStructuredResponse(response: AIResponse): boolean {
  return !response.plainText && (
    !!response.file ||
    !!response.problems ||
    !!response.build ||
    !!response.execution
  );
}

/**
 * Extracts a summary from the AI response
 */
export function getResponseSummary(response: AIResponse): string {
  if (response.plainText) {
    return response.plainText.slice(0, 100) + (response.plainText.length > 100 ? '...' : '');
  }

  if (response.execution?.status === 'completed') {
    return `✅ Execution completed in ${response.execution.totalSteps} steps`;
  }

  if (response.problems && response.problems.count > 0) {
    return `⚠️ Found ${response.problems.count} problem(s)`;
  }

  if (response.build?.status === 'success') {
    return `🔧 Build successful`;
  }

  return '💬 AI Response';
}
