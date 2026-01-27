import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
// modules
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // apply global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: '*',
    methods: ['*'],
    allowedHeaders: ['*'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
