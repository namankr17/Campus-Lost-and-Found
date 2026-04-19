import React, { createContext, useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const userData = await authService.verifyToken();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const updateUserCounts = (type, action) => {
    setUser((prevUser) => ({
      ...prevUser,
      postCount: type === "post" ? prevUser.postCount + 1 : prevUser.postCount,
      unresolvedCount:
        type === "post"
          ? prevUser.unresolvedCount + 1
          : prevUser.unresolvedCount,
    }));
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.login(credentials);
      setUser(data);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.signup(formData);
      setUser(data);
      setIsAuthenticated(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setPosts([]);
  };

  const updateUser = async (formData) => {
    try {
      const updatedUser = await userService.updateProfile(formData);
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        setError,
        login,
        logout,
        signup,
        updateUser,
        updateUserCounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
