/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // In production, replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials to be sent with requests
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers: Map<string, number> = new Map(); // socketId -> userId
  private logger: Logger = new Logger('ChatGateway');

  constructor(private chatService: ChatService) {}

  // Handle connection
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    const activeUsersList = Array.from(this.activeUsers.values());
    this.logger.log(`Active users: ${activeUsersList.join(', ')}`);
  }

  // Handle disconnection
  handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = this.activeUsers.get(client.id);
    this.activeUsers.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);

    // Notify others that user has disconnected
    this.server.emit('userOffline', { userId });
  }

  // Handle user joining
  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: number; username: string },
  ) {
    this.activeUsers.set(client.id, data.userId);

    // Join a room with their userId for private messages
    await client.join(data.userId.toString());

    // Notify others that new user has joined
    client.broadcast.emit('userOnline', {
      userId: data.userId,
      username: data.username,
    });

    // Send currently active users to the newly joined user
    const activeUsersList = Array.from(this.activeUsers.values());
    client.emit('activeUsers', activeUsersList);

    return { status: 'ok' };
  }

  // Get conversation history
  @SubscribeMessage('getConversation')
  async handleGetConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { otherUserId: number },
  ) {
    const userId = this.activeUsers.get(client.id);
    if (!userId) {
      return { status: 'error', message: 'User not authenticated' };
    }

    try {
      const messages = await this.chatService.getConversation(
        userId,
        data.otherUserId,
      );
      return { status: 'ok', messages };
    } catch (error) {
      this.logger.error('Error fetching conversation:', error);
      return { status: 'error', message: 'Failed to fetch conversation' };
    }
  }

  // Handle private messages
  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      to: number;
      content: string;
    },
  ) {
    const senderId = this.activeUsers.get(client.id);
    this.logger.log(
      `Private message from ${senderId} to ${data.to}: ${data.content}`,
    );
    if (!senderId) {
      return { status: 'error', message: 'User not authenticated' };
    }

    try {
      const message = await this.chatService.createMessage(
        senderId,
        data.to,
        data.content,
      );

      const messagePayload = {
        id: message.id,
        content: message.content,
        from: senderId,
        to: data.to,
        timestamp: message.timestamp,
        isRead: message.isRead,
      };

      // Send to recipient
      this.server.to(data.to.toString()).emit('privateMessage', messagePayload);

      // Send back to sender
      client.emit('privateMessage', messagePayload);

      return { status: 'ok', message };
    } catch (error: any) {
      this.logger.error(`Error sending message: ${error.message}`);
      return { status: 'error', message: 'Failed to send message' };
    }
  }

  // Handle typing status
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; isTyping: boolean },
  ) {
    const userId = this.activeUsers.get(client.id);
    this.server.to(data.to).emit('userTyping', {
      userId,
      isTyping: data.isTyping,
    });
  }

  // Handle message read status
  @SubscribeMessage('messageRead')
  handleMessageRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { messageId: string; userId: string },
  ) {
    const userId = this.activeUsers.get(client.id);
    this.server.to(data.userId).emit('messageRead', {
      messageId: data.messageId,
      readBy: userId,
    });
  }
}
