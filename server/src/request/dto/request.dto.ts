import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { REQUEST_STATUS } from 'src/database/schemas/common/database.constant';

export class createRequestDto {
  @ApiProperty({
    example: '68b32a5de4a4fd491b5edb8a',
    description: 'Receiver ObjectId',
  })
  @IsNotEmpty()
  @IsMongoId()
  receiverId: Types.ObjectId;
}

export class updateRequestDto {
  @ApiProperty({
    example: REQUEST_STATUS.ACCEPTED,
    description: 'Request ObjectId',
  })
  @IsNotEmpty()
  @IsEnum(REQUEST_STATUS)
  status: REQUEST_STATUS;
}
