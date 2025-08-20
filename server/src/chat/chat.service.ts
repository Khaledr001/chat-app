import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async createMessage(
    senderId: number,
    receiverId: number,
    content: string,
  ): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      receiverId,
      content,
    });
    return await this.messageRepository.save(message);
  }

  async getConversation(
    user1Id: number,
    user2Id: number,
    limit: number = 50,
  ): Promise<Message[]> {
    return await this.messageRepository.find({
      where: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
      order: { timestamp: 'DESC' },
      take: limit,
      relations: ['sender', 'receiver'],
    });
  }

  async markMessagesAsRead(
    senderId: number,
    receiverId: number,
  ): Promise<void> {
    await this.messageRepository.update(
      {
        senderId,
        receiverId,
        isRead: false,
      },
      { isRead: true },
    );
  }
}
