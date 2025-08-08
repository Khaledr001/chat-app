export interface ChatMessage {
  id?: string;
  content: string;
  from: string;
  to: string;
  timestamp: Date;
  read?: boolean;
}

export interface UserStatus {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
}
