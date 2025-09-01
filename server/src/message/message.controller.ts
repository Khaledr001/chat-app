import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Res,
  UploadedFiles,
  Req,
  BadRequestException,
  UseGuards,
  ValidationPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { attachmentUploadConfig } from 'src/config/attachment-upload.config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { errorResponse, successResponse } from 'src/util/response';
import type { Request, Response } from 'express';
import { duplicateAttachmentChecker } from 'src/util/duplicate-file-checker';
import { AuthGuard } from 'src/auth/auth.guard';
import { emitEvents } from 'src/util/chat.events';
import { ATTACHMENT_EVENTS, MESSAGE_EVENTS } from 'src/constants/events';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiOperation } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment', 5, attachmentUploadConfig))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
    @Res() res: Response,
    @Body()
    createMessageDto: CreateMessageDto,
  ) {
    try {
      const attachments: any[] = [];
      if (files && files.length > 0) {
        files.map((file) => {
          const finalFile = duplicateAttachmentChecker(file);
          attachments.push({
            url: finalFile.path,
            type: file.mimetype.split('/')[0],
          });
        });
      }

      createMessageDto.attachments = attachments;
      createMessageDto.sender = req.user._id;

      const { message, chat } =
        await this.messageService.create(createMessageDto);

      // Send message in realtime
      const messageForRealTime = {
        ...createMessageDto,
        sender: {
          _id: req.user._id,
          name: req.user.name,
        },
      };

      // Emit Event
      emitEvents(
        req,
        ATTACHMENT_EVENTS.NEW_ATTACHMENT,
        chat.members as string[],
        {
          message: messageForRealTime,
          chatId: createMessageDto.chat,
        },
      );

      // New Message Event alart
      emitEvents(req, MESSAGE_EVENTS.NEW_MESSAGE, chat.members as string[], {
        chatId: createMessageDto.chat,
      });

      successResponse(res, { statusCode: 201, data: message });
    } catch (error) {
      errorResponse(res, { message: error.message });
    }
  }

  @ApiOperation({ summary: 'Get all message of a chet by ChatId' })
  @Get(':id')
  async findChatMessages(
    @Req() req,
    @Res() res,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    try {
      const { messages, totalPages } =
        await this.messageService.findChatMessages(id, page, limit);

      successResponse(res, { statusCode: 200, data: { messages, totalPages } });
    } catch (error) {
      errorResponse(res, { statusCode: error.status, message: error.message });
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
