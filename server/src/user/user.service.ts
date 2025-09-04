/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { compare } from 'bcrypt';
import {
  User,
  USER_MODEL_NAME,
  UserDocument,
} from 'src/database/schemas/user.schema';
import {
  CHAT_MODEL_NAME,
  ChatDocument,
} from 'src/database/schemas/chat.schema';
import { avatarUploadConfig } from 'src/config/avater-upload.config';
import {
  REQUEST_MODEL_NAME,
  RequestDocument,
} from 'src/database/schemas/request.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(CHAT_MODEL_NAME)
    private readonly chatModel: Model<ChatDocument>,
    @InjectModel(REQUEST_MODEL_NAME)
    private readonly requestModel: Model<RequestDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check for existing username
    const existingUsername = await this.userModel.findOne({
      userName: createUserDto.userName,
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = new this.userModel({
      ...createUserDto,
    });

    const newUser = await user.save();

    return newUser;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this.userModel.find().select('-password').lean().exec();

    return users as any as Omit<User, 'password'>[];
  }

  async findOne(
    id?: string | Types.ObjectId,
    userName?: string,
  ): Promise<Omit<User, 'password'>> {
    const query = userName ? { userName } : { _id: id };
    const user = await this.userModel
      .findOne(query)
      .select('-password')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(`User ${userName} not found`);
    }

    return user as any as Omit<User, 'password'>;
  }

  async findNotFriends(userId: Types.ObjectId, name?: string): Promise<any[]> {
    try {
      const myChats = await this.chatModel.find({
        groupChat: false,
        members: userId,
      });

      const friendIds = myChats
        .flatMap(({ members }: any) => members)
        .filter((id) => id !== userId);

      const allUsers = await this.userModel
        .find({
          _id: { $nin: friendIds },
          name: { $regex: name || '', $options: 'i' },
        })
        .lean();

      const notfriendIds = allUsers.map(({ _id }) => _id);

      const getRequestStatus = await this.requestModel
        .find({
          $or: [
            { sender: { $in: notfriendIds } },
            { receiver: { $in: notfriendIds } },
          ],
        })
        .lean();

      // Map requests to quickly find status per user
      const requestMap = new Map<string, string>();
      getRequestStatus.forEach((req: any) => {
        const otherUserId =
          req.sender.toString() === userId.toString()
            ? req.receiver.toString()
            : req.sender.toString();
        requestMap.set(otherUserId, req.status);
      });

      const users = allUsers.map(({ _id, name, userName, avatar }) => ({
        _id,
        name,
        userName,
        avatar: avatar?.url,
        requestStatus: requestMap.get(_id.toString()) || null,
      }));

      console.log(allUsers[0]);

      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userModel.findOne({
        email: updateUserDto.email,
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    return await user.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async checkCredentials(
    userName: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    // select all including password

    const user = await this.userModel
      .findOne({ userName })
      .select('+password')
      .lean();

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Exclude password before returning
    const { password: _, ...safeUser } = user;

    return safeUser as any as Omit<User, 'password'>;
  }
}
