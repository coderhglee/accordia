/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { urlencoded } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 정적 파일 서빙 설정 (React SPA)
  app.useStaticAssets(join(__dirname, '../public'), {
    index: false, // index.html 자동 서빙 비활성화 (SPA 라우팅 때문)
  });

  // CORS 설정 (SPA로 통합되므로 origin 수정)
  app.enableCors({
    origin: [
      'http://localhost:3000', // Identity Provider 자체
    ],
    credentials: true, // 쿠키 전송 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Body parser 설정 (form 데이터 처리를 위해)
  app.use(require('express').urlencoded({ extended: true }));
  app.use('/interaction', urlencoded({ extended: false }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Identity Provider is running on: http://localhost:${port}`
  );
  Logger.log(
    `🔐 OIDC Provider is available at: http://localhost:${port}/oidc`
  );
  Logger.log(
    `🎨 Identity UI is served at: http://localhost:${port}`
  );
}

bootstrap();
