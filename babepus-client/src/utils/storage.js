const TOKEN_KEY = "babepus_access_token";
const USER_KEY = "babepus_user";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

export const userStorage = {
  get: () => {
    try {
      const userData = localStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem(USER_KEY);
      return null;
    }
  },
  set: (user) => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },
  clear: () => localStorage.removeItem(USER_KEY)
};
