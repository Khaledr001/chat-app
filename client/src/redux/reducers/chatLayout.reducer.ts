import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../shear/types/userType";
import { setUser } from "./auth.reducer";

interface IChatLayout {
  showDetails: boolean;
  showChats: boolean;
  selectedChat: IUser | null;
}

const initialState: IChatLayout = {
  showDetails: true,
  showChats: true,
  selectedChat: null,
};

const chatLayoutReducer = createSlice({
  name: "chatLayout",
  initialState: initialState,

  reducers: {
    setDetails: (state, action: PayloadAction<boolean>) => {
      state.showDetails = action.payload;
    },
    setChats: (state, action: PayloadAction<boolean>) => {
      state.showChats = action.payload;
    },

    setSeletedUser: (state, action: PayloadAction<IUser | null>) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setDetails, setChats, setSeletedUser } = chatLayoutReducer.actions;

export default chatLayoutReducer;