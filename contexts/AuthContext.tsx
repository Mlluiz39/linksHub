// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import {
  GoogleSignin,
  isSuccessResponse,
  SignInResponse,
  User as GoogleUser,
} from '@react-native-google-signin/google-signin';

interface User extends GoogleUser {
  email: string;
  photo?: string; // Add the photo property
  familyName?: string; // Add the familyName property
  givenName?: string; // Add the givenName property
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState<User | null>(null);
  const router = useRouter();

  GoogleSignin.configure({
    webClientId:
      '583944780644-2q52b0t0ilg034rupgr4luuu240epp2p.apps.googleusercontent.com',
  });

  async function handleGoogleSignIn() {
        try {
          const response: SignInResponse = await GoogleSignin.signIn();
          if (isSuccessResponse(response)) {
            setAuth({
              user: response.data.user,
              email: response.data.user.email,
              photo: response.data.user.photo,
              familyName: response.data.user.familyName,
              givenName: response.data.user.givenName,
              idToken: response.data.user.id,
              scopes: response.data.scopes,
              serverAuthCode: response.data.serverAuthCode,
            });
            login();
            router.replace('/');
      }
      login();
      router.replace('/');
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };
    checkLogin();
  }, []);

  const login = async () => {
    await AsyncStorage.setItem('userToken', 'token');
    setIsLoggedIn(true);
    router.replace('/'); // ou /links, como preferir
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
    router.replace('/auth/loginScreen'); // Certifique-se que essa rota existe
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, handleGoogleSignIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
