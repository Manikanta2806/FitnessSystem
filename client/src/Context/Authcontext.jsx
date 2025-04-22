import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the context
export const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuthContext = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user._id) localStorage.setItem("userId", user._id);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = async (credentials) => {
    const response = await axios.post("http://localhost:4000/api/users/login", credentials);
    const { token, role, userId } = response.data;

    if (!userId) throw new Error("Invalid login response: missing userId");

    setToken(token);
    setUser({ _id: userId, role });
    setUserId(userId);

    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserId(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, userId, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
