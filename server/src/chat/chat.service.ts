import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
  ) {}

  async createMessage(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    content: string,
  ): Promise<Message> {
    const message = new this.messageModel({
      sender: senderId,
      receiver: receiverId,
      content,
    });
    return await message.save();
  }

  async getConversation(
    user1Id: Types.ObjectId,
    user2Id: Types.ObjectId,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.messageModel
      .find({
        $or: [
          { sender: user1Id, receiver: user2Id },
          { sender: user2Id, receiver: user1Id },
        ],
      })
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('sender')
      .populate('receiver')
      .exec();
  }

  async markMessagesAsRead(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
  ): Promise<void> {
    await this.messageModel.updateMany(
      {
        sender: senderId,
        receiver: receiverId,
        isRead: false,
      },
      { $set: { isRead: true } },
    );
  }
}
