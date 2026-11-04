import { getAccessToken } from '@/shared/lib/token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  const { auth = false, headers, ...restOptions } = options;

  const token = auth ? getAccessToken() : null;

  const response = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorData = await response.json();

      if (Array.isArray(errorData.message)) {
        message = errorData.message.join(', ');
      } else if (errorData.message) {
        message = errorData.message;
      }
    } catch {
      message = response.statusText;
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}
