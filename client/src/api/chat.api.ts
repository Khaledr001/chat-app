// src/services/chat.ts
import { number } from "framer-motion";
import { api } from "./api";

// --------------------
// Get All My Chats (both private and group)
// --------------------
export const getAllMyChats = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required to fetch chats");
  }

  try {
    const res = await api.get(`/chat/${userId}`);
    return res.data;
  } catch (error: any) {
    console.error(
      "Failed to fetch chats:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllMessageByChatId = async (chatId: string, page: number) => {
  try {
    let url = `/message/${chatId}`;
    if (page) url += `?page=${page}`;
    const res = await api.get(url);

    return res.data;
  } catch (error: any) {
    console.log("Failed to fetch messages", error.message);
    throw error;
  }
};
