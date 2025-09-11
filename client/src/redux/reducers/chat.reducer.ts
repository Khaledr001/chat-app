import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getOrSaveToLocalStorage } from "../../util/helper";
import { MESSAGE_EVENTS } from "../../constant/events";

const initialState = {
  selectedChatId: "",
  notificationCount: 0,
  newMessageAlert: getOrSaveToLocalStorage({
    key: MESSAGE_EVENTS.newMessageAlert,
    get: true,
  }) || [
    {
      chatId: "",
      count: 0,
    },
  ],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    setSelectedChatId: (state, action: PayloadAction<string>) => {
      state.selectedChatId = action.payload;
    },

    incrementNotification: (state) => {
      state.notificationCount += 1;
    },

    resetNotification: (state) => {
      state.notificationCount = 0;
    },

    setNewMessagesAlert: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const index = state.newMessageAlert.findIndex(
        (item: any) => item.chatId === chatId
      );

      if (index !== -1) state.newMessageAlert[index].count += 1;
      else
        state.newMessageAlert.push({
          chatId,
          count: 1,
        });
    },

    resetNewMessageAlert: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      state.newMessageAlert = state.newMessageAlert.filter(
        (item: any) => item.chatId !== chatId
      );
    },
  },
});

export const {
  incrementNotification,
  resetNotification,
  setNewMessagesAlert,
  resetNewMessageAlert,
  setSelectedChatId,
} = chatSlice.actions;

export default chatSlice;
