// client/src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user on app start
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
      setUser(userRes.data);
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  // Register
  const register = async (name, email, password, role) => {
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, { name, email, password, role });
      localStorage.setItem('token', res.data.token);
      const userRes = await axios.get(`${API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${res.data.token}`,
        },
      });
      setUser(userRes.data);
    } catch (err) {
      console.error("Register failed", err);
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthContext, AuthProvider };
