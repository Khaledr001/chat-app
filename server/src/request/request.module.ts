import { Module } from '@nestjs/common';
import { RequestController } from './request.controller';
import { RequestService } from './request.service';
import { ChatModule } from 'src/chat/chat.module';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [ChatModule],
  controllers: [RequestController],
  providers: [RequestService, ChatService],
  exports: [RequestService],
})
export class RequestModule {}
