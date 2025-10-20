import fs from 'fs/promises';
import path from 'path';

// Cache the prompts in memory to avoid reading files on every request
let cachedPrompt: string | null = null;

export function clearPromptCache() {
  cachedPrompt = null;
}

/**
 * Loads the core system prompt and interface templates from the file system,
 * combines them, and caches the result.
 * Pass `{ reload: true }` to force reloading from disk (dev hot-reload).
 */
export async function getSystemPrompt(options?: { reload?: boolean }): Promise<string> {
  if (cachedPrompt && !options?.reload) {
    return cachedPrompt;
  }

  try {
    // Go up from src/utils to the project root, then to prompts/
    const promptsDir = path.join(__dirname, '..', '..', '..', 'prompts');

    const corePromptPath = path.join(promptsDir, 'CORE_SYSTEM_PROMPT.md');
    const interfaceTemplatesPath = path.join(promptsDir, 'INTERFACE_TEMPLATES.md');

    const [corePrompt, interfaceTemplates] = await Promise.all([
      fs.readFile(corePromptPath, 'utf-8'),
      fs.readFile(interfaceTemplatesPath, 'utf-8'),
    ]);

    const fullPrompt = `
${corePrompt}

${interfaceTemplates}
`;

    cachedPrompt = fullPrompt;
    console.log('✅ System prompts loaded and cached successfully.');
    return fullPrompt;

  } catch (error) {
    console.error('❌ Failed to load system prompts:', error);
    throw new Error('Could not load required system prompts from the /prompts directory.');
  }
}
