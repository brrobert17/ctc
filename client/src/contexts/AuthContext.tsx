import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../utils/auth';
import { getToken, getUser, setToken, setUser, removeToken, isAuthenticated } from '../utils/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      if (isAuthenticated()) {
        const storedToken = getToken();
        const storedUser = getUser();
        
        if (storedToken && storedUser) {
          setTokenState(storedToken);
          setUserState(storedUser);
        }
      } else {
        // Clear invalid tokens
        removeToken();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUserState(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    setUserState(updatedUser);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isLoggedIn: !!user && !!token,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
