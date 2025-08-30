import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/database/schemas/user.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async logIn(
    userName: string,
    password: string,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userService.checkCredentials(userName, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { user: user, sub: user._id };
    const token = await this.jwtService.signAsync(payload);

    return { user, token };
  }

  async register(user: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const newUser = await this.userService.create({
        avatar: user?.avatar,
        name: user.name,
        userName: user.userName,
        email: user.email,
        password: user.password,
      });

      return newUser;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async verifyToken(token: string): Promise<Omit<User, 'password'>> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET.secret'),
      });
      const user = await this.userService.findOne(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
