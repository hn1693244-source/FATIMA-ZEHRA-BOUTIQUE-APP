// API client utilities
import { auth } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface APIOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
}

async function apiCall<T>(endpoint: string, options: APIOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = auth.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401) {
      auth.logout();
      throw new Error('Unauthorized');
    }
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const userAPI = {
  register: (email: string, password: string, name: string) =>
    apiCall('/users/register', {
      method: 'POST',
      body: { email, password, name },
    }),

  login: (email: string, password: string) =>
    apiCall('/users/login', {
      method: 'POST',
      body: { email, password },
    }),

  getProfile: () => apiCall('/users/me'),

  updateProfile: (data: unknown) =>
    apiCall('/users/me', {
      method: 'PUT',
      body: data,
    }),
};

export const orderAPI = {
  getCart: () => apiCall('/cart'),

  addToCart: (productId: number, quantity: number) =>
    apiCall('/cart/items', {
      method: 'POST',
      body: { productId, quantity },
    }),

  removeFromCart: (itemId: string) =>
    apiCall(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),

  checkout: (data: unknown) =>
    apiCall('/checkout', {
      method: 'POST',
      body: data,
    }),

  getOrders: () => apiCall('/orders'),

  getOrder: (id: string) => apiCall(`/orders/${id}`),
};

export const productAPI = {
  getProducts: (params?: Record<string, unknown>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
    }
    return apiCall(`/products${query.toString() ? `?${query.toString()}` : ''}`);
  },

  getProduct: (id: number) => apiCall(`/products/${id}`),

  getCategories: () => apiCall('/categories'),
};
