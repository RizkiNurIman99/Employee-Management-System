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
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isTokenExpired = payload?.exp
          ? payload.exp * 1000 <= Date.now()
          : true;

        if (isTokenExpired) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
        } else {
          setAdmin(JSON.parse(storedAdmin));
          setIsAuthenticated(true);
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
      }
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
