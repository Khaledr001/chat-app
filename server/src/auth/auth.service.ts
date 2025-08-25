import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async logIn(
    userName: string,
    password: string,
  ): Promise<{ user: Omit<User, 'password'>; token: string }> {
    const user = await this.userService.checkCredentials(userName, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const payload = { user: user, sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    console.log('Generated JWT token:', token); // Debugging line

    return { user, token };
  }

  async register(
    name: string,
    userName: string,
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.userService.create({
        name,
        userName,
        email,
        password,
      });

      return user;
    } catch (error) {
      throw new Error('Registration failed', error.message);
    }
  }

  async verifyToken(token: string): Promise<Omit<User, 'password'>> {
    try {
      const decoded = await this.jwtService.verify(token);
      const user = await this.userService.findOne(decoded.sub);
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw new Error('Token verification failed', error.message);
    }
  }
}
