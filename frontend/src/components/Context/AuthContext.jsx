import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAdmin = localStorage.getItem("admin");
    if (token && storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("admin", JSON.stringify(data.user));
    setAdmin(data.user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setAdmin(null);
    localStorage.clear();
    setIsAuthenticated(false);
  };
  const value = {
    admin,
    isAuthenticated,
    login,
    logout,
    loading,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
