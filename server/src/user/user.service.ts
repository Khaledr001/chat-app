import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Check for existing username
    const existingUsername = await this.userRepository.findOne({
      where: { userName: createUserDto.userName },
    });

    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const newUser = await this.userRepository.save(user);

    const { password: _, ...safeUser } = newUser;

    return safeUser;
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const allUser = await this.userRepository.find({
      select: ['id', 'name', 'userName', 'email', 'createdAt', 'updatedAt'],
    });

    return allUser;
  }

  async findOne(
    id?: number,
    userName?: string,
  ): Promise<Omit<User, 'password'>> {
    const whereClause = userName ? { userName } : { id };
    console.log(whereClause);
    const user = await this.userRepository.findOne({
      where: whereClause,
      select: ['id', 'name', 'userName', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    Object.assign(user, updateUserDto);
    user.updatedAt = new Date();

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async checkCredentials(
    userName: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    let user = await this.userRepository.findOne({
      where: { userName },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...safeUser } = user;

    return safeUser;
  }
}
