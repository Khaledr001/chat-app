import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configaration } from './config';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/api.logger.interceptor';
import { DatabaseModule } from './database/database.module';
import { MongooseModelModule } from './database/mongoose.model.module';
import { MessageModule } from './message/message.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configaration,
      cache: true,
      expandVariables: true,
      isGlobal: true,
    }),

    // Import DatabaseModule
    DatabaseModule,
    MongooseModelModule,

    // Import other modules here
    UserModule,
    ChatModule,
    AuthModule,
    DatabaseModule,
    MessageModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
})
export class AppModule {}
