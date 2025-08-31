import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  Message,
  MESSAGE_MODEL_NAME,
  MessageDocument,
} from 'src/database/schemas/message.schema';

@Injectable()
export class ChatService1 {
  constructor(
    @InjectModel(MESSAGE_MODEL_NAME)
    private messageModel: Model<MessageDocument>,
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
