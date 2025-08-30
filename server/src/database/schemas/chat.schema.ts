import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, USER_MODEL_NAME } from './user.schema';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: Boolean, default: false })
  groupChat: boolean;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL_NAME, required: true })
  creator: string | Types.ObjectId | User;

  @Prop({
    type: [{ type: Types.ObjectId, ref: USER_MODEL_NAME }],
    required: true,
  })
  members: string[] | Types.ObjectId[] | User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ name: 'text' }); // For text search on chat names

export const CHAT_MODEL_NAME = Chat.name;
export type ChatDocument = Chat & Document;
