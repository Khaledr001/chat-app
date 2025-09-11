import type { IMessage } from "../shear/types/others.types";

export const sortMessagesByDate = (messages: any[]): IMessage[] => {
  return [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export const getOrSaveToLocalStorage = ({
  key,
  value,
  get,
}: {
  key: string;
  value?: any;
  get?: boolean;
}) => {
  if (get) {
    const item = localStorage.getItem(key);
    return item && item !== "undefined"
      ? JSON.parse(localStorage.getItem(key) || "{}")
      : null;
  } else localStorage.setItem(key, JSON.stringify(value));
};
