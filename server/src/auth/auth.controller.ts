import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import type { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { avatarUploadConfig } from 'src/config/avater-upload.config';
import { duplicateImageChecker } from 'src/util/duplicate-file-checker';
import { ATTACHMENT_TYPE } from 'src/database/schemas/common/database.constant';

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

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    };
    res.cookie('jwt', user_token.token, cookieOptions);

    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      user: user_token.user,
      token: user_token.token,
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @UseInterceptors(FileInterceptor('avatar', avatarUploadConfig))
  async register(
    @UploadedFile() file: Express.Multer.File,
    @Body() register: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let avatar: any;
    if (file) {
      const finalFile = duplicateImageChecker(file);
      avatar = {
        url: finalFile.path, 
        type: ATTACHMENT_TYPE.IMAGE,
      };
    }

    try {
      const { name, userName, email, password } = register;
      const userObj: CreateUserDto = {
        name,
        userName,
        email,
        password,
        avatar,
      };
      const user = await this.authService.register(userObj);

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
      let token = req.headers.authorization || req.headers.Authorization;
      if (!token || token == undefined) {
        token = req.headers.cookie;
        if (typeof token === 'string' && token.includes('jwt=')) {
          token = token.split('jwt=')[1].trim();
        }
      } else token = token.toString().split('Bearer')[1].trim();

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }
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
