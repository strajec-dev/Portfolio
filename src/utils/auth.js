const TOKEN_KEY = 'strajec_admin_token';
const USER_KEY = 'strajec_admin_user';

export const setAuth = (token, username) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = () => {
  return localStorage.getItem(USER_KEY);
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};
