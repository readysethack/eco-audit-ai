import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

export type BackendStatus = 'unknown' | 'waking_up' | 'ready' | 'error';

export function useBackendStatus() {
  const [status, setStatus] = useState<BackendStatus>('unknown');
  const [error, setError] = useState<string | null>(null);
  
  const checkBackendStatus = useCallback(async () => {
    try {
      setStatus('unknown');
      setError(null);
      
      // Try to ping the backend health endpoint with a short timeout first
      await api.get('/health', { timeout: 5000 });
      setStatus('ready');
    } catch (err: any) {
      if (err.code === 'ECONNABORTED' || 
          err.response?.status === 503 || 
          err.response?.status === 502) {
        // Backend is likely waking up
        setStatus('waking_up');
      } else {
        // Some other error
        setStatus('error');
        setError(err.message || 'Unknown error connecting to the backend');
      }
    }
  }, []);
  
  // Check status on mount
  useEffect(() => {
    checkBackendStatus();
  }, [checkBackendStatus]);
  
  return { status, error, checkBackendStatus };
}
