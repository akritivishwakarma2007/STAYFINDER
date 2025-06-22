import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext(); // This line must be present

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Include token in user object
        setUser({ ...response.data, token });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null); // Clear user on error
        localStorage.removeItem("token"); // Clear invalid token
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, userId } = response.data; // Adjust based on backend response
      localStorage.setItem("token", token);
      setUser({ id: userId, token }); // Store minimal user data with token
      setLoading(false);
    } catch (error) {
      console.error("Login failed:", error);
      setLoading(false);
      throw error; // Let the caller handle the error
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;