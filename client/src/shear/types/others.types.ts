export interface INotification {
  _id: string;
  status: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
}

export interface IMessage {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    name: string;
    avatar?: { url: string };
  };
  content: string;
  attachments?: any;
  createdAt: Date;
}
