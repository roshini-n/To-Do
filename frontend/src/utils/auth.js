/**
 * Authentication utilities for local storage management
 */

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const authUtils = {
  // Store token and user data
  setAuth: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Retrieve token
  getToken: () => localStorage.getItem(TOKEN_KEY),

  // Retrieve user data
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  // Clear authentication
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Update user info
  updateUser: (userData) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  },
};

export default authUtils;
