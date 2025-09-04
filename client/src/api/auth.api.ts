import type { IRegisterData } from "../shear/types/authType";
import { api } from "./api"; // your axios instance
import store from "../redux/store";
import { setUser } from "../redux/reducers/auth.reducer";

// --------------------
// Register
// --------------------

export const registerUser = async (userData: IRegisterData) => {
  try {
    const formData = new FormData();

    // Append fields
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }
    formData.append("name", userData.name);
    formData.append("userName", userData.userName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);

    const res = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.response?.data?.message || "Registration failed!");
  }
};

// --------------------
// Login
// --------------------
export const loginUser = async (credentials: {
  userName: string;
  password: string;
}) => {
  try {
    const res = await api.post("/auth/login", credentials);
    const data = res.data;

    // Save token
    localStorage.setItem("jwt", data?.token);
    document.cookie = `jwt=${data?.token}; path=/`;

    // Store user in Redux + localStorage
    store.dispatch(setUser(data.user));
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "Invalid Credentials!");
  }
};

// --------------------
// Verify Token
// --------------------
export const verifyToken = async () => {
  const res = await api.get("/auth/verifytoken");
  const data = res.data;

  // Store user in Redux + localStorage
  store.dispatch(setUser(data.user));
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

// -----------------
// Logout
// -----------------
export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    if (!res) {
      throw new Error("Logout failed");
    }

    return res.data;
  } catch (error) {
    console.error("Logout error:", error);
  }
};
