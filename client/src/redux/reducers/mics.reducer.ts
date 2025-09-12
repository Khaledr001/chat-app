import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isFileMenu: false,
  uploadLoader: false,
  chatLoader: false,
  isMobile: window.innerWidth < 768,

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

    setChatLoader: (state, action: PayloadAction<boolean>) => {
      state.chatLoader = action.payload;
    },

    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setIsFileMenu, setUploadLoader, setChatLoader, setIsMobile } =
  MiscSlice.actions;

export default MiscSlice;
