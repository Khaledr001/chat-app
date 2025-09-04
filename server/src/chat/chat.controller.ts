import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { emitEvents } from 'src/util/chat.events';
import { CHAT_EVENTS } from 'src/constants/events';
import { errorResponse, successResponse } from 'src/util/response';
import { Types } from 'mongoose';
import { ApiOperation } from '@nestjs/swagger';
import {
  AddNewMembersDto,
  CreateGroupChatDto,
  CreatePrivateChatDto,
  LeaveMembersDto,
} from './dto/chat.dot';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@UseGuards(AuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('group')
  @ApiOperation({ summary: 'Create A New Group Chat' })
  async GroupChat(
    @Req() req,
    @Res() res,
    @Body() createGroupChatDto: CreateGroupChatDto,
  ) {
    try {
      const { name, members } = createGroupChatDto;
      const creator = req.user._id;
      const groupChat = await this.chatService.createGroupChat(
        name,
        members,
        creator,
      );

      emitEvents(
        req,
        CHAT_EVENTS.message,
        members as any as string[],
        `${creator} created a group chat: ${name}`,
      );

      successResponse(res, {
        data: { group: groupChat },
        message: 'Group Created Succesfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @Post('private')
  @ApiOperation({ summary: 'Create a private chat' })
  async PrivateChat(
    @Req() req,
    @Res() res,
    @Body() body: CreatePrivateChatDto,
  ) {
    try {
      const { members } = body;
      const creator = req.user._id;

      const privateChat = await this.chatService.createPrivateChat(
        members,
        creator,
      );

      emitEvents(
        req,
        CHAT_EVENTS.message,
        members as any as string[],
        `${creator} created a private chat`,
      );

      successResponse(res, {
        data: { private: privateChat },
        message: 'Private Chat Created Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get All Chat By Member Id' })
  async getAllChats(
    @Req() req,
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    try {
      const member = id;
      const allChats = await this.chatService.getAllChats(member);
      successResponse(res, {
        data: { chats: allChats },
        message: 'All Chats Retrieved Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @Get('private/:id')
  @ApiOperation({ summary: 'Get Private Chat By Member ID' })
  async getPrivateChat(
    @Req() req,
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    try {
      const allPrivateChats = await this.chatService.getPrivateChats(id);
      successResponse(res, {
        data: { private: allPrivateChats },
        message: 'All Private Chats Retrieved Successfully!',
      });
    } catch (error) {
      errorResponse(res, { statusCode: error.status, message: error.message });
    }
  }

  @Get('group/:id')
  @ApiOperation({ summary: 'Get All Group Chats By Member ID' })
  async getGroupChat(
    @Req() req,
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    try {
      const allGroupChats = await this.chatService.getGroupChats(id);

      successResponse(res, {
        data: { groups: allGroupChats },
        message: 'All Group Retrieved Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @Put('addmembers')
  @ApiOperation({ summary: 'Add Members to Group Chat' })
  async AddNewMembers(@Req() req, @Res() res, @Body() body: AddNewMembersDto) {
    try {
      const { chatId, members } = body;
      const assigner = req.user._id;
      const updatedChat = await this.chatService.addNewMember(
        chatId,
        members,
        assigner,
      );

      // Emit Events

      emitEvents(
        res,
        CHAT_EVENTS.alert,
        updatedChat.allUserName,
        `${assigner} added ${updatedChat.allUserName.join(', ')} to group chat`,
      );

      successResponse(res, {
        data: { group: updatedChat.updatedChat },
        message: 'Members Added Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @Put('removeMembers')
  @ApiOperation({ summary: 'Remove Members from Group Chat' })
  async leaveMembers(@Req() req, @Res() res, @Body() body: LeaveMembersDto) {
    try {
      const { chatId, member } = body;
      const remover = req.user._id;
      const { chat, allUserName } = await this.chatService.removeMembers(
        chatId,
        member,
        remover,
      );

      // Emit Events

      emitEvents(
        res,
        CHAT_EVENTS.alert,
        chat.members as string[],
        `${remover} removed ${allUserName} from group chat`,
      );

      successResponse(res, {
        data: { group: chat },
        message: 'Members Removed Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @Put('leave')
  @ApiOperation({ summary: 'Leave from Group Chat' })
  async leaveGroupChat(@Req() req, @Res() res, @Body() body) {
    try {
      const { chatId } = body;
      const member = req.user._id;
      const { chat, memberName } = await this.chatService.leaveGroupChat(
        chatId,
        member,
      );

      // Emit Events

      emitEvents(
        res,
        CHAT_EVENTS.alert,
        chat.members as string[],
        `${memberName} left the group chat`,
      );

      successResponse(res, {
        data: { group: chat },
        message: 'Left Group Chat Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @ApiOperation({ summary: 'Rename Group Chat' })
  @Put('/:id')
  async renameGroupChat(
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() body: { name: string },
  ) {
    try {
      if (!body?.name) {
        throw new NotAcceptableException('Name is required');
      }

      const updatedChat = await this.chatService.renameGroupChat(id, body.name);

      // emit events
      emitEvents(res, CHAT_EVENTS.refetch, updatedChat.members as string[]);

      successResponse(res, {
        data: { group: updatedChat },
        message: 'Group Chat Renamed Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }

  @ApiOperation({ summary: 'Delete Group Chat' })
  @Delete('/:id')
  async DeleteAGroup(
    @Req() req,
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    try {
      const deletedChat = await this.chatService.deleteAGroup(id, req.user._id);

      // emit events
      emitEvents(
        res,
        CHAT_EVENTS.alert,
        deletedChat.members as string[],
        `A group chat has been deleted`,
      );

      successResponse(res, {
        data: { group: deletedChat },
        message: 'Group Chat Deleted Successfully!',
      });
    } catch (error) {
      const status = typeof error.status === 'number' ? error.status : 500;
      errorResponse(res, { statusCode: status, message: error.message });
    }
  }
}
