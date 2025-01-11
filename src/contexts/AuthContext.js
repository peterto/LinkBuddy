import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const login = async () => {
    await SecureStore.setItem('isLoggedIn', 'true');
    setIsSignedIn(true);
  };

  const logout = async () => {
    const keysToDelete = [
      'jwtToken',
      'baseURL',
      'isDarkMode',
      'isLoggedIn',
      'links',
      'tagsList',
      'linksList',
      'cachedLinks',
    ];
    await Promise.all(keysToDelete.map(key => SecureStore.deleteItemAsync(key)));
    setIsSignedIn(false);
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const value = await SecureStore.getItemAsync('isLoggedIn');
      setIsSignedIn(value === 'true');
    };
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isSignedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
