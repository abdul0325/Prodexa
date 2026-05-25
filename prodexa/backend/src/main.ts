// eslint-disable-next-line prettier/prettier
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.enableCors({

    origin: (

      origin,
      callback,
    ) => {

      const allowedOrigins = [

        'http://localhost:3000',

        'https://prodexa-mu.vercel.app',
      ];

      // Allow requests with no origin
      // (mobile apps, postman, etc.)

      if (
        !origin ||
        allowedOrigins.includes(origin)
      ) {

        callback(null, true);

      } else {

        callback(
          new Error(
            'Not allowed by CORS',
          ),
        );
      }
    },

    credentials: true,

    methods: [
      'GET',
      'HEAD',
      'PUT',
      'PATCH',
      'POST',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  });

  const port = process.env.BACKEND_PORT || 3001;
  await app.listen(port);
}

bootstrap();
