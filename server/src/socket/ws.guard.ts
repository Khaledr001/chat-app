import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client: Socket = context.switchToWs().getClient();

    // Access the user data that was attached by the middleware
    const user = client.data.user;

    if (!user) {
      throw new WsException('Unauthorized access');
    }

    return true;
  }
}
