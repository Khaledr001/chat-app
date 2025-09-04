import { BadRequestException, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { timeStamp } from 'console';
import { Model, Types } from 'mongoose';
import { ChatService } from 'src/chat/chat.service';
import { REQUEST_STATUS } from 'src/database/schemas/common/database.constant';
import {
  Request,
  REQUEST_MODEL_NAME,
  RequestDocument,
} from 'src/database/schemas/request.schema';
import { User } from 'src/database/schemas/user.schema';

export class RequestService {
  constructor(
    @InjectModel(REQUEST_MODEL_NAME)
    private requestModel: Model<RequestDocument>,
    private chatService: ChatService,
  ) {}

  async createFriendRequest(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
  ): Promise<Request> {
    try {
      const oldRequest = await this.requestModel.findOne({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      });

      if (oldRequest)
        throw new BadRequestException(`Request already ${oldRequest.status}`);

      const newRequestObj = new this.requestModel({
        sender: senderId,
        receiver: receiverId,
      });

      const newRequest = await newRequestObj.save();

      return newRequest;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  // Update Status of a request
  async updateStatus(
    userId: Types.ObjectId,
    requestId: Types.ObjectId,
    status: REQUEST_STATUS,
  ) {
    try {
      console.log(requestId, status);
      const updatedRequest = await this.requestModel.findByIdAndUpdate(
        requestId,
        { status },
        { new: true },
      );

      if (!updatedRequest)
        throw new BadRequestException('Request not found or invalid ID');

      if (status == REQUEST_STATUS.ACCEPTED) {
        const [chat] = await Promise.all([
          this.chatService.createPrivateChat(
            [userId, updatedRequest.sender as Types.ObjectId],
            userId,
          ),
          this.requestModel.deleteOne({ _id: updatedRequest._id }),
        ]);
        return chat;
      } else if (status === REQUEST_STATUS.REJECTED) {
        return await this.requestModel.deleteOne({ _id: updatedRequest._id });
      }
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  // Get my notification
  async getNotification(userId: Types.ObjectId) {
    try {
      const allNotifications = await this.requestModel
        .find({ receiver: userId })
        .populate<{ sender: User }>('sender', 'name avatar')
        .lean();

      const notifications = allNotifications.map(({ _id, sender, status }) => ({
        _id,
        status,
        sender: {
          _id: sender._id,
          name: sender.name,
          avatar: sender.avatar?.url,
        },
      }));

      return notifications;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
