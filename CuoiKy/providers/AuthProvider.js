import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const userData = await loginUser(email, password);
    setUser(userData);
  };

  const register = async (email, password, displayName) => {
    const userData = await registerUser(email, password, displayName);
    setUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
