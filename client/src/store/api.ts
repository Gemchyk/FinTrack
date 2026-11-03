import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { SerializedError } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5050';

// A full page load drops Redux and the RTK Query cache, so nothing of this account stays on screen
export function logout(): void {
  localStorage.removeItem('token');
  location.assign('/');
}

const fetchWithToken = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await fetchWithToken(args, api, extraOptions);
  // /signin answers 401 to a wrong password. Anywhere else 401 means the session is over: the token expired
  // or the password was reset on another device
  if (result.error?.status === 401 && api.endpoint !== 'signin') logout();
  return result;
};

// Endpoints are added next to the components that use them, with api.injectEndpoints.
// Which mutation invalidates which tags:
//   updateMe -> Me
export const api = createApi({
  baseQuery,
  tagTypes: ['Me'],
  endpoints: () => ({}),
});

// Translation key for a failed request: the form's own message for a known status, otherwise a common one
export function errorKey(
  error: FetchBaseQueryError | SerializedError | undefined,
  known: Partial<Record<number, string>> = {},
): string | null {
  if (!error) return null;
  const status = 'status' in error ? error.status : undefined;
  const own = typeof status === 'number' ? known[status] : undefined;
  if (own) return own;
  if (status === 429) return 'errors.tooMany';
  if (status === 'FETCH_ERROR') return 'errors.offline';
  return 'errors.failed';
}
