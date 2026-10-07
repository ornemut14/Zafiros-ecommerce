// La API es serverless y vive en el mismo dominio que la tienda (Vercel),
// asi que alcanza con dejar VITE_API_URL vacio. Si se define, se antepone.
const API_URL = import.meta.env.VITE_API_URL || '';

// Evento que avisa que la sesión guardada quedó vieja. El token dura 8 horas,
// así que sin esto la app seguía creyendo que era admin y todos los pedidos
// al panel fallaban con 401 sin explicar nada en pantalla.
const SESSION_EXPIRED_EVENT = 'zafiros:sesion-vencida';

function getToken() {
  return localStorage.getItem('admin_token');
}

function clearSession() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_username');
}

// Devuelve la función para desuscribirse, para usarla como cleanup de useEffect.
export function onSessionExpired(handler) {
  window.addEventListener(SESSION_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
}

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

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
    // Si mandamos un token y la API lo rechaza, ese token ya no sirve (venció
    // o cambió el secreto): se borra la sesión y se vuelve al login. El login
    // en sí no manda token, así que un 401 ahí es solo contraseña incorrecta.
    if (res.status === 401 && token) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
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

  getMaterials: () => request('/api/materials'),
  createMaterial: (name) =>
    request('/api/materials', { method: 'POST', body: JSON.stringify({ name }) }),
  updateMaterial: (id, name) =>
    request(`/api/materials?id=${id}`, { method: 'PUT', body: JSON.stringify({ name }) }),
  deleteMaterial: (id) => request(`/api/materials?id=${id}`, { method: 'DELETE' }),

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