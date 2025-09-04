import type { IAuthResponse } from "../shear/types/authType";
import type { IUser } from "../shear/types/userType";
import { api } from "../api/api";

interface RegisterData {
  name: string;
  userName: string;
  email: string;
  password: string;
}

interface LoginData {
  userName: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<IAuthResponse> => {
    const response = await api.post<IAuthResponse>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<IUser> => {
    const response = await api.get<{ user: IUser }>("/auth/me");
    return response.data.user;
  },
};
