import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser middleware - required for JWT cookie extraction
  app.use(cookieParser());

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('Todo App API')
    .setDescription('API documentation for Todo + Auth system')
    .setVersion('1.0')
    .addBearerAuth() // <-- enables JWT lock icon
    .addApiKey(
      {
        type: 'apiKey',
        name: 'TodoAPIKey',
        in: 'header',
      },
      'TodoAPIKeyAuth', // Security name
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
