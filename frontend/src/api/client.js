const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  // Algunos hostings (PHP-FPM/Apache como InfinityFree) no exponen el header
  // "Authorization" a PHP. Para no perder la autenticación en esos casos,
  // también se envía el token por query string como fallback. El backend
  // sigue aceptando el Bearer como primera opción.
  let urlPath = path;
  if (token) {
    const sep = path.includes('?') ? '&' : '?';
    urlPath = `${path}${sep}token=${encodeURIComponent(token)}`;
  }

  const res = await fetch(`${API_URL}${urlPath}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error((data && data.error) || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request('/auth.php', { method: 'POST', body: JSON.stringify({ username, password }) }),

  getCategories: () => request('/categories.php'),
  createCategory: (name) =>
    request('/categories.php', { method: 'POST', body: JSON.stringify({ name }) }),
  updateCategory: (id, name) =>
    request(`/categories.php?id=${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  deleteCategory: (id) =>
    request(`/categories.php?id=${id}`, { method: 'DELETE' }),

  getProducts: () => request('/products.php'),
  getAllProducts: () => request('/products.php?all=1'),
  createProduct: (payload) =>
    request('/products.php', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/products.php?id=${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/products.php?id=${id}`, { method: 'DELETE' }),
  discountStock: (id, quantity) =>
    request(`/products.php?id=${id}&action=stock`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),

  getConfig: () => request('/config.php'),
  updateConfig: (whatsappNumber) =>
    request('/config.php', { method: 'PUT', body: JSON.stringify({ whatsappNumber }) }),
};
