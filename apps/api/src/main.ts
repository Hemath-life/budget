// Load environment variables first
import 'dotenv/config';

// New Relic must be required first in production
if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import { AppModule } from './app.module';

let app: NestExpressApplication;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Enable gzip compression for better performance
    app.use(compression());

    app.enableCors({
      origin: process.env.CORS_ORIGINS?.split(',') || '*',
      credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Budget App API')
      .setDescription('The Budget App API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.init();
  }
  return app;
}

// For local development
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    app.listen(3001);
  });
}

// Export for Vercel serverless
export default async (req: any, res: any) => {
  // Handle root path directly for health check
  if (req.url === '/' || req.url === '') {
    res.status(200).json({ message: 'Hello World! Budget API is running 🚀' });
    return;
  }

  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
};
