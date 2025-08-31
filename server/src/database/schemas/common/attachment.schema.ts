import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ATTACHMENT_TYPE } from './database.constant';

@Schema()
export class Attachment extends Document {
  @Prop({ type: String, enum: ATTACHMENT_TYPE, required: true })
  type: ATTACHMENT_TYPE;

  @Prop({ type: String, required: true })
  url: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
