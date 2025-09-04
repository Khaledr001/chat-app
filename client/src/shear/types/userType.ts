import type { Dispatch, SetStateAction } from "react";

export interface IUserContextType {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}

export interface IUser {
  _id: string;
  name: string;
  userName: string;
  email: string;
  avatar?: {
    url: string;
    type: string;
    _id: string;
  };
  createdAt: string;
  updatedAt: string;
}

