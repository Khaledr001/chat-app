import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import {
  MESSAGE_MODEL_NAME,
  MessageDocument,
} from 'src/database/schemas/message.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  CHAT_MODEL_NAME,
  ChatDocument,
} from 'src/database/schemas/chat.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(MESSAGE_MODEL_NAME)
    private messageModel: Model<MessageDocument>,
    @InjectModel(CHAT_MODEL_NAME) private chatModel: Model<ChatDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    try {
      const chat = await this.chatModel.findById(createMessageDto.chat);
      if (!chat) throw new NotFoundException('Chat not found!');

      const newMessage = new this.messageModel(createMessageDto);
      const message = await newMessage.save();
      return { message, chat };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async findChatMessages(
    chatId: Types.ObjectId,
    page?: number,
    limit?: number,
  ) {
    try {
      if (!page || page < 1) page = 1;
      if (!limit || limit < 1) limit = 20;

      const skip = (page - 1) * limit;
      const [messages, totalDocuments] = await Promise.all([
        this.messageModel
          .find({ chat: chatId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('sender', 'name avatar')
          .lean(),
        this.messageModel.countDocuments({ chat: chatId }),
      ]);

      const totalPages = Math.ceil(totalDocuments / limit) || 0;

      return { messages, totalPages };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  findOne(id: number) {
    return this.messageModel.findById(id).exec();
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.messageModel.findByIdAndUpdate(id, updateMessageDto).exec();
  }

  remove(id: number) {
    return this.messageModel.findByIdAndDelete(id).exec();
  }
}
