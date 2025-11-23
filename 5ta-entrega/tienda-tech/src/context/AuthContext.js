import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import { loginUser, registerUser, getMe } from "../api/auth";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar token guardado al iniciar app
  useEffect(() => {
    const loadToken = async () => {
      const storedJwt = await SecureStore.getItemAsync("jwt");

      if (storedJwt) {
        setJwt(storedJwt);
        try {
          const me = await getMe(storedJwt);
          setUser(me);
        } catch (err) {
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    setJwt(res.jwt);
    setUser(res.user);
    await SecureStore.setItemAsync("jwt", res.jwt);
  };

  const register = async (username, email, password) => {
    const res = await registerUser(username, email, password);
    setJwt(res.jwt);
    setUser(res.user);
    await SecureStore.setItemAsync("jwt", res.jwt);
  };

  const logout = async () => {
    setUser(null);
    setJwt(null);
    await SecureStore.deleteItemAsync("jwt");
  };

  return (
    <AuthContext.Provider value={{ user, jwt, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
