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

@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');
  private activeUsers: Map<string, string> = new Map(); // socketId -> userId

  // Handle connection
  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
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
  handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string; username: string },
  ) {
    this.activeUsers.set(client.id, data.userId);

    // Join a room with their userId for private messages
    client.join(data.userId);

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

  // Handle private messages
  @SubscribeMessage('privateMessage')
  handlePrivateMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      to: string;
      content: string;
      from: string;
    },
  ) {
    const message = {
      content: data.content,
      from: data.from,
      to: data.to,
      timestamp: new Date(),
    };

    // Send to recipient
    this.server.to(data.to).emit('privateMessage', message);

    // Send back to sender
    client.emit('privateMessage', message);

    return { status: 'ok' };
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
