import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { USER_MODEL_NAME, UserSchema } from './schemas/user.schema';
import { MESSAGE_MODEL_NAME, MessageSchema } from './schemas/message.schema';
import { REQUEST_MODEL_NAME, RequestSchema } from './schemas/request.schema';
import { CHAT_MODEL_NAME, ChatSchema } from './schemas/chat.schema';

const Model = [
  { name: USER_MODEL_NAME, schema: UserSchema },
  { name: MESSAGE_MODEL_NAME, schema: MessageSchema },
  { name: CHAT_MODEL_NAME, schema: ChatSchema },
  { name: REQUEST_MODEL_NAME, schema: RequestSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(Model)],
  exports: [MongooseModule],
})
export class MongooseModelModule {}
