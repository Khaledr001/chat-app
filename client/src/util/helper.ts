import type { IMessage } from "../shear/types/others.types";

export const sortMessagesByDate = (messages: any[]): IMessage[] => {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};
