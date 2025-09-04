import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { verifyToken } from "../api/auth.api";

export const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        let token = document.cookie.split("=")[1];
        if (!token) token = localStorage.getItem("jwt") as string;
        if (!token) throw new Error("No token found");

        const data = await verifyToken();

        if (data) {
          // User is authenticated
          console.count("private route");

          console.log("User is authenticated:", data);
        }

        navigate("/");
      } catch (error) {
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
};
