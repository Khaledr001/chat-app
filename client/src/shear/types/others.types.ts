export interface INotification {
  _id: string;
  status: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
  };
}
