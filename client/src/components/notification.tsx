import { useEffect, useState } from "react";
import { useAsyncMutation, useErrors } from "../hooks/custom";
import {
  useChangeRequestStatusMutation,
  useGetNotificationQuery,
} from "../redux/api/api.rtk";
import type { INotification } from "../shear/types/others.types";
import { serverUrl } from "../constant/env";
import { Check, X } from "lucide-react";
import { REQUEST_STATUS } from "../constant/misc";

const NotificationContant = () => {
  const [contant, setContant] = useState<INotification[] | null>(null);

  const {
    data,
    isSuccess,
    isLoading: notificationLoader,
    isError,
    error,
    refetch,
  } = useGetNotificationQuery();

  useErrors([{ isError, error }]);

  useEffect(() => {
    setContant(data?.data?.notifications);
  }, [data]);

  // Call Status Update Method
  const [executeMutation] = useAsyncMutation(useChangeRequestStatusMutation);

  const handleAccept = (requestId: string) => {
    try {
      console.log("requestId", requestId);
      executeMutation("Accepting friend request...", {
        requestId,
        status: REQUEST_STATUS.ACCEPT,
      });
    } catch (error) {}
  };
  const handleReject = (requestId: string) => {
    try {
      executeMutation("Rejecting friend request...", {
        requestId,
        status: REQUEST_STATUS.REJECT,
      });
    } catch (error) {}
  };

  return (
    <div className="dropdown dropdown-end">
      <button tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <div className="indicator">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />{" "}
          </svg>
          <span className="badge badge-xs badge-primary indicator-item w-5 h-5 text-[16px]">
            {contant?.length}
          </span>
        </div>
      </button>

      <div
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-1 w-[200px] sm:w-[300px] md:w-[400px] p-2 shadow-sm border-2">
        <div>
          {contant && contant?.length > 0 ? (
            contant.map((notification: INotification, index: number) => (
              <div
                key={index}
                className="!p-3 flex justify-between !m-2 items-center border border-base-300 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-1 ring-offset-1">
                      <img
                        src={`${serverUrl}/${notification?.sender?.avatar}`}
                      />
                    </div>
                  </div>

                  <div className="text-xl">{notification.sender.name}</div>
                </div>
                {notification.status === "pending" && (
                  <div className="flex gap-3">
                    <div className="tooltip tooltip-success" data-tip="accept">
                      <button
                        onClick={() => handleAccept(notification._id)}
                        className="btn btn-outline btn-success rounded-full !h-8 !w-8">
                        <Check className="w-5" />
                      </button>
                    </div>
                    <div className="tooltip tooltip-error" data-tip="reject">
                      <button
                        onClick={() => handleReject(notification._id)}
                        className="btn btn-outline btn-error rounded-full !h-8 !w-8">
                        <X className="w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>
              {" "}
              <p>Not Notification Found!</p>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationContant;
