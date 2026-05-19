import { createContext, useCallback, useEffect, useState } from "react";
import { authService } from "../services/authService";
import { setUnauthorizedHandler } from "../services/api/client";
import { tokenStorage, userStorage } from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => userStorage.get());
  const [token, setToken] = useState(() => tokenStorage.get());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const logout = useCallback(() => {
    tokenStorage.clear();
    userStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const currentToken = tokenStorage.get();

    if (!currentToken) {
      setIsBootstrapping(false);
      return null;
    }

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
      userStorage.set(currentUser); // Cache user data
      setToken(currentToken);
      return currentUser;
    } catch (error) {
      console.warn('Failed to refresh user:', error.message);
      logout();
      return null;
    } finally {
      setIsBootstrapping(false);
    }
  }, [logout]);

  const login = async (payload) => {
    try {
      const data = await authService.login(payload);
      tokenStorage.set(data.token);
      userStorage.set(data.user);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      // Clear any partial data on login failure
      tokenStorage.clear();
      userStorage.clear();
      throw error;
    }
  };

  const register = async (payload) => {
    try {
      const data = await authService.register(payload);
      tokenStorage.set(data.token);
      userStorage.set(data.user);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      // Clear any partial data on register failure
      tokenStorage.clear();
      userStorage.clear();
      throw error;
    }
  };

  useEffect(() => {
    setUnauthorizedHandler(logout);
    refreshUser();
  }, [logout, refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isBootstrapping,
        login,
        logout,
        refreshUser,
        register,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
