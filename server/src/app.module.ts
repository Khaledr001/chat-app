import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configaration } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/api.logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configaration,
      cache: true,
      expandVariables: true,
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('PSQL_CONFIG.host'),
        port: configService.get<number>('PSQL_CONFIG.port'),
        username: configService.get<string>('PSQL_CONFIG.username'),
        password: configService.get<string>('PSQL_CONFIG.password'),
        database: configService.get<string>('PSQL_CONFIG.database'),

        entities: [__dirname + '/**/*.entity{.ts,.js}'],

        synchronize: true,
      }),
    }),

    // Import other modules here
    UserModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
})
export class AppModule {}
