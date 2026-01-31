// Authentication utilities
export interface User {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export const auth = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
    return null;
  },

  setUser: (user: User): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      if (user.token) {
        localStorage.setItem('auth_token', user.token);
      }
    }
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('auth_token');
  },

  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }
};
