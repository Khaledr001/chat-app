import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ required: true, type: String })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  sender: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  receiver: User;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
