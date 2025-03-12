import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
import {AllExceptionsFilter} from "./dev-filter";

declare const module: any;

dotenvConfig(); // Load .env before anything else

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors();

  // Setup swagger
  const config = new DocumentBuilder()
    .setTitle('GlobeGram')
    .setDescription('A social travel planner')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Include JWT Token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .addSecurityRequirements('JWT-auth')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
