import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class ChatEventDto {
  @IsNotEmpty()
  content: string;

  //   @IsNotEmpty()
  @IsOptional()
  @IsMongoId()
  chat?: Types.ObjectId;

  //   @IsNotEmpty()
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  members?: Types.ObjectId[];
}
