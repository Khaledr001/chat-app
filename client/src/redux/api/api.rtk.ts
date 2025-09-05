import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Chat } from "../../components/chatLayout/LeftSidebar";

const rtkApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3100/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("jwt");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),

  tagTypes: ["Chat", "User", "Request", "Notification"],

  endpoints: (builder) => ({
    // Get All Chats
    getAllChats: builder.query<any, string>({
      query: (userId) => `/chat/${userId}`,
      providesTags: ["Chat"],
      transformResponse: (response: any) => response.data,
    }),

    // Get Not Friends
    getNotFriends: builder.query<any, string>({
      query: (name) => `/user/notfriends?name=${name}`,
      transformResponse: (response: any) => response.data,
    }),

    // Creata a private chat
    sendRequest: builder.mutation<any, string>({
      query: (receiverId: string) => ({
        url: "/request",
        method: "POST",
        body: { receiverId },
      }),

      invalidatesTags: ["Request"],

      // transformResponse: (response: { data: any }) => response.data,
    }),

    getNotification: builder.query<any, void>({
      query: () => ({
        url: "/request/notification",
      }),
      providesTags: ["Notification"],

      // transformResponse: (response: { data: any }) => response.data,
    }),

    changeRequestStatus: builder.mutation({
      query: (obj: { requestId: string; status: string }) => ({
        url: `/request/${obj.requestId}`,
        body: { status: obj.status },
        method: "PUT",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),
  }),
});

export default rtkApi;
export const {
  useGetAllChatsQuery,
  useLazyGetNotFriendsQuery,
  useSendRequestMutation,
  useGetNotificationQuery,
  useChangeRequestStatusMutation,
} = rtkApi;
