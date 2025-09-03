import { Request } from 'express';
import { Types } from 'mongoose';

export interface IChatEvent {
  chatId: string | Types.ObjectId;
  members: string[] | Types.ObjectId[];
  message?: any;
}

export const emitEvents = (
  req: Request,
  event: string,
  users: string[] | Types.ObjectId[],
  message?: any,
) => {
  console.log(message);
};
