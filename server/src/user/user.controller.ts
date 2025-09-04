import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Types } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { errorResponse, successResponse } from 'src/util/response';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: User,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userService.findAll();
    return users;
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user found',
    type: User,
  })
  async findMe(@Req() req, @Res() res) {
    try {
      const userId = req.user._id;
      await this.userService.findOne(userId);

      successResponse(res, {
        data: { user: userId },
        message: 'User Retrieved Successfully!',
      });
    } catch (error) {
      errorResponse(res, { statusCode: error.status, message: error.message });
    }
  }

  @Get('notfriends')
  @ApiOperation({
    summary: 'Get all users that are not friends with the current user',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users that are not friends',
    type: [User],
  })
  async findNotFriends(@Req() req, @Res() res, @Query('name') name?: string) {
    try {
      const userId = req.user._id;
      const users = await this.userService.findNotFriends(userId, name);
      successResponse(res, {
        data: { users },
        message: 'Not friends retrieved successfully!',
      });
    } catch (error) {
      errorResponse(res, { statusCode: error.status, message: error.message });
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (MongoDB ObjectId)',
  })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const userId = new Types.ObjectId(id);
    const user = await this.userService.findOne(userId.toString());
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (MongoDB ObjectId)',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully updated',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ): Promise<Omit<User, 'password'>> {
    const userId = new Types.ObjectId(id);
    const user = await this.userService.update(
      userId.toString(),
      updateUserDto,
    );
    return user;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID (MongoDB ObjectId)',
  })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    const userId = new Types.ObjectId(id);
    return await this.userService.remove(userId.toString());
  }
}
