import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MESSAGE_MODEL_NAME, MessageDocument } from 'src/database/schemas/message.schema';
import { Model } from 'mongoose';

@Injectable()
export class MessageService {
  constructor(@Inject(MESSAGE_MODEL_NAME) private messageModel: Model<MessageDocument>) {}

  create(createMessageDto: CreateMessageDto) {
    try {
      const newMessage = new this.messageModel(createMessageDto);
      return newMessage.save();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  findAll() {
    return this.messageModel.find().exec();
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
