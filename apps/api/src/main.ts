import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import { TenantGuard } from './common/tenant.guard';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalGuards(new TenantGuard());

  const staticPath = join(__dirname, '..', 'public');
  if (existsSync(staticPath)) {
    app.useStaticAssets(staticPath);
    const express = app.getHttpAdapter().getInstance();
    express.get('*', (req: { path: string }, res: { sendFile: (path: string) => void }, next: () => void) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/masterdata')) {
        return next();
      }
      return res.sendFile(join(staticPath, 'index.html'));
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
