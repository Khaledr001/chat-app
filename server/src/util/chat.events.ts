import { Request } from 'express';

export const emitEvents = (
  req: Request,
  event: string,
  users: string[],
  message?: any,
) => {
  console.log(message);
};
