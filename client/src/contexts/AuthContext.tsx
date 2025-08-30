import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";
import { authApi } from "../services/authApi";
import type { IAuthContextType, IRegisterData } from "../shear/types/authType";
import type { IUser } from "../shear/types/userType";

const AuthContext = createContext<IAuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const token = document.cookie.split("=")[1];
        if (token) {
          api.defaults.headers.common["Authorization"] = `${token}`;
        }
        const response = await api.get("/auth/verifytoken");
        setUser(response.data.user);

        setIsAuthenticated(true);
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userName: string, password: string) => {
    const response = await authApi.login({ userName, password });
    setUser(response.user);
    setIsAuthenticated(true);

    localStorage.setItem("user", JSON.stringify(response.user));
  };

  const signup = async (registerData: IRegisterData) => {
    try {
      const { data } = await api.post("/auth/register", registerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
