import { useState, useCallback } from 'react';
import { apiUrl } from '@/lib/api-config';

interface StreamState {
  status: 'idle' | 'parsing' | 'building' | 'compiling' | 'executing' | 'complete' | 'error';
  progress: number;
  message: string;
  symbols: any[];
  initialMemory: any[];
  steps: any[];
  finalState: any;
  finalMemory: any[];
  summary: string;
  error: string | null;
  compilationErrors: any[];
}

export function useStreamingExecution() {
  const [state, setState] = useState<StreamState>({
    status: 'idle',
    progress: 0,
    message: '',
    symbols: [],
    initialMemory: [],
    steps: [],
    finalState: null,
    finalMemory: [],
    summary: '',
    error: null,
    compilationErrors: [],
  });

  const [isStreaming, setIsStreaming] = useState(false);

  const execute = useCallback(async (code: string) => {
    // Reset state
    setState({
      status: 'parsing',
      progress: 0,
      message: 'Starting execution...',
      symbols: [],
      initialMemory: [],
      steps: [],
      finalState: null,
      finalMemory: [],
      summary: '',
      error: null,
      compilationErrors: [],
    });

    setIsStreaming(true);

    try {
      const response = await fetch(apiUrl('/api/execute/stream'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setIsStreaming(false);
          break;
        }

        // Decode chunk
        buffer += decoder.decode(value, { stream: true });

        // Process complete events
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep incomplete event in buffer

        for (const line of lines) {
          if (!line.trim()) continue;

          // Parse SSE format: "event: type\ndata: {...}"
          const eventMatch = line.match(/event: (.+)\ndata: (.+)/s);
          if (!eventMatch) continue;

          const [, eventType, eventData] = eventMatch;
          
          try {
            const data = JSON.parse(eventData);

            // Handle different event types
            switch (eventType) {
              case 'status':
                setState(prev => ({
                  ...prev,
                  status: data.stage,
                  progress: data.progress,
                  message: data.message || '',
                }));
                break;

              case 'symbols':
                setState(prev => ({
                  ...prev,
                  symbols: data.symbols || [],
                  initialMemory: data.initialMemory || [],
                  progress: data.progress,
                }));
                break;

              case 'step':
                setState(prev => ({
                  ...prev,
                  steps: [...prev.steps, data.step],
                  progress: data.progress,
                }));
                break;

              case 'complete':
                setState(prev => ({
                  ...prev,
                  status: 'complete',
                  finalState: data.finalState,
                  finalMemory: data.finalMemory || [],
                  summary: data.summary || '',
                  progress: 100,
                  message: 'Execution complete!',
                }));
                break;

              case 'compilation-error':
                setState(prev => ({
                  ...prev,
                  status: 'error',
                  compilationErrors: data.errors || [],
                  progress: 100,
                  message: 'Compilation failed',
                }));
                break;

              case 'error':
                setState(prev => ({
                  ...prev,
                  status: 'error',
                  error: data.message,
                  progress: 100,
                  message: 'Error occurred',
                }));
                break;
            }
          } catch (parseError) {
            console.error('Failed to parse SSE data:', parseError, eventData);
          }
        }
      }
    } catch (error: any) {
      console.error('Stream error:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error.message,
        message: 'Stream failed',
      }));
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      progress: 0,
      message: '',
      symbols: [],
      initialMemory: [],
      steps: [],
      finalState: null,
      finalMemory: [],
      summary: '',
      error: null,
      compilationErrors: [],
    });
    setIsStreaming(false);
  }, []);

  return { 
    state, 
    execute, 
    reset,
    isStreaming 
  };
}
