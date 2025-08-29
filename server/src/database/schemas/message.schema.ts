import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Chat, CHAT_MODEL_NAME } from './chat.schema';
import { User, USER_MODEL_NAME } from './user.schema';
import { Attachment, AttachmentSchema } from './common/attachment.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: CHAT_MODEL_NAME, required: true })
  chat: string | Types.ObjectId | Chat;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL_NAME, required: true })
  sender: string | Types.ObjectId | User;

  @Prop({ type: String })
  content: string;

  @Prop({ type: [AttachmentSchema] })
  attachments: Attachment[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);

MessageSchema.index({ chat: 1, createdAt: -1 });

export const MESSAGE_MODEL_NAME = Message.name;

export type MessageDocument = Message & Document;
