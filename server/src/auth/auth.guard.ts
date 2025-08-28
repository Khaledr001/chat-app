import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const reqest = context.switchToHttp().getRequest();

    let token = reqest.headers.authorization || reqest.headers.Authorization;
    if (!token || token == undefined) {
      token = reqest.headers.cookie;
      if (typeof token === 'string' && token.includes('jwt=')) {
        token = token.split('jwt=')[1].trim();
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    } else token = token.toString().split('Bearer')[1].trim();

    if (!token) throw new UnauthorizedException('No token provided');

    const isVerify = await this.authService.verifyToken(token);
    if (!isVerify) return false;
    return true;
  }
}
