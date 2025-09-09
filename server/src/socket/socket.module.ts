import { Global, Module } from '@nestjs/common';
import { MySocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { MessageModule } from 'src/message/message.module';
import { AuthModule } from 'src/auth/auth.module';

@Global()
@Module({
  imports: [MessageModule, AuthModule],
  providers: [MySocketGateway, SocketService],
  exports: [MySocketGateway],
})
export class SocketModule {}
