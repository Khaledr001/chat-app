import { Injectable, Logger, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthGuard } from 'src/auth/auth.guard';
import { SocketService } from './socket.service';
import { CHAT_EVENTS, MESSAGE_EVENTS } from 'src/constants/events';
import type { IChatEvent } from 'src/util/chat.events';
import { ChatEventDto } from './dto/new-message.dto';
import { MessageService } from 'src/message/message.service';
import { Types } from 'mongoose';
import { createSocketMiddleware } from './socket.middleware';
import { AuthService } from 'src/auth/auth.service';
import type { User } from 'src/database/schemas/user.schema';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*', // In production, replace with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials to be sent with requests
  },
})
export class MySocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private socketService: SocketService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    this.initializeMiddleware();
  }

  private initializeMiddleware() {
    this.server.use(createSocketMiddleware(this.authService));
  }

  private logger: Logger = new Logger('ChatGateway');

  // Temporary user
  private user: any = {};

  // Handle connection
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.user = socket.data.user;
    // Add new connection in activeUsers map
    this.socketService.addUser(this.user._id.toString(), socket.id);
    this.logger.log(`Client connected: ${socket.id}`);
  }

  // Handle disconnection
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.user = socket.data.user;
    // Remove connection from activeUsers map
    this.socketService.removeUser(this.user._id.toString());
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage(MESSAGE_EVENTS.newMessage) // To receive event
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody(new ValidationPipe({ whitelist: true })) payload: ChatEventDto,
  ): Promise<void> {
    this.user = socket.data.user;

    console.log('Message received:', payload);

    const memberSocketIds = this.socketService.getUsersSocketId([
      this.user._id.toString(),
    ]);

    // RealTime Message
    const realTimeMessage = {
      chat: payload.chat,
      content: payload.content,
      sender: {
        _id: this.user._id.toString(),
        name: this.user.name,
      },
      createdAt: new Date().toISOString(),
    };

    // Message For DB
    const messageForDB = {
      content: payload.content,
      chat: payload.chat as Types.ObjectId,
      sender: this.user._id,
    };

    // Message For DB
    await this.messageService.create(messageForDB).catch((error) => {
      console.error('Error creating message:', error.message);
    });

    this.server.emit(MESSAGE_EVENTS.received, {
      realTimeMessage,
    });

    this.server.to(memberSocketIds).emit(CHAT_EVENTS.alert, {
      chatId: payload?.chat,
    });
  }
}
