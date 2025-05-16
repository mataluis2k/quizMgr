import axios from 'axios';

// Types for authentication
interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
}

// Base API URL - should be set from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance for auth
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    authAxios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete authAxios.defaults.headers.common['Authorization'];
  }
};

const setUserData = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authAxios.post<LoginResponse>('/login', {
        username,
        password,
      });

      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      setUserData(user);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      if (error.response?.status === 429) {
        throw new Error('Too many login attempts. Please try again later');
      }
      throw new Error(error.response?.data?.message || 'Failed to login. Please try again later');
    }
  },

  register: async (username: string, email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await authAxios.post<LoginResponse>('/auth/register', {
        username,
        email,
        password,
      });

      const { token, user } = response.data;
      
      // Store token and user data
      setAuthToken(token);
      setUserData(user);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Username or email already exists');
      }
      throw new Error(error.response?.data?.message || 'Failed to register. Please try again later');
    }
  },

  logout: () => {
    setAuthToken(null);
    setUserData(null);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  refreshToken: async (): Promise<void> => {
    try {
      const response = await authAxios.post<{ token: string }>('/auth/refresh');
      setAuthToken(response.data.token);
    } catch (error) {
      // If refresh fails, logout the user
      authApi.logout();
      throw new Error('Session expired. Please login again');
    }
  },

  // Password reset functionality
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      await authAxios.post('/auth/password-reset-request', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to request password reset');
    }
  },

  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      await authAxios.post('/auth/password-reset', {
        token,
        newPassword,
      });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to reset password');
    }
  },
};