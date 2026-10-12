const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5050';

export const api = (path, opts = {}) => {
  const token = localStorage.getItem('token');
  return fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...opts.headers,
    },
  });
};
