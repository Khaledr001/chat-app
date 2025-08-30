import type { IUser } from "./userType";

export interface IRegisterData {
  avatar: File | null;
  name: string;
  userName: string;
  email: string;
  password: string;
}

export interface IAuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (registerData: IRegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

export interface IAuthResponse {
  user: IUser;
  token: string;
}