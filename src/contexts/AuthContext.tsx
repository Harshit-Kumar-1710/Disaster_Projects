import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage on app initialization
    const storedUser = localStorage.getItem('safescape_user');
    
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('safescape_user');
      }
    }
    
    setLoading(false);
  }, []);

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a mock user
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email
      };
      
      // Store user in localStorage
      localStorage.setItem('safescape_user', JSON.stringify(newUser));
      setCurrentUser(newUser);
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mock login function
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This is a demo, so we'll accept any credentials
      if (email && password) {
        const mockUser = {
          id: `user_${Date.now()}`,
          name: email.split('@')[0],
          email
        };
        
        localStorage.setItem('safescape_user', JSON.stringify(mockUser));
        setCurrentUser(mockUser);
      } else {
        throw new Error('Email and password are required');
      }
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('safescape_user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};