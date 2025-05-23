import React, { createContext, useContext, useState } from 'react';
import  {loginUser, registerUser, logoutUser,resetPassword }  from '../services';

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
    <AuthContext.Provider value={{ user, login, register, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
