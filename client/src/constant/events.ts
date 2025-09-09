// Event Name

export const CHAT_EVENTS = {
  alert: 'alert',
  refetch: 'refetch',
  message: 'message',
};

export const MESSAGE_EVENTS = {
  newMessage: 'new_message',
  sent: 'message_sent',
  received: 'message_received',
  delivered: 'message_delivered',
  read: 'message_read',
};

export const ATTACHMENT_EVENTS = {
  newAttachment: 'new_attachment',
  remove: 'attachment_remove',
};

export const REQUEST_EVENTS = {
  newRequest: 'new_request',
  requestAccepted: 'request_accepted',
  requestDeclined: 'request_declined',
};
