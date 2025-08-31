import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @ApiProperty({
    example: '68b32a5de4a4fd491b5edb8a',
    description: 'Chat ObjectId',
  })
  @IsNotEmpty()
  @IsString()
  chat: Types.ObjectId;

  @ApiProperty({
    example: 'John 68b2bd4398e1e402848c179e',
    description: 'Sender ObjectId',
  })
  @IsNotEmpty()
  @IsString()
  sender: Types.ObjectId;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Message content',
  })
  @IsString()
  content?: string;

  @ApiProperty({
    example: ['image.png', 'file.pdf'],
    description: 'List of attachment file names',
  })
  attachments?: any[];
}
