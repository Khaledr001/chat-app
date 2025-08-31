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
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { attachmentUploadConfig } from 'src/config/attachment-upload.config';
import { FilesInterceptor } from '@nestjs/platform-express';
import { errorResponse } from 'src/util/response';
import type { Request, Response } from 'express';
import { ATTACHMENT_TYPE } from 'src/database/schemas/common/database.constant';
import {
  duplicateAttachmentChecker,
  duplicateImageChecker,
} from 'src/util/duplicate-file-checker';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('attachment', 5, attachmentUploadConfig))
  async create(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
    @Res() res: Response,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    try {
      const file = req.file;
      let avatar: any[] = [];
      if (files && files.length > 0) {
        files.map((file) => {
          const finalFile = duplicateAttachmentChecker(file);
          avatar.push({
            url: finalFile.path,
            type: file.mimetype.split('/')[0],
          });
        });
      }

      return await this.messageService.create(createMessageDto);
    } catch (error) {
      errorResponse(res, { message: error.message });
    }
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
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
