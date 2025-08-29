import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, USER_MODEL_NAME } from './user.schema';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Boolean, default: false })
  groupChat: boolean;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL_NAME })
  creator: string | Types.ObjectId | User;

  @Prop({ type: [{ type: Types.ObjectId, ref: USER_MODEL_NAME }], default: [] })
  members: string[] | Types.ObjectId[] | User[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ name: 'text' }); // For text search on chat names

export const CHAT_MODEL_NAME = Chat.name;
export type ChatDocument = Chat & Document;

