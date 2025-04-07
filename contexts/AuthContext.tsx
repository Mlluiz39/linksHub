import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  const login = async () => {
    await AsyncStorage.setItem('userToken', 'token');
    setIsLoggedIn(true);
    router.replace('/links');
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
    router.replace('./loginScreen'); // Redireciona para a tela de login após o logout
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
