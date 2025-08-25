/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type { Request, Response } from 'express';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { userName, password } = loginDto;
    const user_token = await this.authService.logIn(userName, password);

    req.user = user_token.user;

    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      user: user_token.user,
      token: user_token.token,
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  async register(@Body() register: CreateUserDto, @Res() res: Response) {
    try {
      const { name, userName, email, password } = register;
      const user = await this.authService.register(
        name,
        userName,
        email,
        password,
      );

      res.status(HttpStatus.CREATED).json({
        message: 'User registered successfully',
        user,
      });
    } catch (error: any) {
      res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: error.message || 'Registration failed',
      });
    }
  }

  @Get('verifytoken')
  @ApiOperation({ summary: 'Verify user token' })
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    try {
      let authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        authHeader = req.headers.cookie;
      }

      if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.toString().split(' ')[1];
      const user = await this.authService.verifyToken(token);

      req.user = user;

      return res.status(HttpStatus.OK).json({
        message: 'Token is valid',
        user,
      });
    } catch (error: any) {
      return res.status(error.status || HttpStatus.UNAUTHORIZED).json({
        message: error.message || 'Token verification failed',
      });
    }
  }
}
