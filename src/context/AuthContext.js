import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user data on app load
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      const userData = JSON.parse(storedUser);
      // Ensure userType is set
      if (!userData.userType) {
        let userType = "admin";
        try {
          const tokenPayload = JSON.parse(atob(storedToken.split('.')[1]));
          if (tokenPayload.type === "student") {
            userType = "student";
          } else if (tokenPayload.type === "school") {
            userType = "school";
          } else if (tokenPayload.role === "admin" || tokenPayload.type === "admin") {
            userType = "admin";
          }
        } catch (e) {
          if (userData.studentId) {
            userType = "student";
          } else if (userData.schoolId) {
            userType = "school";
          }
        }
        userData.userType = userType;
        localStorage.setItem("user", JSON.stringify(userData));
      }
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    // Determine user type from token or user data
    let userType = "admin"; // default
    try {
      const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
      if (tokenPayload.type === "student") {
        userType = "student";
      } else if (tokenPayload.type === "school") {
        userType = "school";
      } else if (tokenPayload.role === "admin" || tokenPayload.type === "admin") {
        userType = "admin";
      }
    } catch (e) {
      // If token parsing fails, try to infer from user data
      if (userData.type === "student" || userData.studentId) {
        userType = "student";
      } else if (userData.type === "school" || userData.schoolId) {
        userType = "school";
      }
    }
    
    const userWithType = { ...userData, userType };
    setUser(userWithType);
    setToken(authToken);
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userWithType));
    localStorage.setItem("userType", userType);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const getUserType = () => {
    if (!user) return null;
    return user.userType || (user.studentId ? "student" : user.schoolId ? "school" : "admin");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token,
    userType: getUserType(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
