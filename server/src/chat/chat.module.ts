import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { ChatService1 } from './chat1.service';
import { ChatController } from './chat.controller';

@Module({
  controllers: [ChatController],
  imports: [DatabaseModule, UserModule],
  providers: [ChatService, ChatService1],
  exports: [],
})
export class ChatModule {}
