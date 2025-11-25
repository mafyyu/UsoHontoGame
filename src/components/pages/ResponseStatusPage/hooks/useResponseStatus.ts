/**
 * useResponseStatus Hook
 * Feature: 006-results-dashboard, User Story 1
 * Manages real-time response status tracking with polling
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ResponseStatusDto } from '@/server/application/dto/ResponseStatusDto';
import type { ResponseStatusError } from '../ResponseStatusPage.types';

export interface UseResponseStatusOptions {
  gameId: string;
  initialData?: ResponseStatusDto;
  pollingInterval?: number; // milliseconds, default 5000 (5s)
  enabled?: boolean; // Allow pausing polling
  onUpdate?: (data: ResponseStatusDto) => void;
  onError?: (error: ResponseStatusError) => void;
}

export interface UseResponseStatusReturn {
  data: ResponseStatusDto | null;
  error: ResponseStatusError | null;
  isLoading: boolean;
  isPolling: boolean;
  refetch: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
}

/**
 * Hook for polling response status from the dashboard API
 */
export function useResponseStatus({
  gameId,
  initialData,
  pollingInterval = 5000,
  enabled = true,
  onUpdate,
  onError,
}: UseResponseStatusOptions): UseResponseStatusReturn {
  const [data, setData] = useState<ResponseStatusDto | null>(initialData || null);
  const [error, setError] = useState<ResponseStatusError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(enabled);

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const onUpdateRef = useRef(onUpdate);
  const onErrorRef = useRef(onError);

  // Keep callback refs up to date
  useEffect(() => {
    onUpdateRef.current = onUpdate;
    onErrorRef.current = onError;
  }, [onUpdate, onError]);

  // Fetch response status from API
  const fetchResponseStatus = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/games/${gameId}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
      });

      if (!isMountedRef.current) return;

      if (!response.ok) {
        const errorData = await response.json();
        const error: ResponseStatusError = {
          message: errorData.details || errorData.error || 'Failed to fetch response status',
          statusCode: response.status,
        };
        setError(error);
        onErrorRef.current?.(error);
        return;
      }

      const responseData: ResponseStatusDto = await response.json();
      setData(responseData);
      onUpdateRef.current?.(responseData);
    } catch (err) {
      if (!isMountedRef.current) return;

      const error: ResponseStatusError = {
        message: err instanceof Error ? err.message : 'Network error',
        statusCode: 0,
      };
      setError(error);
      onErrorRef.current?.(error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [gameId]);

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchResponseStatus();
  }, [fetchResponseStatus]);

  // Start polling
  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  // Stop polling
  const stopPolling = useCallback(() => {
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Set up polling effect
  useEffect(() => {
    if (!isPolling) {
      // Clear any existing interval when polling is disabled
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
      return;
    }

    // Initial fetch
    fetchResponseStatus();

    // Set up polling interval
    pollingIntervalRef.current = setInterval(() => {
      fetchResponseStatus();
    }, pollingInterval);

    // Cleanup on unmount or when polling stops
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [isPolling, pollingInterval, fetchResponseStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  return {
    data,
    error,
    isLoading,
    isPolling,
    refetch,
    startPolling,
    stopPolling,
  };
}
