import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  /**
   * Get the configuration service to access environment variables
   */
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  /**
   * Global prefix for API routes
   */
  app.setGlobalPrefix('api');

  if (nodeEnv === 'development') {
    /**
     * Open API documentation setup
     */
    const apiConfig = new DocumentBuilder()
      .setTitle('Chat App API')
      .setDescription('API documentation for the Chat App')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, apiConfig);
    // SwaggerModule.setup('api', app, document);

    app.use('/docs', apiReference({ content: document }));
  }

  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `API documentation is available at: http://localhost:${port}/docs`,
  );
}

void bootstrap();
