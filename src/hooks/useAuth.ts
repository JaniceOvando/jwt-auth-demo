import { useState, useCallback } from "react";
import { login as loginService } from "../services/authService";
import type { LoginPayload } from "../services/authService";

const TOKEN_KEY = "taskflow_token";
const USER_KEY = "taskflow_user";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem(USER_KEY)
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { token: newToken } = await loginService(payload);
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, payload.username);
      setToken(newToken);
      setUsername(payload.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUsername(null);
  }, []);

  return {
    token,
    username,
    isAuthenticated: !!token,
    login,
    logout,
    error,
    loading,
  };
}
