import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) // This will automatically handle createdAt and updatedAt
export class User extends Document {
  @Prop({ required: true, minLength: 3, maxlength: 100 })
  name: string;

  @Prop({ required: true, unique: true, minLength: 3, maxlength: 50 })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;
}
export const UserSchema = SchemaFactory.createForClass(User);

// Add index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ userName: 1 });

export const USER_MODEL_NAME = User.name;

export type UserDocument = User & Document;
