import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { ChatService1 } from './chat1.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  imports: [DatabaseModule, UserModule],
  providers: [ChatGateway, ChatService, ChatService1],
  exports: [ChatGateway],
})
export class ChatModule {}
