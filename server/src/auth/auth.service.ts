import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async logIn(userName: string, password: string): Promise<string> {
    const user = await this.userService.checkCredentials(userName, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { user: user, sub: user.id };
    const token = this.jwtService.signAsync(payload);
    console.log('Generated JWT token:', token); // Debugging line

    return token;
  }
}
