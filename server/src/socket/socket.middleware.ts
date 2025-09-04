import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const createSocketMiddleware = (
  authService: AuthService,
): SocketMiddleware => {
  return (socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth.token || socket.handshake.headers.cookie;

      if (!token) {
        throw new WsException('Unauthorized access - No token provided');
      }

      // Remove 'Bearer ' if present
      let tokenString = token.replace('Bearer ', '');

      // If token has = then split
      tokenString = tokenString.replace('jwt=', '');

      // Verify the token
      authService
        .verifyToken(tokenString)
        .then((user) => {
          socket.data.user = user;
          return next();
        })
        .catch((error) => {
          next(
            new HttpException(
              'Unauthorized access - Invalid token',
              HttpStatus.UNAUTHORIZED,
            ),
          );
        });
    } catch (error) {
      next(
        new HttpException(
          'Unauthorized access - Invalid token',
          HttpStatus.UNAUTHORIZED,
        ),
      );
    }
  };
};
