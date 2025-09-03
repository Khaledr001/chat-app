// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   ConnectedSocket,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { Logger } from '@nestjs/common';
// import { Types } from 'mongoose';
// import { MessagePayload } from './interfaces/message.interface';
// import { Message } from 'src/database/schemas/message.schema';
// import { ChatService1 } from './chat1.service';

// @WebSocketGateway({
//   cors: {
//     origin: 'http://localhost:5173', // In production, replace with your frontend URL
//     methods: ['GET', 'POST'],
//     credentials: true, // Allow credentials to be sent with requests
//   },
// })
// export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private activeUsers: Map<string, Types.ObjectId> = new Map(); // socketId -> userId
//   private logger: Logger = new Logger('ChatGateway');

//   constructor(private chatService: ChatService1) {}

//   // Handle connection
//   handleConnection(@ConnectedSocket() client: Socket) {
//     this.logger.log(`Client connected: ${client.id}`);
//     const activeUsersList = Array.from(this.activeUsers.values());
//     this.logger.log(`Active users: ${activeUsersList.join(', ')}`);
//   }

//   // Handle disconnection
//   handleDisconnect(@ConnectedSocket() client: Socket) {
//     const userId = this.activeUsers.get(client.id);
//     this.activeUsers.delete(client.id);
//     this.logger.log(`Client disconnected: ${client.id}`);

//     // Notify others that user has disconnected
//     this.server.emit('userOffline', { userId });
//   }

//   // Handle user joining
//   @SubscribeMessage('join')
//   async handleJoin(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { userId: string; username: string },
//   ) {
//     const userId = new Types.ObjectId(data.userId);
//     this.activeUsers.set(client.id, userId);

//     // Join a room with their userId for private messages
//     await client.join(userId.toString());

//     // Notify others that new user has joined
//     client.broadcast.emit('userOnline', {
//       userId: userId.toString(),
//       username: data.username,
//     });

//     // Send currently active users to the newly joined user
//     const activeUsersList = Array.from(this.activeUsers.values()).map((id) =>
//       id.toString(),
//     );
//     client.emit('activeUsers', activeUsersList);

//     return { status: 'ok' };
//   }

//   // Get conversation history
//   @SubscribeMessage('getConversation')
//   async handleGetConversation(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { otherUserId: string },
//   ) {
//     const userId = this.activeUsers.get(client.id);
//     if (!userId) {
//       return { status: 'error', message: 'User not authenticated' };
//     }

//     try {
//       const otherUserId = new Types.ObjectId(data.otherUserId);
//       const messages = await this.chatService.getConversation(
//         userId,
//         otherUserId,
//       );

//       const transformedMessages = messages.map(
//         (msg: Message & { _id: Types.ObjectId }) => ({
//           id: msg._id.toString(),
//           content: msg.content,
//           sender: (
//             msg.sender as unknown as { _id: Types.ObjectId }
//           )._id.toString(),
//           chat: (msg.chat as unknown as { _id: Types.ObjectId })._id.toString(),
//         }),
//       );

//       return {
//         status: 'ok',
//         messages: transformedMessages,
//       };
//     } catch (error) {
//       this.logger.error('Error fetching conversation:', error);
//       return { status: 'error', message: 'Failed to fetch conversation' };
//     }
//   }

//   // Handle private messages
//   @SubscribeMessage('privateMessage')
//   async handlePrivateMessage(
//     @ConnectedSocket() client: Socket,
//     @MessageBody()
//     data: {
//       to: string;
//       content: string;
//     },
//   ) {
//     const senderId = this.activeUsers.get(client.id);
//     if (!senderId) {
//       return { status: 'error', message: 'User not authenticated' };
//     }

//     try {
//       const receiverId = new Types.ObjectId(data.to);
//       this.logger.log(
//         `Private message from ${senderId.toString()} to ${receiverId.toString()}: ${data.content}`,
//       );

//       const message = (await this.chatService.createMessage(
//         senderId,
//         receiverId,
//         data.content,
//       )) as Message & { _id: Types.ObjectId };

//       const messagePayload: MessagePayload = {
//         id: message._id.toString(),
//         content: message.content,
//         from: senderId.toString(),
//         to: receiverId.toString(),
//       };

//       // Send to recipient
//       this.server
//         .to(receiverId.toString())
//         .emit('privateMessage', messagePayload);

//       // Send back to sender
//       client.emit('privateMessage', messagePayload);

//       return { status: 'ok', message: messagePayload };
//     } catch (error: any) {
//       this.logger.error(`Error sending message: ${error.message}`);
//       return { status: 'error', message: 'Failed to send message' };
//     }
//   }

//   // Handle typing status
//   @SubscribeMessage('typing')
//   handleTyping(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { to: string; isTyping: boolean },
//   ) {
//     const userId = this.activeUsers.get(client.id);
//     if (!userId) return;

//     const receiverId = new Types.ObjectId(data.to);
//     this.server.to(receiverId.toString()).emit('userTyping', {
//       userId: userId.toString(),
//       isTyping: data.isTyping,
//     });
//   }

//   // Handle message read status
//   @SubscribeMessage('messageRead')
//   async handleMessageRead(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { messageId: string; userId: string },
//   ) {
//     const userId = this.activeUsers.get(client.id);
//     if (!userId) return;

//     const receiverId = new Types.ObjectId(data.userId);
//     await this.chatService.markMessagesAsRead(userId, receiverId);

//     this.server.to(receiverId.toString()).emit('messageRead', {
//       messageId: data.messageId,
//       readBy: userId.toString(),
//     });
//   }
// }
