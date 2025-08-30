import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER_MODEL_NAME)
    private readonly userModel: Model<UserDocument>,
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
      throw new NotFoundException(`User ${userName || id} not found`);
    }

    return user as any as Omit<User, 'password'>;
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
