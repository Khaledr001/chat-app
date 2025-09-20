import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { Model, Types } from 'mongoose';
import { startSession } from 'mongoose';

import {
  Chat,
  CHAT_MODEL_NAME,
  ChatDocument,
} from 'src/database/schemas/chat.schema';
import {
  MESSAGE_MODEL_NAME,
  MessageDocument,
} from 'src/database/schemas/message.schema';
import {
  USER_MODEL_NAME,
  UserDocument,
} from 'src/database/schemas/user.schema';
import { getOtherMember } from 'src/util/feature';

@Injectable()
export class ChatService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(USER_MODEL_NAME)
    private userModel: Model<UserDocument>,
    @InjectModel(CHAT_MODEL_NAME)
    private chatModel: Model<ChatDocument>,
    @InjectModel(MESSAGE_MODEL_NAME)
    private messageModel: Model<MessageDocument>,
  ) {}

  async createGroupChat(
    name: string,
    members: Types.ObjectId[],
    creator: Types.ObjectId,
  ): Promise<Chat> {
    try {
      const groupChat = new this.chatModel({
        name,
        groupChat: true,
        members,
        creator,
      });
      const newGroup = await groupChat.save();
      return newGroup;
    } catch (error) {
      throw new HttpException(
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
      );
    }
  }

  async createPrivateChat(members: Types.ObjectId[], creator: Types.ObjectId) {
    try {
      if (!members || members.length !== 2)
        throw new BadRequestException('Exactly 2 members needed');

      const [users, isChat] = await Promise.all([
        this.userModel.find({ _id: { $in: members } }),
        this.chatModel.findOne({
          members: { $all: members },
          $expr: { $eq: [{ $size: '$members' }, 2] },
        }),
      ]);
      if (!users) throw new NotFoundException('Members not found!');
      if (isChat) throw new BadRequestException('Both are already friends!');

      const privateChat = new this.chatModel({
        members,
        creator,
      });
      return await privateChat.save();
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getChatDetailsByChatId(chatId: Types.ObjectId, isPopulate = false) {
    try {
      let query = this.chatModel.findById(chatId);

      if (isPopulate) {
        query = query.populate({
          path: 'members',
          select: 'name userName avatar',
        });
      }

      const chat = await query.exec();

      if (!chat) {
        throw new NotFoundException('Chat Not Found!');
      }

      return chat;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getAllChats(member: Types.ObjectId) {
    try {
      const allChats = await this.chatModel
        .find({
          members: { $in: [member] },
        })
        .populate({
          path: 'members',
          select: 'name avatar.url',
        })
        .select('name members groupChat')
        .lean();

      const transformChats = allChats.map(
        ({ _id, name, members, groupChat }) => {
          const otherMember = getOtherMember(members, member);

          return {
            _id,
            groupChat,
            name: groupChat ? name : otherMember?.name,
            avatars: groupChat
              ? (members as { avatar: { url: string } }[])
                  .slice(0, 3)
                  .map(({ avatar }) => avatar.url ?? '')
              : [otherMember?.avatar?.url ?? ''],

            members: (members as { _id: Types.ObjectId }[]).reduce(
              (prev: Types.ObjectId[], curr: { _id: Types.ObjectId }) => {
                if (curr._id.toString() !== member.toString()) {
                  prev.push(curr._id);
                }
                return prev;
              },
              [] as Types.ObjectId[],
            ),
          };
        },
      );

      return transformChats;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getPrivateChats(member: Types.ObjectId) {
    try {
      const allPrivateChats: Chat[] = await this.chatModel
        .find({
          groupChat: false,
          members: { $in: [member] },
        })
        .populate({
          path: 'members',
          select: 'name avatar.url',
        })
        .lean();

      const transformChats = allPrivateChats.map(
        ({ _id, members, groupChat }) => {
          const otherMember = getOtherMember(members, member);

          return {
            _id,
            groupChat,
            name: otherMember?.name,
            avatars: [otherMember?.avatar?.url ?? ''],
            members: (members as { _id: Types.ObjectId }[]).reduce(
              (prev: Types.ObjectId[], curr: { _id: Types.ObjectId }) => {
                if (curr._id.toString() !== member.toString()) {
                  prev.push(curr._id);
                }
                return prev;
              },
              [] as Types.ObjectId[],
            ),
          };
        },
      );

      return transformChats;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async getGroupChats(member: Types.ObjectId) {
    try {
      const allGroupChats: Chat[] = await this.chatModel
        .find({
          groupChat: true,
          members: { $in: [member] },
        })
        .populate({
          path: 'members',
          select: 'avatar.url',
        })
        .select('name creator members groupChat')
        .lean();

      const transformeGroups = allGroupChats.map(
        ({ _id, name, members, groupChat, creator }) => {
          return {
            _id,
            name,
            groupChat,
            creator,
            avatars: (members as { avatar: { url: string } }[])
              .slice(0, 3)
              .map(({ avatar }) => avatar.url ?? ''),
            members: (members as { _id: Types.ObjectId }[]).reduce(
              (prev: Types.ObjectId[], curr: { _id: Types.ObjectId }) => {
                if (curr._id.toString() !== member.toString()) {
                  prev.push(curr._id);
                }
                return prev;
              },
              [] as Types.ObjectId[],
            ),
          };
        },
      );

      return transformeGroups;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async addNewMember(
    chatId: Types.ObjectId,
    membersId: Types.ObjectId[],
    assigner: Types.ObjectId,
  ) {
    try {
      const chat = await this.chatModel.findById(chatId);
      if (!chat)
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

      const isGroupChat = chat.groupChat;
      if (!isGroupChat)
        throw new HttpException(
          'Only group chats can have members added',
          HttpStatus.BAD_REQUEST,
        );

      if (assigner.toString() !== (chat.creator as Types.ObjectId).toString())
        throw new HttpException(
          'Only the group admin can add members',
          HttpStatus.FORBIDDEN,
        );

      // check members are valid user

      const validMembers = await Promise.all(
        membersId.map((id) =>
          this.userModel.findById(id).select('name').lean(),
        ),
      );
      //filter null value
      const filteredMembers = validMembers.filter((member) => member !== null);

      // Unique members
      const uniqueMembers = filteredMembers.filter(
        (member: any) => !chat.members.includes(member?._id),
      );

      chat.members.push((uniqueMembers as any).map(({ _id }) => _id));

      await chat.save();

      const allUserName = (uniqueMembers as any).map(({ name }) => name);

      return { updatedChat: chat, allUserName };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async removeMembers(
    chatId: Types.ObjectId,
    memberId: Types.ObjectId,
    remover: Types.ObjectId,
  ) {
    try {
      const [chat, removableUser] = await Promise.all([
        await this.chatModel.findById(chatId),
        await this.userModel.findById(memberId).select('name').lean(),
      ]);
      if (!chat)
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

      if (!removableUser)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      const isGroupChat = chat.groupChat;
      if (!isGroupChat)
        throw new HttpException(
          'Only group chats can have members removed',
          HttpStatus.BAD_REQUEST,
        );

      if (
        remover.toString() !== (chat.creator as Types.ObjectId).toString() &&
        chat.groupChat
      )
        throw new HttpException(
          'Only the group admin can remove members',
          HttpStatus.FORBIDDEN,
        );

      if (chat.members.length <= 3)
        throw new HttpException(
          'Cannot remove members from a group with less than or equal to 3 members',
          HttpStatus.BAD_REQUEST,
        );

      const finalMembers = chat.members.filter(
        (member: any) => member.toString() !== memberId.toString(),
      ) as Types.ObjectId[];

      chat.members = finalMembers;
      await chat.save();

      const allUserName = removableUser.name;

      return { chat, allUserName };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  async leaveGroupChat(chatId: Types.ObjectId, memberId: Types.ObjectId) {
    try {
      const [chat, member] = await Promise.all([
        this.chatModel.findById(chatId),
        this.userModel.findById(memberId).select('name').lean(),
      ]);
      if (!chat)
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

      const isGroupChat = chat.groupChat;
      if (!isGroupChat)
        throw new HttpException(
          'Only group chats can have members removed',
          HttpStatus.BAD_REQUEST,
        );

      if (!chat.members.some((m) => (m as Types.ObjectId).equals(memberId))) {
        throw new HttpException(
          'User is not a member of this chat',
          HttpStatus.BAD_REQUEST,
        );
      }

      const remainingMember = chat.members.filter(
        (member: Types.ObjectId) => member.toString() !== memberId.toString(),
      ) as Types.ObjectId[];

      // if (remainingMember.length < 3)
      //   throw new HttpException(
      //     'Cannot leave group chat with less than 3 members',
      //     HttpStatus.BAD_REQUEST,
      //   );

      if ((chat.creator as Types.ObjectId).toString() === memberId.toString()) {
        const randomIndex = Math.floor(Math.random() * remainingMember.length);
        chat.creator = remainingMember[randomIndex];
      }

      chat.members = remainingMember;
      await chat.save();

      return { chat, memberName: member?.name };
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  // Rename Group Chat
  async renameGroupChat(chatId: Types.ObjectId, name: string) {
    try {
      const chat = await this.chatModel.findById(chatId);
      if (!chat)
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

      const isGroupChat = chat.groupChat;
      if (!isGroupChat)
        throw new HttpException(
          'Only group chats can be renamed',
          HttpStatus.BAD_REQUEST,
        );

      chat.name = name;
      await chat.save();
      return chat;
    } catch (error) {
      throw new HttpException(error.message, error.status || 500);
    }
  }

  // Delete A Group Chat
  async deleteAGroup(chatId: Types.ObjectId, remover: Types.ObjectId) {
    // const session = await this.connection.startSession();
    // session.startTransaction();
    try {
      console.count('deleting');

      const [chat, messagesWithAttachments] = await Promise.all([
        this.chatModel.findById(chatId).lean(),
        this.messageModel.find({
          chat: chatId,
          attachments: { $exists: true, $ne: [] },
        }),
      ]);
      if (!chat)
        throw new HttpException('Chat not found', HttpStatus.NOT_FOUND);

      if (!chat.groupChat)
        throw new HttpException(
          'Only group chats can be deleted',
          HttpStatus.BAD_REQUEST,
        );

      if ((chat.creator as Types.ObjectId).toString() !== remover.toString()) {
        throw new HttpException(
          'Only the group creator can delete this chat',
          HttpStatus.FORBIDDEN,
        );
      }

      // Delete chat and messages
      await Promise.all([
        this.chatModel.deleteOne({ _id: chatId }),
        this.messageModel.deleteMany({ chat: chatId }),
      ]);

      // Get all the attachment url from message model;
      const attachmentsUrl: string[] = [];
      messagesWithAttachments.forEach(({ attachments }) => {
        attachments.forEach(({ url }) => attachmentsUrl.push(url));
      });

      // Delete all attachment from 'public/attachments'

      // await session.commitTransaction();

      return chat;
    } catch (error) {
      // await session.abortTransaction();
      throw new HttpException(error.message, error.status || 500);
    }
  }
}
