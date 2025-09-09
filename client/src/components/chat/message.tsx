import { useSelector } from "react-redux";
import type { IMessage } from "../../shear/types/others.types";
import { serverUrl } from "../../constant/env";
import { File, FileBadge } from "lucide-react";

const MessageComponent = ({ message }: { message: IMessage }) => {
  const user = useSelector((state: any) => state.auth.user);

  const isSameSender = message?.sender?._id === user._id;

  return (
    <div className={`chat ${isSameSender ? "chat-end" : "chat-start"} !py-2`}>
      {/* Sender avatar */}
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img
            alt={message?.sender?.name}
            src={
              message?.sender?.avatar?.url
                ? `http://localhost:3100/${message?.sender?.avatar?.url}`
                : "/default-avatar.png"
            }
          />
        </div>
      </div>

      {/* Header with sender name + time */}
      <div className="chat-header text-xs">
        {!isSameSender && message?.sender?.name}
        <time className="text-xs opacity-50 ml-2">
          {new Date(message?.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>

      {/* Attachment Or Contant*/}
      {message?.attachments?.length > 0 ? (
        message.attachments.map((attachment: any, index: number) => {
          const url = attachment?.url;
          const type = attachment?.type; // image, video, audio, file

          return (
            <div
              key={index}
              className={`chat-bubble !py-1.5 !px-1.5 whitespace-pre-wrap break-words ${
                isSameSender ? "chat-bubble-primary" : "chat-bubble-secondary"
              }`}>
              {/* Show text content only once (before attachments) */}
              {index === 0 && message?.content && (
                <p className="!mb-1">{message.content}</p>
              )}

              {/* Render attachment by type */}
              {type === "image" && (
                <img
                  src={`${serverUrl}/${url}`}
                  alt="attachment"
                  className="max-w-xs rounded-lg w-20"
                />
              )}

              {type === "video" && (
                <video controls className="max-w-xs rounded-lg">
                  <source src={url} />
                  Your browser does not support the video tag.
                </video>
              )}

              {type === "audio" && (
                <audio controls className="w-48">
                  <source src={`${serverUrl}/${url}`} />
                  Your browser does not support the audio element.
                </audio>
              )}

              {type === "application" && (
                <a
                  href={`${serverUrl}/${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 justify-center">
                  <FileBadge /> View File
                </a>
              )}
            </div>
          );
        })
      ) : (
        <div
          className={`chat-bubble !py-1.5 !px-3 whitespace-pre-wrap break-words ${
            isSameSender ? "chat-bubble-primary" : "chat-bubble-secondary"
          }`}>
          {message?.content}
        </div>
      )}

      {/* Footer */}
      {isSameSender && (
        <div className="chat-footer opacity-50 text-xs">Delivered</div>
      )}
    </div>
  );
};

export default MessageComponent;
