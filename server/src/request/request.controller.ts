import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { ApiOperation } from '@nestjs/swagger';
import { errorResponse, successResponse } from 'src/util/response';
import { AuthGuard } from 'src/auth/auth.guard';
import { emitEvents } from 'src/util/chat.events';
import { REQUEST_EVENTS } from 'src/constants/events';
import { createRequestDto, updateRequestDto } from './dto/request.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { Request } from 'express';

@UseGuards(AuthGuard)
@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a friend request' })
  async createFriendRequest(
    @Res() res,
    @Req() req,
    @Body(new ValidationPipe({ whitelist: true })) body: createRequestDto,
  ) {
    try {
      const receiverId = body.receiverId;
      const senderId = req.user._id;
      const request = await this.requestService.createFriendRequest(
        senderId,
        new Types.ObjectId(receiverId),
      );

      // Emit Events
      emitEvents(res, REQUEST_EVENTS.newRequest, [receiverId]);

      successResponse(res, {
        statusCode: 201,
        data: request,
        message: `Friend request send to`,
      });
    } catch (error) {
      errorResponse(res, {
        statusCode: error.status,
        message: error.message || 'Friend request failed',
      });
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update a friend request' })
  async updateFriendRequest(
    @Req() req: Request,
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body(new ValidationPipe({ whitelist: true })) body: updateRequestDto,
    @Res() res,
  ) {
    try {
      console.log('id', id);
      const updatedRequest = await this.requestService.updateStatus(
        req.user._id,
        id,
        body.status,
      );

      successResponse(res, {
        data: updatedRequest,
        message: 'Friend request updated successfully!',
      });
    } catch (error) {
      errorResponse(res, {
        statusCode: error.status,
        message: 'Friend request update failed',
      });
    }
  }

  @Get('notification')
  @ApiOperation({ summary: 'Get all my notifications' })
  async getNotifications(@Req() req, @Res() res) {
    try {
      const userId = req.user._id;
      const notifications = await this.requestService.getNotification(userId);

      console.log(notifications);
      successResponse(res, {
        data: { notifications },
        message: 'Notifications retrieved successfully!',
      });
    } catch (error) {
      errorResponse(res, { statusCode: error.status, message: error.message });
    }
  }
}
