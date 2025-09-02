import { Request } from 'express';
import { Types } from 'mongoose';

export const emitEvents = (
  req: Request,
  event: string,
  users: string[] | Types.ObjectId[],
  message?: any,
) => {
  console.log(message);
};
