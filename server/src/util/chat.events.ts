import { Request } from 'express';

export const emitEvents = (
  req: Request,
  event: string,
  users: string[],
  message: string,
) => {
  console.log(message);
};
