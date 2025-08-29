import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attachment extends Document {
  @Prop({ required: false })
  url: string;

  @Prop({ required: false })
  publicId: string;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
