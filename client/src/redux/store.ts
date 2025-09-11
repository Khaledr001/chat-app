import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authSlice from "./reducers/auth.reducer";
import chatLayoutReducer from "./reducers/chatLayout.reducer";
import rtkApi from "./api/api.rtk";
import chatSlice from "./reducers/chat.reducer";

const store = configureStore({
  reducer: {
    [authSlice.name]: authSlice.reducer,
    [chatLayoutReducer.name]: chatLayoutReducer.reducer,
    [chatSlice.name]: chatSlice.reducer,

    // API
    [rtkApi.reducerPath]: rtkApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rtkApi.middleware),
});

setupListeners(store.dispatch);

export default store;
