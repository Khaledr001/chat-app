import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateGroupChatDto {
  @ApiProperty({
    example: 'New Group',
    description: 'The name of the group chat',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: [
      '68b2bd4398e1e402848c179e',
      '68b2bdbed287a2ee6947c0ed',
      '68b2bea152867fb071eaf5bf',
    ],
    description: 'The members of the chat',
  })
  @IsNotEmpty()
  members: Types.ObjectId[];
}

export class CreatePrivateChatDto {
  @ApiProperty({
    example: ['68b2bd4398e1e402848c179e', '68b2bdbed287a2ee6947c0ed'],
    description: 'The members of the private chat',
  })
  @IsNotEmpty()
  members: Types.ObjectId[];
}

export class AddNewMembersDto {
  @ApiProperty({
    example: '68b2bd4398e1e402848c179e',
    description: 'The ID of the group chat',
  })
  @IsNotEmpty()
  chatId: Types.ObjectId;

  @ApiProperty({
    example: ['68b2bd4398e1e402848c179e', '68b2bdbed287a2ee6947c0ed'],
    description: 'The members to add to the group chat',
  })
  @IsNotEmpty()
  members: Types.ObjectId[];
}

export class LeaveMembersDto {
  @ApiProperty({
    example: '68b2bd4398e1e402848c179e',
    description: 'The ID of the group chat',
  })
  @IsNotEmpty()
  chatId: Types.ObjectId;

  @ApiProperty({
    example: '68b2bd4398e1e402848c179e',
    description: 'The members to leave from the group chat',
  })
  @IsNotEmpty()
  member: Types.ObjectId;
}