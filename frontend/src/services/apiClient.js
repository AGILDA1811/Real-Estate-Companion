const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = null;
  const text = await response.text();
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    const errorMessage =
      payload?.message || payload?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return payload;
}
