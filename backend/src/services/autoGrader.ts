/**
 * Auto-Grading Service
 * Executes student code against test cases and calculates scores
 */

interface TestCase {
  input?: string;
  expectedOutput?: string;
  expectedRegisters?: Record<string, string>;
  expectedMemory?: { offset: string; value: string }[];
  points: number;
}

interface ExecutionResult {
  success: boolean;
  output?: string;
  registers?: Record<string, string>;
  memory?: { offset: string; value: string }[];
  error?: string;
}

interface TestResult {
  testCaseIndex: number;
  passed: boolean;
  pointsEarned: number;
  error?: string;
  executionOutput?: string;
}

export class AutoGrader {
  /**
   * Grade a submission against test cases
   */
  static async gradeSubmission(
    code: string,
    testCases: TestCase[]
  ): Promise<{ testResults: TestResult[]; totalScore: number; maxScore: number }> {
    const testResults: TestResult[] = [];
    let totalScore = 0;
    const maxScore = testCases.reduce((sum, tc) => sum + tc.points, 0);

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      const result = await this.runTestCase(code, testCase);
      
      testResults.push({
        testCaseIndex: i,
        passed: result.passed,
        pointsEarned: result.passed ? testCase.points : 0,
        error: result.error,
        executionOutput: result.output,
      });

      if (result.passed) {
        totalScore += testCase.points;
      }
    }

    return {
      testResults,
      totalScore,
      maxScore,
    };
  }

  /**
   * Run a single test case
   */
  private static async runTestCase(
    code: string,
    testCase: TestCase
  ): Promise<{ passed: boolean; error?: string; output?: string }> {
    try {
      // Execute the code using AI engine (same as normal execution)
      const executionResult = await this.executeCode(code);

      if (!executionResult.success) {
        return {
          passed: false,
          error: executionResult.error || 'Execution failed',
        };
      }

      // Check if output matches (if specified)
      if (testCase.expectedOutput) {
        const outputMatches = this.compareOutput(
          executionResult.output || '',
          testCase.expectedOutput
        );
        
        if (!outputMatches) {
          return {
            passed: false,
            error: 'Output does not match expected output',
            output: executionResult.output,
          };
        }
      }

      // Check if registers match (if specified)
      if (testCase.expectedRegisters) {
        const registersMatch = this.compareRegisters(
          executionResult.registers || {},
          testCase.expectedRegisters
        );

        if (!registersMatch) {
          return {
            passed: false,
            error: 'Register values do not match expected values',
            output: JSON.stringify(executionResult.registers),
          };
        }
      }

      // Check if memory matches (if specified)
      if (testCase.expectedMemory) {
        const memoryMatches = this.compareMemory(
          executionResult.memory || [],
          testCase.expectedMemory
        );

        if (!memoryMatches) {
          return {
            passed: false,
            error: 'Memory values do not match expected values',
          };
        }
      }

      return {
        passed: true,
        output: executionResult.output,
      };
    } catch (error: any) {
      return {
        passed: false,
        error: error.message || 'Test case execution error',
      };
    }
  }

  /**
   * Execute assembly code (calls the AI execution endpoint)
   */
  private static async executeCode(code: string): Promise<ExecutionResult> {
    try {
      // Use Gemini API to execute the code
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        throw new Error('AI API key not configured');
      }

      const systemPrompt = `You are an 8086 assembly simulator. Execute this code and return ONLY a JSON object with this structure:
{
  "success": true/false,
  "registers": {"AX": "0000", "BX": "0000", ...},
  "memory": [{"offset": "DS:0000", "value": "10", "symbol": "VAR"}],
  "output": "execution summary",
  "error": "error message if any"
}`;

      const userPrompt = `${systemPrompt}\n\nCode:\n\`\`\`asm\n${code}\n\`\`\``;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('AI execution failed');
      }

      const data: any = await response.json();
      let jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Clean markdown if present
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const result = JSON.parse(jsonText);
      
      return {
        success: result.success !== false,
        output: result.output || result.summary,
        registers: result.execution?.finalState?.registers || result.registers,
        memory: result.finalMemory || result.memory,
        error: result.error,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Execution error',
      };
    }
  }

  /**
   * Compare output strings (flexible comparison)
   */
  private static compareOutput(actual: string, expected: string): boolean {
    // Normalize whitespace and compare
    const normalizeOutput = (str: string) => {
      return str
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
    };

    return normalizeOutput(actual).includes(normalizeOutput(expected));
  }

  /**
   * Compare register values
   */
  private static compareRegisters(
    actual: Record<string, string>,
    expected: Record<string, string>
  ): boolean {
    for (const [reg, expectedValue] of Object.entries(expected)) {
      const actualValue = actual[reg];
      
      if (!actualValue) return false;
      
      // Normalize hex values
      const normalizedActual = actualValue.replace(/H$/i, '').toUpperCase();
      const normalizedExpected = expectedValue.replace(/H$/i, '').toUpperCase();
      
      if (normalizedActual !== normalizedExpected) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Compare memory values
   */
  private static compareMemory(
    actual: { offset: string; value: string }[],
    expected: { offset: string; value: string }[]
  ): boolean {
    for (const expectedEntry of expected) {
      const actualEntry = actual.find((a) => a.offset === expectedEntry.offset);
      
      if (!actualEntry) return false;
      
      const normalizedActual = actualEntry.value.replace(/H$/i, '').toUpperCase();
      const normalizedExpected = expectedEntry.value.replace(/H$/i, '').toUpperCase();
      
      if (normalizedActual !== normalizedExpected) {
        return false;
      }
    }
    
    return true;
  }
}
