import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isGuestMode: boolean;
  login: () => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const login = () => {
    setIsAuthenticated(true);
    setIsGuestMode(false);
  };

  const loginAsGuest = () => {
    setIsAuthenticated(true);
    setIsGuestMode(true);
    // 清除任何现有的持久化数据，确保游客模式的数据隔离
    console.log('游客模式已启用，数据将不会保存');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsGuestMode(false);
    // 如果是游客模式，清理临时数据
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isGuestMode, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 