/**
 * Authentication service for DummyJSON API
 * @see https://dummyjson.com/docs/auth
 */

const AUTH_API_URL = 'https://dummyjson.com/auth';
const TOKEN_KEY = 'dog_viewer_auth_token';
const USER_KEY = 'dog_viewer_user';

/**
 * Login user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User object with token
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Store token and user info in localStorage
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image
    }));
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

/**
 * Get current user information
 * @returns {Object|null} - User object or null if not logged in
 */
export const getCurrentUser = () => {
  const userJSON = localStorage.getItem(USER_KEY);
  return userJSON ? JSON.parse(userJSON) : null;
};

/**
 * Get authentication token
 * @returns {string|null} - Token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if token is expired
 * Note: DummyJSON tokens don't have a standard expiration
 * This is a simplified example - in a real app, you'd decode the JWT
 * @returns {boolean} 
 */
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  // In a real app, you would decode JWT and check expiration
  // For DummyJSON, we'll assume the token is valid if it exists
  return false;
};
