/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { API_BASE_URL } from '@/utils/constants';
import type { ApiResponse } from '@/types';

const DEFAULT_TIMEOUT_MS = 15_000;

/**
 * Typed fetch wrapper with timeout, JSON parsing, and error normalisation.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return { data: null, error: errorText, status: response.status };
    }

    const data = (await response.json()) as T;
    return { data, error: null, status: response.status };
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { data: null, error: 'Request timed out', status: 408 };
    }
    return {
      data: null,
      error: err instanceof Error ? err.message : 'Network error',
      status: 0,
    };
  }
}

export const apiClient = {
  get: <T>(endpoint: string, init?: RequestInit) =>
    request<T>(endpoint, { method: 'GET', ...init }),

  post: <T>(endpoint: string, body: unknown, init?: RequestInit) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      ...init,
    }),
};
