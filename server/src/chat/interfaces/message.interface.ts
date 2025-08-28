export interface MessagePayload {
  id: string;
  content: string;
  from: string;
  to: string;
  timestamp: Date;
  isRead: boolean;
}

export interface PopulatedMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    username: string;
  };
  receiver: {
    _id: string;
    username: string;
  };
  timestamp: Date;
  isRead: boolean;
}
