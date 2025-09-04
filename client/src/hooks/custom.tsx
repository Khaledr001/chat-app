import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export const useErrors = (
  errors: { isError: boolean; error: any; fallBack?: () => void }[] = []
) => {
  useEffect(() => {
    errors.forEach(
      ({
        isError,
        error,
        fallBack,
      }: {
        isError: boolean;
        error: any;
        fallBack?: () => void;
      }) => {
        if (isError) {
          if (fallBack) fallBack();
          else {
            toast.error(
              error?.data?.message || error?.message || "Something went wrong!"
            );
          }
        }
      }
    );
  }, [errors]);
};

export const useAsyncMutation = (mutationHook: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const [mutate] = mutationHook();

  const executeMutation = async (toastMessage: string, ...args: any) => {
    setIsLoading(true);

    const toastId = toast.loading(toastMessage || "Updating data...");
    try {
      console.log("args",...args);
      const res = await mutate(...args);
      if (!res || !res.data) throw new Error(res?.error?.data?.message);
      setData(res?.data);
      console.log(res?.data);

      toast.success(res?.data?.message || "Updated data successfully!", {
        id: toastId,
      });
    } catch (error: any) {
      const errorMessage = error?.message || "Updating data failed!";
      console.log(errorMessage);
      toast.error(errorMessage, {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return [executeMutation, isLoading, data];
};
