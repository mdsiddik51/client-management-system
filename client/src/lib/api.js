const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const BASE_URL = rawUrl.replace(/\/api\/?$/, '').replace(/\/$/, '') || 'http://localhost:5000';

async function request(method, path, body, isFormData = false) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    credentials: 'include',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      return {
        data: null,
        error: data?.message || data?.error || `HTTP ${res.status}: ${res.statusText}`,
      };
    }

    return { data, error: null };
  } catch (err) {
    return { data: null, error: err.message || 'Network error' };
  }
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
  upload: (path, formData) => request('POST', path, formData, true),
};

export default api;
