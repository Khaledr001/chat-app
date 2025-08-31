import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { REQUEST_STATUS } from './common/database.constant';
import { User, USER_MODEL_NAME } from './user.schema';

@Schema({ timestamps: true })
export class Request extends Document {
  @Prop({
    type: String,
    enum: Object.keys(REQUEST_STATUS),
    default: REQUEST_STATUS.PENDING,
    required: true,
  })
  status: REQUEST_STATUS;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL_NAME, required: true })
  sender: string | Types.ObjectId | User;

  @Prop({ type: Types.ObjectId, ref: USER_MODEL_NAME, required: true })
  receiver: string | Types.ObjectId | User;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

RequestSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export const REQUEST_MODEL_NAME = Request.name;

export type RequestDocument = Request & Document;
