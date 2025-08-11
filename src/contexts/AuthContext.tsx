import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { userApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const response = await userApi.getProfile();
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          setToken(null);
          setRole(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = (authToken: string, userData: User) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('role', userData.role);
    setToken(authToken);
    setRole(userData.role);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, role, login, logout, updateUser, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}