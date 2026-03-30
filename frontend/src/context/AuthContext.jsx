import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Bypass Auth: Always logged in as an Admin
  const [user, setUser] = useState({
    name: 'Admin User',
    role: 'Admin',
    email: 'admin@farm.com'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Disabled loading from localstorage to bypass login
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('agriCRMUserInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, role = 'Employee') => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      setUser(data);
      localStorage.setItem('agriCRMUserInfo', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('agriCRMUserInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
