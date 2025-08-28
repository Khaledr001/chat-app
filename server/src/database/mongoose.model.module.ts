import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/chat/entities/message.entity';
import { USER_MODEL_NAME, UserSchema } from './schemas/user.schema';

const Model = [
  { name: USER_MODEL_NAME, schema: UserSchema },
  { name: 'Message', schema: MessageSchema },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(Model)],
  exports: [MongooseModule],
})
export class MongooseModelModule {}
