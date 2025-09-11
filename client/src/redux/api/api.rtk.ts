import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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

  tagTypes: ["Chat", "User", "Request", "Notification", "Message"],

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
    }),

    // Get All my notification
    getNotification: builder.query<any, void>({
      query: () => ({
        url: "/request/notification",
      }),
      providesTags: ["Notification"],
    }),

    // Friend request accept or reject
    changeRequestStatus: builder.mutation({
      query: (obj: { requestId: string; status: string }) => ({
        url: `/request/${obj.requestId}`,
        body: { status: obj.status },
        method: "PUT",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),

    // Get all message by chatId
    getAllMessage: builder.query<any, any>({
      query: ({ chatId, page }) => {
        let url = `/message/${chatId}`;
        if (page) url += `?page=${page}`;
        return url;
      },
      providesTags: (result, error, { chatId }) => [
        { type: "Message", id: chatId },
      ],
      keepUnusedDataFor: 0,
    }),

    // Get Chat details by chatId
    getChatDetails: builder.query<any, any>({
      query: ({ chatId, isPopulated = false }) => {
        let url = `/chat/details/${chatId}`;
        if (isPopulated) url += "?isPopulated=true";
        return url;
      },
      providesTags: ["Chat"],
    }),

    // Send attachments
    sendAttachments: builder.mutation({
      query: (data: any) => ({
        url: "/message",
        method: "POST",
        body: data,
      }),
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
  useGetAllMessageQuery,
  useGetChatDetailsQuery,
  useSendAttachmentsMutation,
} = rtkApi;
