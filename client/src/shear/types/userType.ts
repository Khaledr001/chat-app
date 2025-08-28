import type { Dispatch, SetStateAction } from "react";

export interface IUserContextType {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}

export interface IUser {
  id: number;
  name: string;
  userName: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

