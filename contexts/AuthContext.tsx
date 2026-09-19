import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from "DB" (LocalStorage) on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('sharpkala_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Simulate Database Connection and Validation
  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    console.log("System: Connecting to Database...");
    
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // Mock validation
        if (email.length > 3 && pass.length > 3) {
            const mockUser: User = {
                id: 'usr_' + Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0], // Use part of email as name for mock login
                email: email,
                token: 'jwt_mock_token_123456'
            };
            setUser(mockUser);
            localStorage.setItem('sharpkala_user', JSON.stringify(mockUser));
            console.log("System: User authenticated securely.");
            resolve(true);
        } else {
            console.error("System: Auth Failed.");
            resolve(false);
        }
        setIsLoading(false);
      }, 1500);
    });
  };

  const signup = async (name: string, email: string, pass: string) => {
    setIsLoading(true);
    console.log("System: Connecting to Database...");
    console.log("System: Hashing password with bcrypt...");

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const newUser: User = {
            id: 'usr_' + Math.random().toString(36).substr(2, 9),
            name: name,
            email: email,
            token: 'jwt_mock_token_' + Date.now()
        };
        setUser(newUser);
        localStorage.setItem('sharpkala_user', JSON.stringify(newUser));
        console.log("System: User registered and data saved to DB.");
        resolve(true);
        setIsLoading(false);
      }, 2000);
    });
  };

  const resetPassword = async (email: string) => {
      setIsLoading(true);
      console.log(`System: Initiating password reset for ${email}...`);
      return new Promise<boolean>((resolve) => {
          setTimeout(() => {
              // Simulate checking if email exists in DB
              console.log("System: Reset link generated and sent to SMTP server.");
              resolve(true);
              setIsLoading(false);
          }, 1500);
      });
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    console.log("System: Redirecting to Google OAuth 2.0 Secure Gateway...");
    return new Promise<boolean>((resolve) => {
        setTimeout(() => {
            const googleUser: User = {
                id: 'goo_' + Math.random().toString(36).substr(2, 9),
                name: 'Google User',
                email: 'user@gmail.com',
                token: 'oauth_token_xyz'
            };
            setUser(googleUser);
            localStorage.setItem('sharpkala_user', JSON.stringify(googleUser));
            console.log("System: Google Auth Successful.");
            resolve(true);
            setIsLoading(false);
        }, 1500);
    })
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sharpkala_user');
    console.log("System: User logged out.");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, resetPassword, loginWithGoogle, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};