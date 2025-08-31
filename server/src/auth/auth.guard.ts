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
    const request = context.switchToHttp().getRequest();

    let token = request.headers.authorization || request.headers.Authorization;
    if (!token || token == undefined) {
      token = request.cookies['jwt'];
    } else token = token.toString().split('Bearer')[1].trim();

    if (!token) throw new UnauthorizedException('No token provided');

    const isVerify = await this.authService.verifyToken(token);
    if (!isVerify) return false;

    request.user = isVerify;

    return true;
  }
}
