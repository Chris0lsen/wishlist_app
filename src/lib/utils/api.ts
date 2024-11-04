// src/utils/api.ts

import { useAuthStore } from '../stores/auth-store';
import { handleLogout, refreshAccessToken } from './auth';

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}
const baseUrl = import.meta.env.VITE_API_URL;

export const get = async <T>(
  url: string,
  options?: RequestOptions,
): Promise<T> => {
  return await request<T>('GET', url, undefined, options);
};

export const post = async <T, B>(
  url: string,
  body: B,
  options?: RequestOptions,
): Promise<T> => {
  return await request<T, B>('POST', url, body, options);
};

export const put = async <T, B>(
  url: string,
  body: B,
  options?: RequestOptions,
): Promise<T> => {
  return await request<T, B>('PUT', url, body, options);
};

export const del = async <T>(
  url: string,
  options?: RequestOptions,
): Promise<T> => {
  return await request<T>('DELETE', url, undefined, options);
};

// Helper function to prepare headers
const prepareHeaders = (
  optionsHeaders: Record<string, string> = {},
): Record<string, string> => {
  const { accessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...optionsHeaders,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

// Helper function to handle response parsing and error handling
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('Content-Type') || '';
  if (response.ok) {
    if (contentType.includes('application/json')) {
      const data = (await response.json()) as T;
      return data;
    }
    // Handle non-JSON responses if necessary
    // For now, we can throw an error or return an empty object
    return {} as T;
  }
  let errorMessage = response.statusText;

  try {
    if (contentType.includes('application/json')) {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } else {
      errorMessage = await response.text();
    }
  } catch {
    // Ignore parsing errors
  }

  throw new Error(errorMessage);
};

// Helper function to retry the request after token refresh
const retryRequest = async (
  fullUrl: string,
  fetchOptions: RequestInit,
): Promise<Response> => {
  const newAccessToken = useAuthStore.getState().accessToken;

  if (!newAccessToken) {
    await handleLogout();
    throw new Error('Unauthorized');
  }

  // Update the Authorization header with the new access token
  const updatedHeaders: Record<string, string> = {
    ...(fetchOptions.headers as Record<string, string>),
    Authorization: `Bearer ${newAccessToken}`,
  };

  // Retry the original request with updated headers
  return await fetch(fullUrl, {
    ...fetchOptions,
    headers: updatedHeaders,
  });
};

const request = async <T, B = undefined>(
  method: string,
  url: string,
  body?: B,
  options: RequestOptions = {},
): Promise<T> => {
  const fullUrl = `${baseUrl}${url}`;

  // Prepare headers
  const headers = prepareHeaders(options.headers);

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers, // headers is now Record<string, string>
    credentials: 'include', // Include cookies for refresh token
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  // Make the API call
  let response = await fetch(fullUrl, fetchOptions);

  // Handle 401 Unauthorized
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      response = await retryRequest(fullUrl, fetchOptions);
    } else {
      await handleLogout();
      throw new Error('Unauthorized');
    }
  }

  // Handle response
  return await handleResponse<T>(response);
};
