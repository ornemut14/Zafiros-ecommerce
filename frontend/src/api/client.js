// La API es serverless y vive en el mismo dominio que la tienda (Vercel),
// asi que alcanza con dejar VITE_API_URL vacio. Si se define, se antepone.
const API_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let urlPath = path;
  if (token) {
    const sep = path.includes('?') ? '&' : '?';
    urlPath = `${path}${sep}token=${encodeURIComponent(token)}`;
  }

  const res = await fetch(`${API_URL}${urlPath}`, { ...options, headers });

  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('La API devolvió una respuesta inesperada.');
    }
  }

  if (!res.ok) {
    throw new Error((data && data.error) || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  login: (username, password) =>
    request('/api/auth', { method: 'POST', body: JSON.stringify({ username, password }) }),

  getCategories: () => request('/api/categories'),
  createCategory: (name) =>
    request('/api/categories', { method: 'POST', body: JSON.stringify({ name }) }),
  updateCategory: (id, name) =>
    request(`/api/categories?id=${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  deleteCategory: (id) => request(`/api/categories?id=${id}`, { method: 'DELETE' }),

  getProducts: () => request('/api/products'),
  getAllProducts: () => request('/api/products?all=1'),
  createProduct: (payload) =>
    request('/api/products', { method: 'POST', body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/api/products?id=${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/api/products?id=${id}`, { method: 'DELETE' }),
  discountStock: (id, quantity) =>
    request(`/api/products?id=${id}&action=stock`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    }),

  getConfig: () => request('/api/config'),
  updateConfig: (whatsappNumber) =>
    request('/api/config', { method: 'PUT', body: JSON.stringify({ whatsappNumber }) }),
};