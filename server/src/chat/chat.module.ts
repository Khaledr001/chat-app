import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { UserModule } from '../user/user.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway],
})
export class ChatModule {}
