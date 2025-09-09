import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isFileMenu: false,
  uploadLoader: false,
};

const MiscSlice = createSlice({
  name: "misc",
  initialState,

  reducers: {
    setIsFileMenu: (state, action: PayloadAction<boolean>) => {
      state.isFileMenu = action.payload;
    },
    setUploadLoader: (state, action: PayloadAction<boolean>) => {
      state.uploadLoader = action.payload;
    },
  },
});

export const { setIsFileMenu, setUploadLoader } = MiscSlice.actions;

export default MiscSlice;
