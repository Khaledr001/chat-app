import { api } from "../api/api";

export interface User {
  id: string;
  name: string;
  email: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export const userApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get("/user");
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/user/${id}`);
    return response.data;
  },
};
