import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Mock user database
const users = {
  'admin': { password: 'admin123', role: 'admin', name: 'System Administrator' },
  'operator': { password: 'operator123', role: 'operator', name: 'Fleet Operator' },
  'viewer': { password: 'viewer123', role: 'viewer', name: 'Data Viewer' },
  'sadhana': { password: 'password123', role: 'admin', name: 'Sadhana' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved token on app start
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userData = users[username.toLowerCase()];
        
        if (userData && userData.password === password) {
          const token = btoa(`${username}:${Date.now()}`);
          const userInfo = {
            username: username.toLowerCase(),
            name: userData.name,
            role: userData.role
          };
          
          // Save to localStorage
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(userInfo));
          
          setUser(userInfo);
          resolve(userInfo);
        } else {
          reject(new Error('Invalid username or password'));
        }
      }, 1000); // Simulate API delay
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const hasPermission = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'viewer': 1,
      'operator': 2,
      'admin': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
