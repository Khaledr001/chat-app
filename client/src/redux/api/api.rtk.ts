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
    // Get Users by name
    getFriends: builder.query<any, string>({
      query: (name) => `/user/friends?name=${name}`,
      transformResponse: (response: any) => response.data,
    }),

    // Get Not Friends
    getNotFriends: builder.query<any, string>({
      query: (name) => `/user/notfriends?name=${name}`,
      transformResponse: (response: any) => response.data,
    }),

    // Get All Chats
    getAllChats: builder.query<any, string>({
      query: (userId) => `/chat/${userId}`,
      providesTags: ["Chat"],
      transformResponse: (response: any) => response.data,
    }),

    // Get All Private Chats
    getAllPrivateChats: builder.query<any, string>({
      query: (userId) => `/chat/private/${userId}`,
      providesTags: ["Chat"],
      transformResponse: (response: any) => response.data,
    }),

    // Get All Group Chats
    getAllGroupChats: builder.query<any, string>({
      query: (userId) => `/chat/group/${userId}`,
      providesTags: ["Chat"],
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
      keepUnusedDataFor: 0,
    }),

    // Send attachments
    sendAttachments: builder.mutation({
      query: (data: any) => ({
        url: "/message",
        method: "POST",
        body: data,
      }),
    }),

    // Create a group chat
    createGroup: builder.mutation({
      query: (obj: { name: string; members: string[] }) => ({
        url: "/chat/group",
        body: { name: obj.name, members: obj.members },
        method: "POST",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),

    // Add new member to group
    addNewMemberToGroup: builder.mutation({
      query: (obj: { chatId: string; members: string[] }) => ({
        url: "chat/addmembers",
        body: { chatId: obj.chatId, members: obj.members },
        method: "PUT",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),

    // Remove new member to group
    removeMemberFromGroup: builder.mutation({
      query: (obj: { chatId: string; member: string }) => ({
        url: "chat/removeMembers",
        body: { chatId: obj.chatId, member: obj.member },
        method: "PUT",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),

    // Leave group
    leaveGroup: builder.mutation({
      query: (obj: { chatId: string }) => ({
        url: "chat/leave",
        body: { chatId: obj.chatId },
        method: "PUT",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),

    // Delete a group chat
    deleteGroup: builder.mutation({
      query: (obj: { chatId: string }) => ({
        url: `chat/group/${obj.chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),
  }),
});

export default rtkApi;
export const {
  useLazyGetFriendsQuery,
  useLazyGetNotFriendsQuery,
  useGetAllChatsQuery,
  useGetAllPrivateChatsQuery,
  useGetAllGroupChatsQuery,
  useSendRequestMutation,
  useGetNotificationQuery,
  useChangeRequestStatusMutation,
  useGetAllMessageQuery,
  useGetChatDetailsQuery,
  useSendAttachmentsMutation,
  useCreateGroupMutation,
  useAddNewMemberToGroupMutation,
  useRemoveMemberFromGroupMutation,
  useLeaveGroupMutation,
  useDeleteGroupMutation,
} = rtkApi;
