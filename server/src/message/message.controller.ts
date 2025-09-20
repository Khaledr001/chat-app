import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { attachmentUploadConfig } from 'src/config/attachment-upload.config';
import { MESSAGE_EVENTS } from 'src/constants/events';
import { MySocketGateway } from 'src/socket/socket.gateway';
import { duplicateAttachmentChecker } from 'src/util/duplicate-file-checker';
import { errorResponse, successResponse } from 'src/util/response';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';

@UseGuards(AuthGuard)
@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly socketGateway: MySocketGateway,
  ) {}

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
      const realTimeMessage = {
        ...createMessageDto,
        sender: {
          _id: req.user._id,
          name: req.user.name,
          avatar: {
            url: req.user.avatar.url,
          },
        },
        createdAt: new Date().toISOString(),
      };

      // Emit Event
      this.socketGateway.emitEvents(
        MESSAGE_EVENTS.received,
        chat.members as string[],
        { realTimeMessage },
      );
 
      // New Message Event alert
      this.socketGateway.emitEvents(
        MESSAGE_EVENTS.newMessageAlert,
        chat.members as string[],
        {
          chatId: createMessageDto.chat,
        },
      );

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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
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
