import { useQuery } from "@tanstack/react-query";
import { userApi } from "../services/userApi";
import type { User } from "../services/userApi";

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: userApi.getAllUsers,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for online status
  });
};

export const useUser = (userId: string) => {
  return useQuery<User, Error>({
    queryKey: ["user", userId],
    queryFn: () => userApi.getUserById(userId),
    staleTime: 1000 * 60,
  });
};
