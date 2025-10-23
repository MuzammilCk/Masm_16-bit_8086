/**
 * API Configuration
 * Handles backend URL for both development and production
 */

export const API_CONFIG = {
  // Use environment variable in production, fallback to localhost in development
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  
  // WebSocket URL (for real-time collaboration)
  wsUrl: process.env.NEXT_PUBLIC_BACKEND_URL?.replace('https://', 'wss://').replace('http://', 'ws://') || 'ws://localhost:3001',
};

// Helper function to build API endpoint URLs
export function apiUrl(endpoint: string): string {
  // Ensure endpoint starts with /
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.baseUrl}${path}`;
}

// Example usage:
// fetch(apiUrl('/api/execute'), { ... })
// Instead of: fetch('http://localhost:3001/api/execute', { ... })
