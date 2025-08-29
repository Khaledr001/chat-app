import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  const { isAuthenticated } = useAuth;

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const token = document.cookie.split("=")[1];
        if (!token)
          if (token) {
            api.defaults.headers.common["Authorization"] = `${token}`;
          }
        const response = await api.get("/auth/verifytoken");
        if (response.data?.user) {
          setIsAuth(true);

          localStorage.setItem("user", JSON.stringify(response.data?.user));
        }
        else navigate("/login");
      } catch (error) {
        setIsAuth(false);
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
};
