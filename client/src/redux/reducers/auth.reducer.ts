import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IUser } from "../../shear/types/userType";

// 1. Define the state type
interface AuthState {
  user: IUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

/** @type {*} */
const initialState: AuthState = {
  user: null,
  isAdmin: false,
  isAuthenticated: false,
};

// Slice with typed reducers
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    unsetUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
  },
});

// 5. Export actions & reducer
export const { setUser, unsetUser } = authSlice.actions;
export default authSlice;
