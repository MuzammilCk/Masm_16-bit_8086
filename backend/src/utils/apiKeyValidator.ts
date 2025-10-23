/**
 * Validates a Gemini API key by making a test request
 * @param apiKey - The Gemini API key to validate
 * @returns Object with isValid flag and error message if invalid
 */
export async function validateGeminiApiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
  if (!apiKey || typeof apiKey !== 'string') {
    return { isValid: false, error: 'API key is required' };
  }

  // Check basic format (Gemini keys typically start with certain patterns)
  if (apiKey.length < 20) {
    return { isValid: false, error: 'API key appears to be too short' };
  }

  try {
    // Make a minimal test request to validate the key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: 'test' }] }
        ],
        generationConfig: {
          maxOutputTokens: 10
        }
      })
    });

    if (response.status === 400) {
      // API key is valid but request format might be slightly off - that's OK
      const data: any = await response.json();
      // Check if it's an auth error or just a validation error
      if (data.error?.message?.toLowerCase().includes('api key')) {
        return { isValid: false, error: 'Invalid API key' };
      }
      return { isValid: true }; // Key is valid
    }

    if (response.status === 403 || response.status === 401) {
      return { isValid: false, error: 'Invalid or unauthorized API key' };
    }

    if (response.ok) {
      return { isValid: true };
    }

    // For other errors, consider the key format valid but note there might be other issues
    const errorData: any = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    
    if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('authentication')) {
      return { isValid: false, error: 'Invalid API key' };
    }

    // Network or other errors - don't fail registration, just warn
    return { isValid: true };
  } catch (error) {
    // Network error - don't block registration, the key might be valid
    console.error('API key validation error:', error);
    return { isValid: true }; // Fail open - allow registration
  }
}
